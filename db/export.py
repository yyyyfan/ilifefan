#!/usr/bin/env python3
"""db/ilife.sqlite -> data/*.json（网站 app.js 读取的格式）。
用法：python3 db/export.py          校验并写出 data/*.json、data/version.json 并更新各 HTML 资源版本号
      python3 db/export.py --rebuild-derived  先按日期重算 image_eras 再导出
      python3 db/export.py --check  校验并与现有 JSON 及 HTML 静态资源版本比对（不写文件）
任何完整性检查失败都会报错并以非零码退出，不会写出文件。"""
import datetime, hashlib, json, os, re, sqlite3, sys
D = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(D)
# 图片统一存放在 Cloudflare R2（桶 ilife-images，任务 019），仓库与 Pages 不再含图片文件。
# images.local 仍存对象键（如 img/xxx.webp）；导出 JSON 时拼成完整公开地址。换域名只改这一处。
# 2026-10-23（任务 021）：改用 R2 自定义域名（2026-10-22 绑定，CF 边缘缓存，替代限速的 r2.dev）。
IMG_BASE = 'https://img.ilifefan.dpdns.org/'
R2_MANIFEST = os.path.join(D, 'r2_manifest.json')   # R2 中已上传对象清单：{键: [字节数, md5, Content-Type]}，由 db/r2_images.py 维护
def img_url(v): return IMG_BASE + v if v and v.startswith('img/') else v   # 站内图片键 -> R2 公开地址；外链原样
c = sqlite3.connect(os.path.join(D, 'ilife.sqlite')); c.row_factory = sqlite3.Row
c.execute('PRAGMA foreign_keys=ON')
Q = lambda sql, *a: c.execute(sql, a).fetchall()
if '--rebuild-derived' in sys.argv:   # 修改 eras 或图片日期后，按日期重算 image_eras
    c.execute('DELETE FROM image_eras')
    c.execute('''INSERT INTO image_eras SELECT i.id,(SELECT e.id FROM eras e WHERE e.start<=i.date ORDER BY e.start DESC LIMIT 1) FROM images i
                 WHERE EXISTS (SELECT 1 FROM eras e WHERE e.start<=i.date)'''); c.commit()
errs = []
def bad(msg): errs.append(msg)
R2 = json.load(open(R2_MANIFEST, encoding='utf-8')) if os.path.exists(R2_MANIFEST) else {}
def img_exists(local): return local in R2   # 以 R2 清单为准（图片不在本地/仓库）

# ---------- 完整性检查 ----------
for r in Q('PRAGMA foreign_key_check'): bad(f'外键失效: {tuple(r)}')
if Q('PRAGMA integrity_check')[0][0] != 'ok': bad('SQLite integrity_check 失败')
def isdate(s):
    try: datetime.date.fromisoformat(s); return True
    except Exception: return False
for t, col, key in [('eras','start','id'),('lives','date','id'),('images','date','id'),('timeline_marks','date','id'),
                    ('member_periods','date_from','id'),('member_periods','date_to','id'),
                    ('songs','mv_date','id'),('songs','release_date','id'),('costumes','debut_date','id'),
                    ('song_videos','date','id')]:
    for r in Q(f'SELECT {key} k,{col} v FROM {t} WHERE {col} IS NOT NULL'):
        if not isdate(r['v']): bad(f'{t}.{col} 日期格式错误: id={r["k"]} {r["v"]!r}')
for r in Q('SELECT id,date_from,date_to FROM member_periods WHERE date_to IS NOT NULL AND date_to<date_from'):
    bad(f'member_periods 起止颠倒: {tuple(r)}')
prev = None
for r in Q('SELECT member_id,ord,date_from FROM member_periods ORDER BY member_id,ord'):
    if prev and prev[0] == r[0] and r[2] < prev[2]: bad(f'member_periods 顺序错误: member {r[0]} ord {r[1]}')
    prev = tuple(r)
