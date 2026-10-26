#!/usr/bin/env python3
"""任务 039：特殊合照 / 特殊个人照。

已在 R2 的新图入库，并把库内已核对过的衣装合照、单人衣装静图标到时期页。
幂等：出处 URL 或 local 已存在则跳过新图；kind 已有则不再改 kind。
"""
import json, os, sqlite3, sys
from datetime import timezone, timedelta
from email.utils import parsedate_to_datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB = os.path.join(ROOT, 'db', 'ilife.sqlite')
CACHE = os.path.join(ROOT, 'db', '.cache_x')
JST = timezone(timedelta(hours=9))
DRY = '--dry' in sys.argv

# 全员衣装合照（画面已核对）。2933 与 2932 同文件，不标。
GROUP_COSTUME = [
    635, 636, 637, 685, 702,
    1341, 1342, 1343, 1344, 1345,
    1893, 1994, 2048, 2130, 2131, 2208, 2215, 2255, 2256,
    2594, 2724, 2806, 2818, 2885, 2932,
    3003, 3056, 3078, 3079, 3173, 3445,
    3747, 3772, 3774, 3859,
]
# 一张舞台感谢合照，与 038 的周年舞台合照同一类。
GROUP_LIVE = [3689]
# 已是 individual + 成员 + 时期，只把 category 从 other 改成 costume。
# 用查询锁定，不手写 id：官方文案含衣装主题，且已经挂上唯一成员。
CAT_SQL = '''
SELECT i.id FROM images i
WHERE i.kind='individual' AND i.category='other' AND i.era IS NOT NULL
  AND (SELECT count(*) FROM image_members m WHERE m.image_id=i.id)=1
  AND (
    i.text LIKE '%ハロウィン%' OR i.text LIKE '%特別衣装%' OR i.text LIKE '%浴衣%'
    OR i.text LIKE '%コスプレ%' OR i.text LIKE '%コス%' OR i.text LIKE '%ウマ娘%'
    OR i.text LIKE '%学園%' OR i.text LIKE '%TAXI%' OR i.text LIKE '%メイド%'
    OR i.text LIKE '%くまらいふ%'
  )
'''
# kind 仍为空、但已经挂了唯一成员的单人衣装静图。
# 排除：早安提及女仆服、FIRST TAKE 企划图、双人「大門兄弟」、夏フェスグッズ贩卖图。
PROMOTE_SKIP = (170, 664, 691, 3695, 3696, 3697)
PROMOTE_SQL = '''
SELECT i.id FROM images i
WHERE i.kind IS NULL AND i.category='other'
  AND (SELECT count(*) FROM image_members m WHERE m.image_id=i.id)=1
  AND i.id NOT IN ({skip})
  AND instr(i.text, '&')=0 AND instr(i.text, '＆')=0 AND instr(i.text, '兄弟')=0
  AND (
    i.text LIKE '%ハロウィン%' OR i.text LIKE '%コスプレ%' OR i.text LIKE '%ウマ娘%'
    OR i.text LIKE '%あいらいふ学園%' OR i.text LIKE '%iLiFE!TAXI%' OR i.text LIKE '%くま%'
  )
'''

# local, status_id, category, member_id or None. 尺寸在文件名对应的 webp 上，入库时写入。
NEW = [
    ('img/group-e12-HVHqN6eboAAHJ6y.webp', '2112727241683849571', 'costume', None, 2048, 1365),
    ('img/group-e12-HVHouunbAAAdeJu.webp', '2112725602902155435', 'costume', None, 2048, 1365),
    ('img/group-e12-HVKC69DbYAE7G6-.webp', '2112895135608717507', 'costume', None, 2048, 1365),
    ('img/group-e12-HU6lDWZbkAAST_1.webp', '2111806811527647317', 'costume', None, 2048, 1365),
    ('img/group-e12-HVZ7YhNbsAA-sjD.webp', '2114012796753268900', 'live', None, 2048, 1365),
    ('img/member-2-HVUTBnfbEAAQW3Q.webp', '2113616527383736516', 'costume', 2, 1365, 2048),
    ('img/member-2-HVUTBnea4AAmxOo.webp', '2113616527383736516', 'costume', 2, 1365, 2048),
    ('img/member-3-HVZBwFTbAAAZrpf.webp', '2113949399353295303', 'costume', 3, 1365, 2048),
    ('img/member-3-HVZBwFObMAAMS--.webp', '2113949399353295303', 'costume', 3, 1365, 2048),
    ('img/member-4-HVeNCNkbcAAfPkb.webp', '2114313630619709879', 'costume', 4, 1365, 2048),
    ('img/member-4-HVeNCNtbYAAZIdC.webp', '2114313630619709879', 'costume', 4, 1365, 2048),
]


