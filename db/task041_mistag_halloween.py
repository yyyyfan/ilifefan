#!/usr/bin/env python3
"""任务 041：近期官方/官网错标修正，并入库 2026-10-26 純嶺みき万圣节个人照。

只改 db/ilife.sqlite。图片须已在 R2，且 db/r2_manifest.json 已有对应键。
可重复执行：已改过的行不会再改。
"""
import json, os, sqlite3
from email.utils import parsedate_to_datetime
from datetime import timezone, timedelta

D = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(D)
DB = os.path.join(D, 'ilife.sqlite')
MAN = os.path.join(D, 'r2_manifest.json')
CACHE = os.path.join(D, '.cache_x')
JST = timezone(timedelta(hours=9))

# 2026-06-05 两帖【新アー写公開】里的单人图。后一帖三张与前一帖三张在
# pbs.twimg name=large 上字节相同，画面都是同一人，不是文案名单里的另外三人。
SOLOS = {
    3622: 9,  # 真守みゅう【ピンク】
    3623: 4,  # 若葉のあ【緑】
    3624: 6,  # 虹羽みに【水色】
    3626: 9,
    3627: 4,
    3628: 6,
}
KEEP_GROUP = (3621, 3625)
SOLO_NOTE = (
    '任务041：打开该帖画面，这张是单人アー写，不是九人合照。'
    '担当色与同帖正文一致（ピンク=真守みゅう / 緑=若葉のあ / 水色=虹羽みに）。'
    '后一帖三张个人图与前一帖对应图在 Twitter large 上字节相同。同帖九人合照仍为 kind=group。'
)
SITE_TEXT = (
    '官网 profile 主视觉（max_profile_20260710）。画面是单人粉色近景，不是体制合照。'
    '页面 alt 为团体名，未点名成员。'
)
SITE_NOTE = (
    '任务041：打开 https://ilife-heroines.com/profile/ ，主图链接是 max_profile_20260710，'
    'alt 为「iLiFE!【あいらいふ】」。对象画面是单人粉色近景，与 #3622 同一人，不是九人合照。'
    '改为 kind=individual，不挂成员：页面没有点名；若挂上，成员卡按图片 id 取最新一张公式个人图，'
    '会盖掉真守みゅう更晚的 #4578。'
)
MIKI = '2114658662820294785'
NEW = (
    ('img/member-7-HVjG1hhbYAA7VrV.webp', 'HVjG1hhbYAA7VrV', 1365, 2048),
    ('img/member-7-HVjG1hhaQAAjP0a.webp', 'HVjG1hhaQAAjP0a', 1365, 2048),
)


def append_tokens(order, tokens):
    parts = [p for p in (order or '').split(',') if p]
    for t in tokens:
        if t not in parts:
            parts.append(t)
    return ','.join(parts)


def era_of(cur, date):
    row = cur.execute(
        'SELECT id FROM eras WHERE start<=? ORDER BY start DESC LIMIT 1', (date,)
    ).fetchone()
    if not row:
        raise SystemExit(f'没有对应时期: {date}')
    return row[0]


def tweet(status_id):
    path = os.path.join(CACHE, status_id + '.json')
    if not os.path.exists(path):
        raise SystemExit(f'缺少已打开的帖缓存 db/.cache_x/{status_id}.json')
    data = json.load(open(path, encoding='utf-8'))
    tw = data['tweet']
    if (tw.get('author') or {}).get('screen_name') != 'iLiFE_official':
        raise SystemExit(f'不是官方帖: {status_id}')
    created = parsedate_to_datetime(tw['created_at']).astimezone(JST)
    photos = (tw.get('media') or {}).get('photos') or []
    return tw['text'], created.date().isoformat(), photos