es = [r['start'] for r in Q('SELECT start FROM eras ORDER BY sort')]
if es != sorted(es): bad(f'eras 开始日期未按顺序: {es}')
for t, cols in [('members','name'),('eras','name'),('images','url,post_id,local'),('venues','name,pref'),('sources','url'),('songs','title'),('costumes','name')]:
    for r in Q(f'SELECT {cols},count(*) n FROM {t} GROUP BY {cols} HAVING n>1'): bad(f'{t} 重复 ({cols}): {tuple(r)}')
ALLOWED_LIVE_TYPES = {'ワンマン', '主催', '対バン', 'フェス', 'リリイベ', '生誕祭', '配信', 'その他'}
for r in Q('SELECT id, type FROM lives'):
    if r['type'] not in ALLOWED_LIVE_TYPES: bad(f'lives.type 取值非法: id={r["id"]} {r["type"]!r}')
for r in Q('SELECT id FROM lives WHERE source_id IS NULL'): bad(f'lives 缺少出处: id={r["id"]}')
for r in Q('SELECT date, venue_id, count(*) n FROM lives GROUP BY date, venue_id HAVING n>1'):
    bad(f'lives 同日同会场重复: date={r["date"]} venue_id={r["venue_id"]} ({r["n"]} 场)')
def istime(s):
    return bool(re.match(r'^\d{2}:\d{2}$', s))
for col in ['open_time', 'start_time']:
    for r in Q(f'SELECT id, {col} v FROM lives WHERE {col} IS NOT NULL'):
        if not istime(r['v']): bad(f'lives.{col} 时间格式错误: id={r["id"]} {r["v"]!r}')
for r in Q('SELECT c.id, i.local FROM costumes c JOIN images i ON i.id = c.image_id WHERE c.image_id IS NOT NULL'):
    if r['local'] and not img_exists(r['local']):
        bad(f'打歌服主图不在 R2 清单 db/r2_manifest.json: costume={r["id"]} {r["local"]}')
for r in Q('SELECT ci.costume_id, i.local FROM costume_images ci JOIN images i ON i.id = ci.image_id'):
    if r['local'] and not img_exists(r['local']):
        bad(f'打歌服关联图片不在 R2 清单 db/r2_manifest.json: costume={r["costume_id"]} {r["local"]}')
for r in Q('SELECT s.id, i.local FROM songs s JOIN images i ON i.id = s.cover_image_id WHERE s.cover_image_id IS NOT NULL'):
    if r['local'] and not img_exists(r['local']):
        bad(f'歌曲封面图片不在 R2 清单 db/r2_manifest.json: song={r["id"]} {r["local"]}')
for r in Q('SELECT l.id, i.local FROM lives l JOIN images i ON i.id = l.cover_image_id WHERE l.cover_image_id IS NOT NULL'):
    if r['local'] and not img_exists(r['local']):
        bad(f'公演封面图片不在 R2 清单 db/r2_manifest.json: live={r["id"]} {r["local"]}')
for r in Q('SELECT li.live_id, i.local FROM image_lives li JOIN images i ON i.id = li.image_id'):
    if r['local'] and not img_exists(r['local']):
        bad(f'公演关联图片不在 R2 清单 db/r2_manifest.json: live={r["live_id"]} {r["local"]}')
for r in Q('SELECT si.song_id, i.local FROM song_images si JOIN images i ON i.id = si.image_id'):
    if r['local'] and not img_exists(r['local']):
        bad(f'歌曲关联图片不在 R2 清单 db/r2_manifest.json: song={r["song_id"]} {r["local"]}')
for r in Q('SELECT id, video_id, official, channel FROM song_videos'):
    if r['official'] not in (0, 1):
        bad(f'song_videos.official 只能是 0/1: id={r["id"]} {r["official"]!r}')
    if r['official'] == 0 and not r['channel']:
        bad(f'非官方影像必须记录上传频道: id={r["id"]}')