def era_of(cur, date):
    row = cur.execute(
        'SELECT id FROM eras WHERE start<=? ORDER BY start DESC LIMIT 1', (date,)
    ).fetchone()
    if not row:
        raise SystemExit(f'没有对应时期: {date}')
    return row[0]


def append_tokens(order, tokens):
    parts = [p for p in (order or '').split(',') if p]
    for t in tokens:
        if t not in parts:
            parts.append(t)
    return ','.join(parts)


def tweet(status_id):
    path = os.path.join(CACHE, status_id + '.json')
    data = json.load(open(path, encoding='utf-8'))
    tw = data['tweet']
    if (tw.get('author') or {}).get('screen_name') != 'iLiFE_official':
        raise SystemExit(f'不是官方帖: {status_id}')
    created = parsedate_to_datetime(tw['created_at']).astimezone(JST)
    photos = (tw.get('media') or {}).get('photos') or []
    return tw['text'], created.date().isoformat(), photos


def main():
    c = sqlite3.connect(DB)
    c.row_factory = sqlite3.Row
    cur = c.cursor()
    report = {'group_costume': [], 'group_live': [], 'cat': [], 'promote': [], 'new': [], 'skip': []}

    def members(iid):
        return [r[0] for r in cur.execute('SELECT member_id FROM image_members WHERE image_id=?', (iid,))]

    def retag_group(ids, category):
        for iid in ids:
            row = cur.execute('SELECT id,date,kind,category,key_order,local FROM images WHERE id=?', (iid,)).fetchone()
            if not row:
                raise SystemExit(f'缺少图片 id={iid}')
            mem = members(iid)
            if mem:
                raise SystemExit(f'id={iid} 已挂成员 {mem}，不能标成团体图')
            era = era_of(cur, row['date'])
            if row['kind'] not in (None, 'group'):
                report['skip'].append(f'{iid} kind={row["kind"]}')
                continue
            # 同一 local 只标 id 较小的一行
            earlier = cur.execute(
                'SELECT id FROM images WHERE local=? AND id<? AND kind IS NOT NULL',
                (row['local'], iid)).fetchone()
            if earlier:
                report['skip'].append(f'{iid} 与 {earlier[0]} 同文件')
                continue
            order = append_tokens(row['key_order'], ['kind', 'era'])
            if 'member' in order.split(','):
                raise SystemExit(f'id={iid} key_order 含 member')
            bucket = 'group_live' if category == 'live' else 'group_costume'
            report[bucket].append({'id': iid, 'era': era, 'category': category, 'local': row['local']})
            if row['kind'] == 'group' and row['category'] == category:
                continue
            if not DRY:
                cur.execute(
                    'UPDATE images SET kind=?, era=?, category=?, key_order=? WHERE id=?',
                    ('group', era, category, order, iid))

    retag_group(GROUP_COSTUME, 'costume')
    retag_group(GROUP_LIVE, 'live')

    cat_ids = [r[0] for r in cur.execute(CAT_SQL)]
    for iid in cat_ids:
        report['cat'].append(iid)
        if not DRY:
            cur.execute("UPDATE images SET category='costume' WHERE id=? AND category='other'", (iid,))

    skip_sql = ','.join('?' * len(PROMOTE_SKIP))
    promote_ids = [r[0] for r in cur.execute(PROMOTE_SQL.format(skip=skip_sql), PROMOTE_SKIP)]
    for iid in promote_ids:
        row = cur.execute('SELECT id,date,key_order,local,review FROM images WHERE id=?', (iid,)).fetchone()
        mem = members(iid)
        if len(mem) != 1:
            raise SystemExit(f'id={iid} 成员数 {mem}')
        era = era_of(cur, row['date'])
        dup = cur.execute(
            '''SELECT id FROM images WHERE local=? AND id<>? AND kind IS NOT NULL''',
            (row['local'], iid)).fetchone()
        if dup:
            report['skip'].append(f'{iid} 与已标注的 {dup[0]} 同文件')
            continue
        order = append_tokens(row['key_order'], ['kind', 'era'])
        report['promote'].append({'id': iid, 'era': era, 'member': mem[0], 'local': row['local']})
        if not DRY:
            cur.execute(
                'UPDATE images SET kind=?, era=?, category=?, key_order=? WHERE id=? AND kind IS NULL',
                ('individual', era, 'costume', order, iid))

    # 时期页会藏起「官方推文文本仅提及该成员」且未经确认的图。
    # 上面这批已经挂了唯一成员，画面是单人衣装，确认后才会出现在时期页。
    note = '任务039：官方文案只点名这一名成员，画面是单人衣装'
    confirm = [r[0] for r in cur.execute(
        """SELECT id FROM images WHERE kind='individual' AND category='costume'
           AND match='官方推文文本仅提及该成员' AND review IS NULL
           AND id IN (
             611,612,616,617,618,619,620,621,625,626,627,628,629,630,631,632,
             692,693,694,695,698,699,700,701,
             1293,1294,1299,1300,1301,1302,1303,1304,1314,1315,1319,1320,
             1324,1325,1326,1327,1329,1330)""" )]
    report['confirm'] = confirm
    for iid in confirm:
        row = cur.execute('SELECT key_order FROM images WHERE id=?', (iid,)).fetchone()
        order = append_tokens(row['key_order'], ['review', 'review_note'])
        if not DRY:
            cur.execute(
                'UPDATE images SET review=?, review_note=?, key_order=? WHERE id=? AND review IS NULL',
                ('confirmed', note, order, iid))

    for local, status_id, category, member, w, h in NEW:
        text, date, photos = tweet(status_id)
        stem = os.path.splitext(os.path.basename(local))[0]
        hit = [p for p in photos if p.get('url') and os.path.splitext(os.path.basename(p['url'].split('?')[0]))[0] in stem]
        if len(hit) != 1:
            raise SystemExit(f'{local} 对不上帖 {status_id} 的图片: {len(hit)}')
        orig = hit[0]['url']
        if 'name=orig' not in orig:
            raise SystemExit(f'orig URL 异常: {orig}')
        url = orig.replace('name=orig', 'name=large')
        post_url = f'https://x.com/iLiFE_official/status/{status_id}'
        era = era_of(cur, date)
        if era != 'e12':
            raise SystemExit(f'{status_id} 日期 {date} 不是 e12')
        exists = cur.execute('SELECT id FROM images WHERE local=?', (local,)).fetchone()
        if exists:
            report['new'].append({'id': exists[0], 'local': local, 'existed': True})
            continue
        src = cur.execute('SELECT id FROM sources WHERE url=?', (post_url,)).fetchone()
        kind = 'individual' if member else 'group'
        tokens = 'url,orig,date,post,text,category,local,source,kind,member,era,w,h' if member else \
                 'url,orig,date,post,text,category,local,source,kind,era,w,h'
        if DRY:
            report['new'].append({'local': local, 'date': date, 'post': post_url, 'kind': kind, 'category': category, 'member': member})
            continue
        if not src:
            cur.execute('INSERT INTO sources(url) VALUES(?)', (post_url,))
            sid = cur.lastrowid
        else:
            sid = src[0]
        cur.execute(
            '''INSERT INTO images(url,orig,date,post_id,text,category,local,source,kind,era,w,h,key_order)
               VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)''',
            (url, orig, date, sid, text, category, local, 'X @iLiFE_official', kind, era, w, h, tokens))
        iid = cur.lastrowid
        cur.execute('INSERT INTO image_eras(image_id, era_id) VALUES(?,?)', (iid, era))
        if member:
            cur.execute('INSERT INTO image_members(image_id, member_id) VALUES(?,?)', (iid, member))
        report['new'].append({'id': iid, 'local': local, 'date': date, 'post': post_url, 'kind': kind, 'category': category, 'member': member, 'source_id': sid})

    if DRY:
        c.rollback()
    else:
        c.commit()
    print(json.dumps(report, ensure_ascii=False, indent=1))
    print('dry' if DRY else 'applied',
          'group', len(report['group_costume']) + len(report['group_live']),
          'cat', len(report['cat']), 'promote', len(report['promote']), 'new', len(report['new']))


if __name__ == '__main__':
    main()