def main():
    man = json.load(open(MAN, encoding='utf-8'))
    c = sqlite3.connect(DB)
    c.row_factory = sqlite3.Row
    cur = c.cursor()
    report = {'solos': [], 'site': None, 'new': [], 'keep_group': []}

    def members(iid):
        return [r[0] for r in cur.execute(
            'SELECT member_id FROM image_members WHERE image_id=?', (iid,))]

    for iid in KEEP_GROUP:
        row = cur.execute('SELECT kind,category,era FROM images WHERE id=?', (iid,)).fetchone()
        if not row or row['kind'] != 'group' or members(iid):
            raise SystemExit(f'合照 #{iid} 状态异常，停止以免改掉首页英雄图')
        report['keep_group'].append(iid)

    for iid, mid in SOLOS.items():
        row = cur.execute(
            'SELECT date,kind,category,era,key_order,review FROM images WHERE id=?', (iid,)
        ).fetchone()
        if not row:
            raise SystemExit(f'缺少图片 #{iid}')
        if row['category'] != 'official' or row['era'] != 'e12' or row['date'] != '2026-06-05':
            raise SystemExit(f'#{iid} 不是预期的 2026-06-05 e12 公式图')
        have = members(iid)
        if have and have != [mid]:
            raise SystemExit(f'#{iid} 已挂其他成员 {have}')
        order = append_tokens(row['key_order'], ['member', 'review', 'review_note'])
        report['solos'].append({'id': iid, 'member': mid, 'was': row['kind']})
        if row['kind'] == 'individual' and have == [mid] and row['review'] == 'retagged':
            continue
        cur.execute(
            '''UPDATE images SET kind='individual', review='retagged', review_note=?, key_order=?
               WHERE id=?''',
            (SOLO_NOTE, order, iid))
        cur.execute(
            'INSERT OR IGNORE INTO image_members(image_id, member_id) VALUES(?,?)',
            (iid, mid))

    row = cur.execute(
        'SELECT kind,category,era,date,text,key_order,review,local FROM images WHERE id=4584'
    ).fetchone()
    if not row:
        raise SystemExit('缺少 #4584')
    if members(4584):
        raise SystemExit('#4584 已挂成员，与本任务「不挂成员」冲突')
    if row['local'] != 'img/group-e12-site-20260710.webp' or row['date'] != '2026-07-10':
        raise SystemExit('#4584 不是官网 2026-07-10 这张')
    order = append_tokens(row['key_order'], ['review', 'review_note'])
    report['site'] = {'id': 4584, 'was_kind': row['kind'], 'was_text': row['text']}
    if not (row['kind'] == 'individual' and row['review'] == 'retagged' and row['text'] == SITE_TEXT):
        cur.execute(
            '''UPDATE images SET kind='individual', text=?, review='retagged', review_note=?, key_order=?
               WHERE id=4584''',
            (SITE_TEXT, SITE_NOTE, order))

    text, date, photos = tweet(MIKI)
    if date != '2026-10-26':
        raise SystemExit(f'純嶺みき帖日期不是 2026-10-26 JST: {date}')
    if '純嶺みき' not in text or 'HALLOWEEN' not in text:
        raise SystemExit('帖文与已打开的万圣节个人帖不一致')
    era = era_of(cur, date)
    if era != 'e12':
        raise SystemExit(f'日期 {date} 时期是 {era}')
    post_url = f'https://x.com/iLiFE_official/status/{MIKI}'
    src = cur.execute('SELECT id FROM sources WHERE url=?', (post_url,)).fetchone()
    if not src:
        cur.execute('INSERT INTO sources(url) VALUES(?)', (post_url,))
        sid = cur.lastrowid
    else:
        sid = src[0]
    by_stem = {}
    for p in photos:
        orig = p.get('url') or ''
        stem = os.path.splitext(os.path.basename(orig.split('?')[0]))[0]
        by_stem[stem] = orig
    for local, stem, w, h in NEW:
        if local not in man:
            raise SystemExit(f'{local} 不在 R2 清单')
        orig = by_stem.get(stem)
        if not orig or 'name=orig' not in orig:
            raise SystemExit(f'帖里没有 {stem} 的 orig 图')
        url = orig.replace('name=orig', 'name=large')
        exists = cur.execute('SELECT id,kind,category FROM images WHERE local=?', (local,)).fetchone()
        if exists:
            if exists['kind'] != 'individual' or exists['category'] != 'costume':
                raise SystemExit(f'{local} 已存在但分类不是个人衣装 #{exists["id"]}')
            report['new'].append({'id': exists['id'], 'local': local, 'existed': True})
            continue
        tokens = 'url,orig,date,post,text,category,local,source,kind,member,era,w,h'
        cur.execute(
            '''INSERT INTO images(url,orig,date,post_id,text,category,local,source,kind,era,w,h,key_order)
               VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)''',
            (url, orig, date, sid, text, 'costume', local, 'X @iLiFE_official',
             'individual', era, w, h, tokens))
        iid = cur.lastrowid
        cur.execute('INSERT INTO image_eras(image_id, era_id) VALUES(?,?)', (iid, era))
        cur.execute('INSERT INTO image_members(image_id, member_id) VALUES(?,?)', (iid, 7))
        report['new'].append({'id': iid, 'local': local, 'date': date, 'post': post_url, 'member': 7})

    # 成员卡按图片 id 取最新一张 category=official 的个人图。本任务不得改掉现役九人的卡片。
    expected = {
        '心花りり': 4576, 'あいす': 4580, '福丸うさ': 4577, '若葉のあ': 4581,
        '空詩かれん': 4582, '虹羽みに': 4583, '純嶺みき': 4579, '小熊まむ': 4575,
        '真守みゅう': 4578,
    }
    cards = {}
    for name, want in expected.items():
        row = cur.execute(
            '''SELECT i.id FROM images i
               JOIN image_members im ON im.image_id=i.id
               JOIN members m ON m.id=im.member_id
               WHERE m.name=? AND i.kind='individual' AND i.category='official'
                 AND instr(ifnull(i.source,''),'Wayback')=0
               ORDER BY i.id DESC LIMIT 1''',
            (name,)).fetchone()
        got = row['id'] if row else None
        cards[name] = got
        if got != want:
            raise SystemExit(f'{name} 成员卡会从 #{want} 变成 #{got}')
    report['member_cards'] = cards

    c.commit()
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
