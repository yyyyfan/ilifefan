#!/usr/bin/env python3
"""任务 054：2026-10-31 至 2026-11-02（JST）的公演事实、官方 MV，以及已上传 R2 的官方图。

公演歌单、备注和歌曲 MV 不依赖图片，每次运行都写成下面的定稿（幂等）。
图片只在 db/r2_manifest.json 里已经有对应键时写入，避免公开地址指向不存在的对象。
分类与原文在 db/task054_plan.json。
"""
import json
import os
import sqlite3

D = os.path.dirname(os.path.abspath(__file__))
DB = os.path.join(D, 'ilife.sqlite')
MAN = os.path.join(D, 'r2_manifest.json')
PLAN = os.path.join(D, 'task054_plan.json')

HANDLE = {
    'iLiFE_official': 'https://x.com/iLiFE_official/status/{}',
    'iLiFE_STAFF': 'https://x.com/iLiFE_STAFF/status/{}',
    'IDOLHJ_official': 'https://x.com/IDOLHJ_official/status/{}',
}

NOTE_852 = (
    '官方时间表 DAY2（10/31）OPEN 10:00 / START 11:00，会场埼玉スタジアム2002 野外特設会場。'
    'iLiFE! 在 PUMPKIN STAGE 19:35–20:10。'
    'https://x.com/iLiFE_official/status/2114706138067542338 '
    '订正后衣装为新作キョンシー。'
    'https://x.com/iLiFE_official/status/2114703934472556591 '
    '（初版 https://x.com/iLiFE_official/status/2114639685347930522 曾把 11/1 写成バニー第二回）。'
    '工作人员：两日出演日物贩约 14:00–17:30；10/31 前特典会 17:00–18:00（16:30 整列）。'
    'https://x.com/iLiFE_STAFF/status/2115413983310356649 '
    '特典会时间表 https://x.com/iLiFE_STAFF/status/2115734045342707806 。'
    '10/29 主办方公告特典会ブース变更、实施时间不变：'
    'https://x.com/heroines_idol/status/2115760570104209779 '
    '变更图将左侧区域标为 27〜30，iLiFE! 时间仍是 17:00–18:00。'
    'CD 预约者抽选会：https://x.com/iLiFE_official/status/2116103182489399418 。'
    '11/1 工作人员写抽选会在入场门内左侧 HEROINES 抽选帐篷旁，当日继续：'
    'https://x.com/iLiFE_STAFF/status/2116718380137021901 。'
    '售票页 https://t-dv.com/IHJ2026 有一处仍写开场开演调整中；第三方补充里的 00:00 不采用。'
    '补充核验会场：https://www.eventernote.com/events/491702 ；https://www.livefans.jp/events/2014021 '
    '10/31 演后官方感谢（キョンシー九人台阶合影、舞台背影、会场远景）：'
    'https://x.com/iLiFE_official/status/2116528186276372746 。'
    '工作人员歌单：https://x.com/iLiFE_STAFF/status/2116530730633515138 '
    '（i REVOLUTION 标撮影可）。'
    '主办方 DAY2 感谢图是 PUMPKIN STAGE 三个团体拼贴，另一张是 VAMPIRE STAGE，未收。'
)

NOTE_853 = (
    '官方时间表 DAY3（11/1）OPEN 10:00 / START 11:00，会场埼玉スタジアム2002 野外特設会場。'
    'iLiFE! 在 PUMPKIN STAGE 19:20–19:55。'
    'https://x.com/iLiFE_official/status/2114706138067542338 '
    '订正后 11/1 夜场衣装为 iLiVE! 着用の海賊衣装（初版曾写成バニー第二回）。'
    'https://x.com/iLiFE_official/status/2114703934472556591 '
    'しなこ特别合作：时间表上しなこ为 PUMPKIN STAGE 13:35–13:55，'
    '官方图写「13:35〜のしなこちゃんのステージ」与 iLiFE! 合作，不另建场次。'
    'https://x.com/iLiFE_official/status/2116101817176367411 '
    '合作感谢合影是兔耳衣装，与夜场海盗衣装不同：'
    'https://x.com/iLiFE_official/status/2116833162743689697 。'
    '工作人员：11/1 前特典会 17:10–18:10（16:40 整列），物贩约 14:00–17:30。'
    'https://x.com/iLiFE_STAFF/status/2115413983310356649 '
    '特典会时间表 https://x.com/iLiFE_STAFF/status/2115734045342707806 。'
    '10/29 ブース变更、时间不变：https://x.com/heroines_idol/status/2115760570104209779 '
    '变更图左侧标 27〜30，iLiFE! 时间仍是 17:10–18:10。'
    'CD 预约者抽选会：https://x.com/iLiFE_official/status/2116103182489399418 。'
    '抽选会在入场门内左侧 HEROINES 抽选帐篷旁，11/1 继续：'
    'https://x.com/iLiFE_STAFF/status/2116718380137021901 。'
    '第三方补充里的开场开演 00:00 不采用。'
    '补充核验会场：https://www.eventernote.com/events/491703 '
    '11/1 演后官方感谢（海盗九人合影、舞台焰火、会场远景）：'
    'https://x.com/iLiFE_official/status/2116889696349602273 。'
    '主办方 PUMPKIN STAGE DAY3 拍照区九人：'
    'https://x.com/IDOLHJ_official/status/2116870593605968037 。'
    '主办方白天合作会场远景：https://x.com/IDOLHJ_official/status/2116801059310178480 。'
    '工作人员歌单：https://x.com/iLiFE_STAFF/status/2116907365933170757 。'
    '开演前工作人员写撮影可能曲为第 2 首：'
    'https://x.com/iLiFE_STAFF/status/2116825798355419628 '
    '（歌单不计 SE 时第 2 首为 #ラブコード，标撮影可）。'
)