for r in Q('SELECT id, video_id, thumb FROM song_videos'):
    if not re.match(r'^[A-Za-z0-9_-]{11}$', r['video_id']):
        bad(f'song_videos.video_id 非法: id={r["id"]} {r["video_id"]!r}')
    if r['thumb'] and not r['thumb'].startswith('https://'):
        bad(f'song_videos.thumb 应为 https 直链: id={r["id"]} {r["thumb"]!r}')
for r in Q('SELECT id, duration FROM songs WHERE duration IS NOT NULL'):
    if not re.match(r'^\d{1,2}:[0-5]\d$', r['duration']):
        bad(f'songs.duration 格式应为 m:ss: id={r["id"]} {r["duration"]!r}')
for r in Q('SELECT id, member_id FROM songs WHERE member_id IS NOT NULL'):
    if not Q('SELECT 1 FROM members WHERE id=?', r['member_id']):
        bad(f'songs.member_id 指向不存在的成员: song={r["id"]} member={r["member_id"]}')
# 每场出演成员（任务 028）
for r in Q('SELECT live_id, member_id, status FROM live_members'):
    if r['status'] not in ('出演', '支援', '非正式', '休演', '未出演'):
        bad(f'live_members.status 非法: live={r["live_id"]} member={r["member_id"]} {r["status"]!r}')
    if not Q('SELECT 1 FROM members WHERE id=?', r['member_id']):
        bad(f'live_members.member_id 指向不存在的成员: live={r["live_id"]} member={r["member_id"]}')
for r in Q('SELECT l.id FROM lives l LEFT JOIN live_members lm ON lm.live_id=l.id GROUP BY l.id HAVING COUNT(lm.member_id)=0'):
    bad(f'公演没有任何出演成员记录: live={r["id"]}')
for r in Q('SELECT id,local FROM images WHERE local IS NOT NULL'):
    if not img_exists(r['local']): bad(f'图片不在 R2 清单 db/r2_manifest.json: id={r["id"]} {r["local"]}')
for r in Q("SELECT id,url FROM images WHERE url LIKE 'img/%'"):
    if not img_exists(r['url']): bad(f'图片 url 不在 R2 清单 db/r2_manifest.json: id={r["id"]} {r["url"]}')
for r in Q("SELECT id FROM images WHERE instr(key_order,'member')=0 AND id IN (SELECT image_id FROM image_members)"
           " UNION SELECT id FROM images WHERE instr(','||key_order||',',',member,')>0 AND id NOT IN (SELECT image_id FROM image_members)"):
    bad(f'image_members 与 images.key_order 不一致: id={r[0]}')
for r in Q('SELECT image_id,count(*) n FROM image_members GROUP BY image_id HAVING n>1'):
    bad(f'图片关联多名成员，images.json 只支持一名: id={r[0]}')
eras = Q('SELECT id,start FROM eras ORDER BY start')
cur = {r['image_id']: r['era_id'] for r in Q('SELECT * FROM image_eras')}
for r in Q('SELECT id,date FROM images'):
    want = ([e['id'] for e in eras if e['start'] <= r['date']] or [None])[-1]
    if cur.get(r['id']) != want: bad(f'image_eras 与日期不符: id={r["id"]} {cur.get(r["id"])} != {want}')
for r in Q('SELECT i.id,i.era,e.era_id FROM images i LEFT JOIN image_eras e ON e.image_id=i.id WHERE i.era IS NOT NULL AND i.era IS NOT e.era_id'):
    bad(f'images.era 与日期推算时期不符: id={r[0]} {r[1]} != {r[2]}（时期起始日=新体制首批アー写或成员变动日）')
for r in Q('SELECT id,local,w,h FROM images'):
    if r['local'] and (r['w'] is None) != (r['h'] is None): bad(f'图片尺寸不完整: id={r["id"]}')
for r in Q('SELECT DISTINCT pref FROM venues'):
    if not Q('SELECT 1 FROM region_geo WHERE pref=?', r['pref']):
        bad(f'venues.pref 缺少 region_geo: {r["pref"]}')
