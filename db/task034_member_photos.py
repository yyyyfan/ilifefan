#!/usr/bin/env python3
"""任务 034：把成员个人 X 账号的照片全量收进图库。

背景：`kind='individual'` 的 785 张里，726 张来自官方号 @iLiFE_official，只有 4 张来自
成员本人账号。而成员个人号才是自拍/チェキ/告知照的主要来源——现役 9 人账号媒体量合计
约 4500 条。官网 `ilife-heroines.com/profile/` 的公式照已全部收录（Wayback 7 个批次 55 张，
与库内一一对应），没有增量；Instagram / TikTok 有登录墙，脚本抓不到，只能人工补。

数据源：fxtwitter 的 `GET /2/profile/<handle>/media`（公开、无需鉴权）。
响应里 `media.photos[]` 带 media id、`?name=orig` 原图地址、宽高、`created_at`。
一个请求最多 100 条，用 `cursor.bottom` 翻页。

分四步（图片必须先上 R2 才能入库）：

  python3 db/task034_member_photos.py --scan          # 抓各账号媒体时间线 → db/.cache_member/scan/
  python3 db/task034_member_photos.py --fetch         # 下载 → 转 webp（长边≤2048、≤1MB）存 img/
  python3 db/task034_member_photos.py --upload        # 传 R2 + 登记清单
  python3 db/task034_member_photos.py --apply         # 入库 + 挂 image_members / image_eras

  --member=真守みゅう   只处理某一位（按人分批跑，每批都是完整闭环）
  --limit=20           只处理前 N 张（试跑用）
  --jobs=4             上传并发数
  --status             看各账号进度

每一步都断点续跑：scan 按账号落盘、fetch/upload 按 media id 落盘，中途挂掉重跑不会重来。
"""
import concurrent.futures as cf
import io
import json
import os
import re
import sqlite3
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request

from PIL import Image

D = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(D)
DB = os.path.join(D, 'ilife.sqlite')
CACHE = os.path.join(D, '.cache_member')
SCANDIR = os.path.join(CACHE, 'scan')
STAGE = os.path.join(CACHE, 'stage.json')
IMG = os.path.join(ROOT, 'img')
MANIFEST = os.path.join(D, 'r2_manifest.json')

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
API = 'https://api.fxtwitter.com/2/profile/{}/media?count=100'
PAGE_GAP = 2.0          # 两次 API 请求之间歇一下，fxtwitter 对同一 IP 限 1000 req/min
MAXSIDE = 2048
MAXBYTES = 1024 * 1024
KEY_ORDER = 'url,orig,date,post,text,category,local,source,kind,member,era,w,h,match'
MATCH = '成员本人账号投稿'

ARGS = sys.argv[1:]
DRY = '--dry-run' in ARGS


def opt(name, default=None):
    for a in ARGS:
        if a.startswith(f'--{name}='):
            return a.split('=', 1)[1]
    return default


ONLY = opt('member')
LIMIT = int(opt('limit', 0) or 0)
JOBS = int(opt('jobs', 4) or 4)

lock = threading.Lock()


def db():
    c = sqlite3.connect(DB, timeout=30)
    c.row_factory = sqlite3.Row
    return c


def members():
    """有个人 X 账号的成员。"""
    out = []
    for r in db().execute("SELECT id,name,x FROM members WHERE x IS NOT NULL AND x<>'' AND x<>'-' ORDER BY sort"):
        if ONLY and r['name'] != ONLY:
            continue
        out.append({'id': r['id'], 'name': r['name'], 'handle': r['x']})
    return out


def get_json(url, tries=5):
    """404 也重试：fxtwitter 在上游抽风/限流时用 404 + 空 results 冒充，不是真不存在。"""
    wait = 10
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers=UA)
            d = json.load(urllib.request.urlopen(req, timeout=45))
            if d.get('code') == 200:
                return d
            last = f"code={d.get('code')} {d.get('message') or ''}"
        except urllib.error.HTTPError as e:
            last = f'HTTP {e.code}'
            try:
                body = json.loads(e.read().decode('utf-8', 'ignore'))
                last += f" {body.get('message') or ''}"
            except Exception:
                pass
        except Exception as e:
            last = str(e)
        if i < tries - 1:
            print(f'    {last}，{wait}s 后重试（{i + 1}/{tries - 1}）')
            time.sleep(wait)
            wait = min(wait * 2, 90)
    print(f'    ✗ 放弃：{last}')
    return None