SETLIST_852 = (
    'SE\n'
    '会いにKiTE!\n'
    'サイクロンライフ！\n'
    'きゃわぽっぴんどぅー\n'
    'sweet timer\n'
    'アイドルライフブースターパック\n'
    'i REVOLUTION 📸🉑\n'
    'ガンバッテンダー\n'
    'アイドルライフメガパック\n'
    'メッセージ'
)

SETLIST_853 = (
    'SE\n'
    '初恋リバイバル\n'
    '#ラブコード 📸🉑\n'
    'BRAVE GROOVE\n'
    'アイドルライフエクストラパック\n'
    'LOML\n'
    'サイクロンライフ！\n'
    'i REVOLUTION\n'
    'LiMiT STRiKER!\n'
    'アイドルライフメガパック'
)

NOTE_SONG = (
    '楽曲提供：Fear, and Loathing in Las Vegas。配信限定シングル（发行日维持 2026-08-26）。'
    'YouTube 官方 MV 于 2026-10-31 公开：https://www.youtube.com/watch?v=-IOtOZJutdk 。'
    '公开帖写当日 18:30 プレミア公开，并写这首歌曾在 Kアリーナお披露目：'
    'https://x.com/iLiFE_official/status/2116379742752620866 。'
    '此前备注里的「2026-08-26 MV公开」改为这次的上传日；'
    '2026-08-26 仍留在发行日，不作为 YouTube MV 的公开日。'
)

CITE = [
    'https://x.com/iLiFE_official/status/2116528186276372746',
    'https://x.com/iLiFE_STAFF/status/2116530730633515138',
    'https://x.com/iLiFE_STAFF/status/2116718380137021901',
    'https://x.com/iLiFE_official/status/2116889696349602273',
    'https://x.com/iLiFE_official/status/2116833162743689697',
    'https://x.com/IDOLHJ_official/status/2116870593605968037',
    'https://x.com/IDOLHJ_official/status/2116801059310178480',
    'https://x.com/iLiFE_STAFF/status/2116907365933170757',
    'https://x.com/iLiFE_STAFF/status/2116825798355419628',
    'https://www.youtube.com/watch?v=-IOtOZJutdk',
    'https://x.com/iLiFE_official/status/2116379742752620866',
    'https://x.com/iLiFE_official/status/2116455610179047864',
    'https://x.com/iLiFE_official/status/2116493946528596203',
]


def source_id(cur, url):
    row = cur.execute('SELECT id FROM sources WHERE url=?', (url,)).fetchone()
    if row:
        return row[0]
    cur.execute('INSERT INTO sources(url) VALUES(?)', (url,))
    return cur.lastrowid


def key_order(meta):
    parts = ['url', 'orig', 'date', 'post', 'text', 'category', 'local', 'source']
    if meta.get('kind'):
        parts.append('kind')
    if meta.get('era'):
        parts.append('era')
    parts.extend(['w', 'h'])
    return ','.join(parts)


def apply_lives(cur):
    for url in CITE:
        source_id(cur, url)
    cur.execute('UPDATE lives SET note=?, setlist=? WHERE id=852', (NOTE_852, SETLIST_852))
    cur.execute('UPDATE lives SET note=?, setlist=? WHERE id=853', (NOTE_853, SETLIST_853))
    n852 = cur.execute('SELECT setlist FROM lives WHERE id=852').fetchone()[0]
    n853 = cur.execute('SELECT setlist FROM lives WHERE id=853').fetchone()[0]
    if n852 != SETLIST_852 or n853 != SETLIST_853:
        raise SystemExit('歌单没有写成定稿')