for r in Q('SELECT pref,name_ja,lat,lng,kind FROM region_geo'):
    if r['kind'] not in ('pref', 'overseas', 'unknown'):
        bad(f'region_geo.kind 非法: {r["pref"]} {r["kind"]!r}')
    if r['kind'] == 'pref':
        if r['lat'] is None or r['lng'] is None or not r['name_ja']:
            bad(f'region_geo 都道府县缺少坐标或日文名: {r["pref"]}')
        elif not (24 <= r['lat'] <= 46 and 122 <= r['lng'] <= 154):
            bad(f'region_geo 坐标超出日本范围: {r["pref"]} {r["lat"]} {r["lng"]}')
    elif r['lat'] is not None or r['lng'] is not None:
        bad(f'region_geo 非地图地区不应有坐标: {r["pref"]}')
if errs:
    print('完整性检查失败（%d 项）：' % len(errs), file=sys.stderr)
    for e in errs[:200]: print('  -', e, file=sys.stderr)
    sys.exit(1)

# ---------- 生成 ----------
url = {r['id']: r['url'] for r in Q('SELECT * FROM sources')}
def obj(order, get):
    return {k: get(k) for k in order.split(',')} if order else {}
out = {}
fs = {}
for r in Q('SELECT * FROM member_fields_sources ORDER BY member_id,ord'): fs.setdefault(r['member_id'], {})[r['field']] = url[r['source_id']]
mname = {}
member_live_count = {}
for r in Q("SELECT member_id, COUNT(*) n FROM live_members WHERE status IN ('出演','支援','非正式') GROUP BY member_id"):
    member_live_count[r['member_id']] = r['n']
M = []
for r in Q('SELECT * FROM members ORDER BY sort'):
    mname[r['id']] = r['name']
    d = obj(r['key_order'], lambda k: url.get(r['source_id']) if k == 'source' else fs.get(r['id'], {}) if k == 'sources'
            else r['left_'] if k == 'left' else r[k])
    # 「出演公演数」插在 status 之后（任务 028）；id 供 lives.json 的 members 映射回名字
    nd = {'id': r['id']}
    for k, v in d.items():
        nd[k] = v
        if k == 'status':
            nd['lives'] = member_live_count.get(r['id'], 0)
    if 'lives' not in nd:
        nd['lives'] = member_live_count.get(r['id'], 0)
    M.append(nd)
out['members'] = M
lineup = {}
for r in Q('SELECT * FROM era_members ORDER BY era_id,ord'):
    lineup.setdefault(r['era_id'], []).append(mname[r['member_id']] + (f"({r['role']})" if r['role'] else ''))
out['eras'] = [{'id': r['id'], 'name': r['name'], 'start': r['start'], 'lineup': lineup.get(r['id'], []),
                'change': r['change'], 'source': url.get(r['source_id'])} for r in Q('SELECT * FROM eras ORDER BY sort')]
img_info = {r['id']: {'id': r['id'], 'local': img_url(r['local']), 'w': r['w'], 'h': r['h'], 'url': img_url(r['url'])} for r in Q('SELECT id,local,w,h,url FROM images')}
# 公演配图另带图片自身的来源帖与账号（主办方海报的出处不同于公演出处）
live_img_info = {r['id']: {**img_info[r['id']], 'post': url.get(r['post_id']), 'source': r['source']}
                 for r in Q('SELECT id,post_id,source FROM images') if r['id'] in img_info}
live_imgs = {}
for r in Q('SELECT live_id, image_id FROM image_lives ORDER BY live_id, ord'):
    if r['image_id'] in live_img_info:
        live_imgs.setdefault(r['live_id'], []).append(live_img_info[r['image_id']])