def dstr(t):
    """'Sat May 16 13:01:06 +0000 2026' → '2026-05-16'。"""
    m = re.search(r'(\w{3}) (\w{3}) (\d{1,2}) [\d:]+ [+-]\d{4} (\d{4})', t or '')
    if not m:
        return None
    mon = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
           'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12}[m.group(2)]
    return f'{m.group(4)}-{mon:02d}-{int(m.group(3)):02d}'


def scan_path(handle):
    return os.path.join(SCANDIR, f'{handle}.json')


def load_stage():
    return json.load(open(STAGE, encoding='utf-8')) if os.path.exists(STAGE) else {}


def save_stage(s):
    os.makedirs(CACHE, exist_ok=True)
    json.dump(s, open(STAGE, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)


# ---------- 1. scan ----------
def profile_of(handle):
    """先看账号还活着没、有没有媒体。已注销/清空的账号直接跳过，
    否则每个都要在 404 上重试 5 次（约 2.5 分钟）白等。"""
    p = os.path.join(CACHE, 'profile.json')
    cache = json.load(open(p, encoding='utf-8')) if os.path.exists(p) else {}
    if handle in cache:
        return cache[handle]
    d = get_json('https://api.fxtwitter.com/2/profile/' + handle, tries=2)
    info = {'ok': bool(d), 'media': ((d or {}).get('user') or {}).get('media_count', 0)}
    cache[handle] = info
    os.makedirs(CACHE, exist_ok=True)
    json.dump(cache, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    return info


def cmd_scan():
    os.makedirs(SCANDIR, exist_ok=True)
    for m in members():
        p = scan_path(m['handle'])
        st = json.load(open(p, encoding='utf-8')) if os.path.exists(p) else \
            {'member': m['name'], 'member_id': m['id'], 'handle': m['handle'],
             'cursor': None, 'done': False, 'photos': [], 'seen': [], 'videos': 0, 'posts': 0}
        if st['done']:
            print(f"  {m['name']:<8} @{m['handle']:<16} 已完成 {len(st['photos'])} 张，跳过", flush=True)
            continue
        if not st['photos']:
            pf = profile_of(m['handle'])
            if not pf['ok'] or not pf['media']:
                st['done'] = True
                json.dump(st, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
                print(f"  {m['name']:<8} @{m['handle']:<16} 账号已注销/无媒体，跳过", flush=True)
                continue
        print(f"  {m['name']:<8} @{m['handle']:<16} 续跑（已有 {len(st['photos'])} 张）", flush=True)
        seen = set(st['seen'])
        seen_cursors = {st['cursor']} if st['cursor'] else set()
        while True:
            url = API.format(m['handle']) + (f"&cursor={urllib.parse.quote(st['cursor'])}" if st['cursor'] else '')
            d = get_json(url)
            if not d:
                break
            got = 0
            for r in d.get('results', []):
                md = r.get('media') or {}
                st['posts'] += 1
                st['videos'] += len(md.get('videos') or [])
                for ph in md.get('photos') or []:
                    mid = ph.get('id')
                    if not mid or mid in seen:
                        continue
                    seen.add(mid)
                    st['photos'].append({
                        'mid': mid, 'tweet': r['id'], 'url': ph.get('url'),
                        'w': ph.get('width'), 'h': ph.get('height'),
                        'date': dstr(r.get('created_at')),
                        'text': (r.get('text') or '')[:300],
                    })
                    got += 1
            st['seen'] = sorted(seen)
            nxt = (d.get('cursor') or {}).get('bottom')
            # 到底了，或游标原地打转（X 对深翻页会返回同一页），都算结束
            st['done'] = not nxt or nxt in seen_cursors or got == 0
            if nxt and not st['done']:
                seen_cursors.add(nxt)
            st['cursor'] = nxt
            json.dump(st, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
            print(f"    +{got} 张（累计 {len(st['photos'])}）{'完' if st['done'] else ''}", flush=True)
            if st['done']:
                break
            time.sleep(PAGE_GAP)
    cmd_status()


def cmd_status():
    print('\n各账号进度：')
    tot = 0
    for m in members():
        p = scan_path(m['handle'])
        if not os.path.exists(p):
            print(f"  {m['name']:<8} @{m['handle']:<16} 未扫描")
            continue
        st = json.load(open(p, encoding='utf-8'))
        tot += len(st['photos'])
        print(f"  {m['name']:<8} @{m['handle']:<16} {len(st['photos']):>4} 张"
              f"{'（完成）' if st['done'] else '（未完成）'}  视频 {st['videos']} 条已跳过")
    print(f'  合计照片 {tot} 张')


# ---------- 2. fetch ----------
def all_photos():
    out = []
    for m in members():
        p = scan_path(m['handle'])
        if not os.path.exists(p):
            continue
        st = json.load(open(p, encoding='utf-8'))
        for ph in st['photos']:
            ph = dict(ph)
            ph['handle'] = st['handle']
            ph['member'] = st['member']
            ph['member_id'] = st['member_id']
            out.append(ph)
    return out


def mid_of(v):
    """从 local 键名或 pbs 地址里认出 media id。三种写法都要认：
    img/member-<mid>.webp、img/<mid>.jpg（旧图）、https://pbs.twimg.com/media/<mid>.jpg。"""
    if not v:
        return None
    m = re.search(r'/member-([A-Za-z0-9_-]+)\.webp$', v)
    if m:
        return m.group(1)
    m = re.search(r'/media/([A-Za-z0-9_-]+)', v)
    if m:
        return m.group(1)
    m = re.search(r'/([A-Za-z0-9_-]{15,})\.(?:jpg|png|webp)', v)
    return m.group(1) if m else None


def known_mids():
    """库里已登记的媒体 ID。"""
    out = set()
    for r in db().execute('SELECT local,url,orig FROM images'):
        for v in (r['local'], r['url'], r['orig']):
            m = mid_of(v)
            if m:
                out.add(m)
    return out


def key_of(mid):
    return f'img/member-{mid}.webp'


def one_fetch(ph):
    dst = os.path.join(ROOT, key_of(ph['mid']))
    if os.path.exists(dst):
        im = Image.open(dst)
        return {'w': im.width, 'h': im.height, 'bytes': os.path.getsize(dst)}
    raw = urllib.request.urlopen(urllib.request.Request(ph['url'], headers=UA), timeout=60).read()
    im = Image.open(io.BytesIO(raw))
    im.load()
    if im.mode != 'RGB':
        im = im.convert('RGB')
    if max(im.size) > MAXSIDE:
        r = MAXSIDE / max(im.size)
        im = im.resize((max(1, round(im.width * r)), max(1, round(im.height * r))), Image.LANCZOS)
    q = 88
    while True:
        im.save(dst, 'WEBP', quality=q, method=6)
        if os.path.getsize(dst) <= MAXBYTES or q <= 60:
            break
        q -= 8
    return {'w': im.width, 'h': im.height, 'bytes': os.path.getsize(dst)}


def cmd_fetch():
    stage = load_stage()
    known = known_mids()
    todo = [p for p in all_photos() if p['mid'] not in known and p['mid'] not in stage]
    if LIMIT:
        todo = todo[:LIMIT]
    print(f'待下载 {len(todo)} 张（已在库/已暂存跳过）')
    os.makedirs(IMG, exist_ok=True)
    ok = fail = 0
    done = 0
    with cf.ThreadPoolExecutor(max_workers=8) as ex:
        futs = {ex.submit(one_fetch, p): p for p in todo}
        for fu in cf.as_completed(futs):
            p = futs[fu]
            done += 1
            try:
                info = fu.result()
                stage[p['mid']] = {**p, **info, 'key': key_of(p['mid'])}
                ok += 1
            except Exception as e:
                fail += 1
                print(f"  ✗ {p['mid']} {type(e).__name__}: {e}")
            if done % 25 == 0:
                save_stage(stage)
                print(f'  {done}/{len(todo)} ok={ok} fail={fail}')
    save_stage(stage)
    print(f'暂存 {ok} 张，失败 {fail} 张 → {STAGE}')


# ---------- 3. upload ----------
def cmd_upload():
    stage = load_stage()
    man = json.load(open(MANIFEST, encoding='utf-8'))
    todo = [v['key'] for k, v in sorted(stage.items()) if v['key'] not in man]
    if ONLY:
        keep = {v['key'] for v in stage.values() if v['member'] == ONLY}
        todo = [k for k in todo if k in keep]
    if LIMIT:
        todo = todo[:LIMIT]
    print(f'待上传 {len(todo)} 张（{JOBS} 并发）')

    def put(key):
        r = subprocess.run(['npx', '--yes', 'wrangler', 'r2', 'object', 'put', f'ilife-images/{key}',
                            '--file', key, '--content-type', 'image/webp', '--remote'],
                           cwd=ROOT, shell=(os.name == 'nt'), capture_output=True, text=True)
        return key, r.returncode

    ok = fail = 0
    done = 0
    uploaded = []
    with cf.ThreadPoolExecutor(max_workers=JOBS) as ex:
        for key, rc in ex.map(put, todo):
            done += 1
            if rc == 0:
                ok += 1
                uploaded.append(key)
            else:
                fail += 1
                print(f'  ✗ {key}')
            if done % 20 == 0:
                print(f'  {done}/{len(todo)} ok={ok} fail={fail}')
    print(f'上传 {ok} 张，失败 {fail} 张')
    if uploaded:
        subprocess.run([sys.executable, os.path.join(D, 'r2_images.py'), 'add'] + uploaded, cwd=ROOT)


# ---------- 4. apply ----------
def era_of(cur, date):
    hit = [r['id'] for r in cur.execute('SELECT id,start FROM eras ORDER BY start') if r['start'] <= date]
    return hit[-1] if hit else None


def cmd_apply():
    stage = load_stage()
    man = json.load(open(MANIFEST, encoding='utf-8'))
    c = db()
    cur = c.cursor()
    known = known_mids()
    n_img = 0
    for mid, v in sorted(stage.items(), key=lambda x: x[1]['date'] or ''):
        if mid in known:
            continue
        if v['key'] not in man:
            continue
        if ONLY and v['member'] != ONLY:
            continue
        if LIMIT and n_img >= LIMIT:
            break
        date = v['date']
        era = era_of(cur, date)
        if not era:
            print(f'  ✗ {mid} 日期 {date} 无对应时期，跳过')
            continue
        tweet_url = f"https://x.com/{v['handle']}/status/{v['tweet']}"
        row = cur.execute('SELECT id FROM sources WHERE url=?', (tweet_url,)).fetchone()
        sid = row['id'] if row else cur.execute('INSERT INTO sources(url) VALUES(?)', (tweet_url,)).lastrowid
        if DRY:
            print(f"  [dry] {mid} {date} {v['member']} {v['key']}")
            n_img += 1
            continue
        cur.execute('INSERT INTO images(url,orig,date,post_id,text,category,local,source,kind,era,w,h,key_order,match)'
                    ' VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                    (v['url'], re.sub(r'\?.*$', '', v['url']), date, sid, v['text'], 'member',
                     v['key'], f"X @{v['handle']}", 'individual', era, v['w'], v['h'], KEY_ORDER, MATCH))
        iid = cur.lastrowid
        cur.execute('INSERT OR IGNORE INTO image_members(image_id,member_id) VALUES(?,?)', (iid, v['member_id']))
        cur.execute('INSERT OR REPLACE INTO image_eras(image_id,era_id) VALUES(?,?)', (iid, era))
        n_img += 1
    if DRY:
        c.rollback()
    else:
        c.commit()
    print(f'{"[dry] " if DRY else ""}入库 {n_img} 张')


if __name__ == '__main__':
    if '--scan' in ARGS:
        cmd_scan()
    elif '--fetch' in ARGS:
        cmd_fetch()
    elif '--upload' in ARGS:
        cmd_upload()
    elif '--apply' in ARGS:
        cmd_apply()
    elif '--status' in ARGS:
        cmd_status()
    else:
        sys.exit(__doc__)