def apply_song(cur):
    sid = source_id(cur, 'https://www.youtube.com/watch?v=-IOtOZJutdk')
    cur.execute(
        'UPDATE songs SET mv_date=?, note=? WHERE id=44',
        ('2026-10-31', NOTE_SONG))
    row = cur.execute(
        'SELECT id FROM song_videos WHERE song_id=44 AND video_id=?',
        ('-IOtOZJutdk',)).fetchone()
    if not row:
        cur.execute(
            '''INSERT INTO song_videos(song_id,video_id,kind,title,date,thumb,ord,official,channel)
               VALUES(44,?,'MV',?,?,?,0,1,NULL)''',
            ('-IOtOZJutdk',
             '【MV】i REVOLUTION / iLiFE!【Fear, and Loathing in Las Vegas collaboration】',
             '2026-10-31',
             'https://i.ytimg.com/vi/-IOtOZJutdk/maxresdefault.jpg'))
    else:
        cur.execute(
            '''UPDATE song_videos SET kind='MV', title=?, date=?, thumb=?, official=1, channel=NULL
               WHERE id=?''',
            ('【MV】i REVOLUTION / iLiFE!【Fear, and Loathing in Las Vegas collaboration】',
             '2026-10-31',
             'https://i.ytimg.com/vi/-IOtOZJutdk/maxresdefault.jpg',
             row[0]))
    # sid is recorded so the YouTube URL exists in sources; songs.source_id stays Wikipedia
    return sid


def apply_images(cur, man):
    plan = json.load(open(PLAN, encoding='utf-8'))
    added = 0
    skipped = []
    for meta in plan['images']:
        key = 'img/' + meta['file']
        if key not in man:
            skipped.append(key)
            continue
        author = meta['author']
        if author not in HANDLE:
            raise SystemExit(f'未知作者 {author}')
        post_url = HANDLE[author].format(meta['post'])
        sid = source_id(cur, post_url)
        orig = meta['orig']
        if 'name=orig' not in orig:
            raise SystemExit(f'orig URL 异常 {orig}')
        url = orig.replace('name=orig', 'name=large')
        exists = cur.execute('SELECT id FROM images WHERE local=?', (key,)).fetchone()
        if exists:
            iid = exists[0]
        else:
            cur.execute(
                '''INSERT INTO images(url,orig,date,post_id,text,category,local,source,kind,era,w,h,key_order)
                   VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)''',
                (url, orig, meta['date'], sid, meta['text'], meta['cat'], key,
                 f'X @{author}', meta.get('kind'), meta.get('era'), meta['w'], meta['h'],
                 key_order(meta)))
            iid = cur.lastrowid
            added += 1
        era = cur.execute(
            'SELECT id FROM eras WHERE start<=? ORDER BY start DESC LIMIT 1', (meta['date'],)
        ).fetchone()[0]
        if meta.get('era') and meta['era'] != era:
            raise SystemExit(f'{key} 指定时期 {meta["era"]} 与日期 {meta["date"]} 的 {era} 不符')
        cur.execute('INSERT OR IGNORE INTO image_eras(image_id, era_id) VALUES(?,?)', (iid, era))
        for lid in meta.get('lives') or []:
            mx = cur.execute('SELECT COALESCE(MAX(ord),-1) FROM image_lives WHERE live_id=?', (lid,)).fetchone()[0]
            cur.execute(
                'INSERT OR IGNORE INTO image_lives(live_id, image_id, ord) VALUES(?,?,?)',
                (lid, iid, mx + 1))
        for lid in meta.get('cover') or []:
            cur.execute('UPDATE lives SET cover_image_id=? WHERE id=?', (iid, lid))
        if meta.get('song'):
            mx = cur.execute(
                'SELECT COALESCE(MAX(ord),-1) FROM song_images WHERE song_id=?',
                (meta['song'],)).fetchone()[0]
            cur.execute(
                'INSERT OR IGNORE INTO song_images(song_id, image_id, ord) VALUES(?,?,?)',
                (meta['song'], iid, mx + 1))
    print(f'新图片 {added} 张；清单里还没有、因此没入库 {len(skipped)} 张')
    for k in skipped:
        print('  未上传', k)
    return added


def main():
    man = json.load(open(MAN, encoding='utf-8')) if os.path.exists(MAN) else {}
    c = sqlite3.connect(DB)
    c.execute('PRAGMA foreign_keys=ON')
    cur = c.cursor()
    apply_lives(cur)
    apply_song(cur)
    apply_images(cur, man)
    c.commit()
    print('已提交')


if __name__ == '__main__':
    main()