# 每场出演成员（任务 028）：由 member_periods 按日期推导，{成员id: 状态}，按成员 sort 排序
live_members = {}
for r in Q('SELECT lm.live_id, lm.member_id, lm.status FROM live_members lm JOIN members m ON m.id=lm.member_id ORDER BY lm.live_id, m.sort'):
    live_members.setdefault(r['live_id'], {})[str(r['member_id'])] = r['status']

out['lives'] = [{
    'id': r['id'],
    'date': r['date'],
    'title': r['title'],
    'type': r['type'],
    'venue': r['vn'],
    'pref': r['pref'],
    'open_time': r['open_time'],
    'start_time': r['start_time'],
    'note': r['note'],
    'setlist': r['setlist'],
    'is_headliner': r['is_headliner'],
    'source': url.get(r['source_id']),
    'cover': live_img_info.get(r['cover_image_id']),
    'images': live_imgs.get(r['id'], [live_img_info[r['cover_image_id']]] if r['cover_image_id'] in live_img_info else []),
    'members': live_members.get(r['id'], {}),
} for r in Q('SELECT l.*, v.name vn, v.pref FROM lives l JOIN venues v ON v.id=l.venue_id ORDER BY l.date, l.id')]
seg = {}
for r in Q('SELECT * FROM member_periods ORDER BY member_id,ord'):
    seg.setdefault(r['member_id'], []).append(obj(r['key_order'], lambda k: r[{'from': 'date_from', 'to': 'date_to'}.get(k, k)]))
meta = {r['key']: r['value'] for r in Q('SELECT * FROM meta')}
out['timeline'] = {'source': meta['timeline.source'], 'note': meta['timeline.note'],
                   'members': [{'name': r['name'], 'segments': seg.get(r['id'], [])} for r in Q('SELECT id,name FROM members WHERE tl_sort IS NOT NULL ORDER BY tl_sort')],
                   'marks': [{'date': r['date'], 'label': r['label']} for r in Q('SELECT * FROM timeline_marks ORDER BY id')]}
im = {r['image_id']: mname[r['member_id']] for r in Q('SELECT * FROM image_members')}
out['images'] = [obj(r['key_order'], lambda k: url.get(r['post_id']) if k == 'post' else im.get(r['id']) if k == 'member' else img_url(r[k]) if k in ('local', 'url') else r[k])
                 for r in Q('SELECT * FROM images ORDER BY id')]

era_name = {r['id']: r['name'] for r in Q('SELECT id,name FROM eras')}
costume_imgs = {}
for r in Q('SELECT costume_id, image_id FROM costume_images ORDER BY costume_id, ord'):
    if r['image_id'] in img_info:
        costume_imgs.setdefault(r['costume_id'], []).append(img_info[r['image_id']])

costumes_by_song = {}
for r in Q('SELECT * FROM costumes ORDER BY song_id, id'):
    c_entry = {
        'id': r['id'],
        'name': r['name'],
        'era': r['era_id'],
        'era_name': era_name.get(r['era_id']),
        'debut_date': r['debut_date'],
        'note': r['note'],
        'source': url.get(r['source_id']),
        'image': img_info.get(r['image_id']),
        'images': costume_imgs.get(r['id'], [img_info[r['image_id']]] if r['image_id'] in img_info else [])
    }
    costumes_by_song.setdefault(r['song_id'], []).append(c_entry)

song_videos_by_song = {}
for r in Q('SELECT * FROM song_videos ORDER BY song_id, ord'):
    song_videos_by_song.setdefault(r['song_id'], []).append({
        'id': r['video_id'],
        'kind': r['kind'],
        'title': r['title'],
        'date': r['date'],
        'url': f'https://www.youtube.com/watch?v={r["video_id"]}',
        'thumb': r['thumb'],
        'official': bool(r['official']),
        'channel': r['channel'],
    })

song_imgs_by_song = {}
for r in Q('SELECT song_id, image_id FROM song_images ORDER BY song_id, ord'):
    if r['image_id'] in live_img_info:
        song_imgs_by_song.setdefault(r['song_id'], []).append(live_img_info[r['image_id']])

out['songs'] = [{
    'id': r['id'],
    'title': r['title'],
    'kana': r['kana'],
    'member': mname.get(r['member_id']),
    'duration': r['duration'],
    'mv_date': r['mv_date'],
    'release_date': r['release_date'],
    'release': r['release'],
    'note': r['note'],
    'source': url.get(r['source_id']),
    'cover': img_info.get(r['cover_image_id']),
    'videos': song_videos_by_song.get(r['id'], []),
    'images': song_imgs_by_song.get(r['id'], []),
    'costumes': costumes_by_song.get(r['id'], [])
} for r in Q('SELECT * FROM songs ORDER BY id')]

def coord(v):
    return None if v is None else round(float(v), 5)
out['geo'] = [{
    'pref': r['pref'],
    'name_ja': r['name_ja'],
    'lat': coord(r['lat']),
    'lng': coord(r['lng']),
    'kind': r['kind'],
} for r in Q('SELECT pref,name_ja,lat,lng,kind FROM region_geo ORDER BY ord')]

def dump(n, d):
    return json.dumps(d, ensure_ascii=False, separators=(',', ':')) if n == 'images' else json.dumps(d, ensure_ascii=False, indent=1)
check = '--check' in sys.argv; diff = 0
for n, d in out.items():
    p = os.path.join(ROOT, 'data', n + '.json'); s = dump(n, d)
    if check:
        old = open(p, encoding='utf-8').read() if os.path.exists(p) else ''
        same = old == s; sem = same or (old and json.loads(old) == d)
        print(f'{n}.json: {"逐字节一致" if same else "语义一致（格式不同）" if sem else "不一致!"} ({len(s.encode())} bytes)')
        diff += not sem
    else:
        open(p, 'w', encoding='utf-8').write(s); print(f'写出 data/{n}.json ({len(d)} 条)')

# ---------- 静态资源版本与 Cache Busting ----------
vh = hashlib.sha256()
for fn in ['style.css', 'app.js']:
    fp = os.path.join(ROOT, fn)
    if os.path.exists(fp):
        with open(fp, 'rb') as f:
            vh.update(f.read())
for n in sorted(out.keys()):
    vh.update(n.encode('utf-8'))
    vh.update(dump(n, out[n]).encode('utf-8'))
version = vh.hexdigest()[:8]

ver_p = os.path.join(ROOT, 'data', 'version.json')
ver_s = json.dumps({'version': version}, indent=1) + '\n'
if check:
    old_v = open(ver_p, encoding='utf-8').read() if os.path.exists(ver_p) else ''
    same_v = old_v == ver_s
    print(f'version.json: {"逐字节一致" if same_v else "不一致!"} ({len(ver_s.encode())} bytes, 版本: {version})')
    diff += not same_v
else:
    open(ver_p, 'w', encoding='utf-8').write(ver_s)
    print(f'写出 data/version.json (版本: {version})')

html_files = sorted([f for f in os.listdir(ROOT) if f.endswith('.html')])
for hf in html_files:
    hp = os.path.join(ROOT, hf)
    content = open(hp, encoding='utf-8').read()
    new_content = re.sub(r'href=["\']?style\.css(?:\?v=[^"\'\s>]+)?["\']?', f'href="style.css?v={version}"', content)
    new_content = re.sub(r'src=["\']?app\.js(?:\?v=[^"\'\s>]+)?["\']?', f'src="app.js?v={version}"', new_content)
    if check:
        same_h = content == new_content
        if not same_h:
            print(f'{hf}: 静态资源版本不一致 (期望 ?v={version})')
            diff += 1
        else:
            print(f'{hf}: 静态资源版本一致 (?v={version})')
    else:
        if content != new_content:
            open(hp, 'w', encoding='utf-8').write(new_content)
            print(f'更新 {hf} (版本: {version})')
        else:
            print(f'{hf}: 版本无需更新 ({version})')

sys.exit(1 if diff else 0)

