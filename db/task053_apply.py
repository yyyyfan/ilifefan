#!/usr/bin/env python3
"""任务 053：近期公演事实 + 已上传 R2 的官方图入库。

图片只在 db/r2_manifest.json 里已经有对应键时写入，避免公开地址指向不存在的对象。
公演标题、时间、备注、新场次不依赖图片，每次运行都会写成下面的定稿（幂等）。
出处帖的 JSON 缓存在 db/.cache_x/<id>.json（不入库）。没有缓存时跳过对应图片。
"""
import json
import os
import sqlite3

D = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(D)
DB = os.path.join(D, 'ilife.sqlite')
MAN = os.path.join(D, 'r2_manifest.json')
CACHE = os.path.join(D, '.cache_x')
PLAN = os.path.join(CACHE, 'upload053.json')

# final filename -> classification
# lives: 要挂上的公演；cover: 设为这些公演的封面
CLS = {
    # 万圣节单人衣装（文案只点一名成员，画面是单人）
    'member-5-HVoyc_Ja0AAmDZr.webp': dict(date='2026-10-27', cat='costume', kind='individual', member=5, era='e12'),
    'member-5-HVoyc9xbEAAE68b.webp': dict(date='2026-10-27', cat='costume', kind='individual', member=5, era='e12'),
    'member-8-HVuAU1obwAA-dTz.webp': dict(date='2026-10-28', cat='costume', kind='individual', member=8, era='e12'),
    'member-8-HVuAU11aAAA2rFC.webp': dict(date='2026-10-28', cat='costume', kind='individual', member=8, era='e12'),
    'member-6-HVy8iFtacAAtnC2.webp': dict(date='2026-10-29', cat='costume', kind='individual', member=6, era='e12'),
    'member-6-HVy8iFcbMAAmkKA.webp': dict(date='2026-10-29', cat='costume', kind='individual', member=6, era='e12'),
    'member-9-HV3DwQxaoAAd4jQ.webp': dict(date='2026-10-30', cat='costume', kind='individual', member=9, era='e12'),
    'member-9-HV3DwQia4AEbpp-.webp': dict(date='2026-10-30', cat='costume', kind='individual', member=9, era='e12'),
    'member-1-HV39CBTbwAEL1kp.webp': dict(date='2026-10-30', cat='costume', kind='individual', member=1, era='e12'),
    'member-1-HV39CBVagAABAZk.webp': dict(date='2026-10-30', cat='costume', kind='individual', member=1, era='e12'),
    # 全员衣装静图
    'group-e12-HVo46xaaAAAWtgQ.webp': dict(date='2026-10-27', cat='costume', kind='group', era='e12', lives=[23]),
    'group-e12-HVuF5mUa8AE7aAy.webp': dict(date='2026-10-28', cat='costume', kind='group', era='e12', lives=[24]),
    'group-e12-HVj5_RNboAAWpF7.webp': dict(date='2026-10-26', cat='costume', kind='group', era='e12'),
    'group-e12-HV4xj_9bkAApTfC.webp': dict(date='2026-10-31', cat='costume', kind='group', era='e12'),
    # 舞台 / 主办方演后感谢
    'live-23-HVo46xxbsAAJHJM.webp': dict(date='2026-10-27', cat='live', kind='group', era='e12', lives=[23]),
    'live-23-HVor1P9aoAAfOTh.webp': dict(date='2026-10-27', cat='live', kind='group', era='e12', lives=[23], cover=[23]),
    'live-24-HVuF5mWa0AA_0gZ.webp': dict(date='2026-10-28', cat='live', kind='group', era='e12', lives=[24]),
    'live-24-HVt2GDRbYAA5-Y-.webp': dict(date='2026-10-28', cat='live', kind='group', era='e12', lives=[24], cover=[24]),
    # 札幌时间表与出演者发表
    'live-856-HVoRGPuaAAAUhl3.webp': dict(date='2026-11-16', cat='official', lives=[856], cover=[856]),
    'live-856-HVIrkHYagAEzTDx.webp': dict(date='2026-10-21', cat='official', lives=[856]),
    # YANFES 丰洲
    'live-872-HVPLxcNaMAEaWns.webp': dict(date='2026-11-18', cat='official', lives=[872], cover=[872]),
    # 巡演物贩菜单（不挂到尚无封面的场次，避免变成卡片图）
    'official-HVdlI2Na8AAaqq6.webp': dict(date='2026-10-25', cat='official'),
    # 衣装日程初版与订正版
    'official-HVi1lIFbEAA9qLM.webp': dict(date='2026-10-26', cat='official', lives=[23, 24, 852, 853]),
    'official-HVjwAoQaEAA9St2.webp': dict(date='2026-10-26', cat='official', lives=[23, 24, 852, 853]),
    # IDOL HALLOWEEN 时间表 / 抽选 / 地图
    'live-852-HVjyA4waMAEzciW.webp': dict(date='2026-10-31', cat='official', lives=[852]),
    'live-853-HVjyA4ybUAA8y0M.webp': dict(date='2026-11-01', cat='official', lives=[853]),
    'live-852-HVjyA4wbQAAveFN.webp': dict(date='2026-10-26', cat='official', lives=[852, 853]),
    'live-852-HVjyA4zaYAAGx23.webp': dict(date='2026-10-26', cat='official', lives=[852, 853]),
    'live-853-HV3nYi4aQAA40iU.webp': dict(date='2026-10-30', cat='official', lives=[853]),
    'live-867-HV3onxNbMAA30Cv.webp': dict(date='2026-10-30', cat='official', lives=[852, 853, 867, 868]),
    # 工作人员特典会时间表与物贩
    'live-852-HVyY5gLbIAALGGd.webp': dict(date='2026-10-31', cat='official', lives=[852]),
    'live-853-HVyY5gIawAAToL5.webp': dict(date='2026-11-01', cat='official', lives=[853]),
    'live-852-HVt1nLybQAEwxQS.webp': dict(date='2026-10-28', cat='official', lives=[852, 853]),
    # 特典会ブース变更（DAY1 图没有 iLiFE!，只入库不挂场）
    'official-HVyr8dDboAANxYh.webp': dict(date='2026-10-29', cat='official'),
    'live-852-HVyr8dCbcAArpKn.webp': dict(date='2026-10-31', cat='official', lives=[852]),
    'live-853-HVyr8ctbQAADiaf.webp': dict(date='2026-11-01', cat='official', lives=[853]),
}

HANDLE = {
    'iLiFE_official': 'https://x.com/iLiFE_official/status/{}',
    'HEROINES_FES': 'https://x.com/HEROINES_FES/status/{}',
    'iLiFE_STAFF': 'https://x.com/iLiFE_STAFF/status/{}',
    'heroines_idol': 'https://x.com/heroines_idol/status/{}',
}

NOTE_23 = (
    'あいす于 10/27、10/28 两场只休息特典会，公告未写退出演出。'
    '当天拍摄的ランチェキ约 17:00 限量销售。'
    'https://x.com/iLiFE_official/status/2114726742619459683 '
    '订正后衣装日程：10/27 为新作バニー衣装。'
    'https://x.com/iLiFE_official/status/2114703934472556591 '
    '（初版 https://x.com/iLiFE_official/status/2114639685347930522 曾把 11/1 写成バニー第二回，已订正）。'
    '主办方演后感谢（画面标 HEROINES HALLOWEEN DAY1、iLiFE!、バニー）：'
    'https://x.com/HEROINES_FES/status/2115051197094834265 '
    '同帖另一张是ガガピエロ，未收。'
)

NOTE_24 = (
    'あいす于 10/27、10/28 两场只休息特典会，公告未写退出演出。'
    '当天拍摄的ランチェキ约 17:00 限量销售。'
    'https://x.com/iLiFE_official/status/2114726742619459683 '
    '订正后衣装日程：10/28 为 2025 年トランプ衣装。'
    'https://x.com/iLiFE_official/status/2114703934472556591 '
    '主办方演后感谢（画面标 HEROINES HALLOWEEN DAY2、iLiFE!、トランプ）：'
    'https://x.com/HEROINES_FES/status/2115414315402752442'
)

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
    '售票页 https://t-dv.com/IHJ2026 有一处仍写开场开演调整中；第三方补充里的 00:00 不采用。'
    '补充核验会场：https://www.eventernote.com/events/491702 ；https://www.livefans.jp/events/2014021'
)

NOTE_853 = (
    '官方时间表 DAY3（11/1）OPEN 10:00 / START 11:00，会场埼玉スタジアム2002 野外特設会場。'
    'iLiFE! 在 PUMPKIN STAGE 19:20–19:55。'
    'https://x.com/iLiFE_official/status/2114706138067542338 '
    '订正后 11/1 衣装为 iLiVE! 着用の海賊衣装（初版曾写成バニー第二回）。'
    'https://x.com/iLiFE_official/status/2114703934472556591 '
    'しなこ特别合作：时间表上しなこ为 PUMPKIN STAGE 13:35–13:55，'
    '官方图写「13:35〜のしなこちゃんのステージ」与 iLiFE! 合作，不另建场次。'
    'https://x.com/iLiFE_official/status/2116101817176367411 '
    '工作人员：11/1 前特典会 17:10–18:10（16:40 整列），物贩约 14:00–17:30。'
    'https://x.com/iLiFE_STAFF/status/2115413983310356649 '
    '特典会时间表 https://x.com/iLiFE_STAFF/status/2115734045342707806 。'
    '10/29 ブース变更、时间不变：https://x.com/heroines_idol/status/2115760570104209779 '
    '变更图左侧标 27〜30，iLiFE! 时间仍是 17:10–18:10。'
    'CD 预约者抽选会：https://x.com/iLiFE_official/status/2116103182489399418 。'
    '第三方补充里的开场开演 00:00 不采用。'
    '补充核验会场：https://www.eventernote.com/events/491703'
)

NOTE_856 = (
    '官方时间表：iLiVE! TOUR SAPPORO，2026-11-16，Zepp Sapporo，OPEN 13:00 / START 14:00。'
    '图上 iLiFE! 为 19:10、特典会终演后；物贩 13:30–16:00（预定）。'
    '终演后特典会参加券日后由 @iLiFE_STAFF 告知。'
    'https://x.com/iLiFE_official/status/2115021795971432782 '
    '售票页 https://t-dv.com/ilive-261116 （https://ticketdive.com/event/ilive-261116）'
    '同样写开场 13:00、开演 14:00、会场 Zepp Sapporo，出演名单含 iLiFE!。'
    '10/21 有北海道出演者发表配信告知：https://x.com/iLiFE_official/status/2112799086168649943 '
    '（YouTube https://youtube.com/live/gpl0ovZ9cp8 ，是直播告知，不是歌曲影像）。'
    '早前出演募集页曾写开场开演未定：https://ilife-heroines.com/topics/detail/index/2006 '
    '以及 https://x.com/iLiFE_official/status/2097657082120171649'
)

NOTE_867 = (
    'メジャー1stシングル『アイドルライフメガパック』（2027-01-11 月・祝 発売、Sony Music Labels）の発売記念リリースイベント。'
    '内容：ミニライブ＋特典会＋特典抽選会（ミニライブ観覧はフリー）。'
    '本场为线上活动：オンラインサイン会＋ビンゴ大会（リミスタ）。'
    '2026-10-30 官方图确认 11/14（土）在リミスタ举行：为预约商品的人签名（非现场所以代签），'
    '并有宾果大会（每回 300 人）。该图没有开始时刻。'
    'https://x.com/iLiFE_official/status/2116103182489399418'
)

NOTE_868 = (
    'メジャー1stシングル『アイドルライフメガパック』（2027-01-11 月・祝 発売、Sony Music Labels）の発売記念リリースイベント。'
    '内容：ミニライブ＋特典会＋特典抽選会（ミニライブ観覧はフリー）。'
    '会場：アリオ札幌 1F えんとつ広場（北海道）。'
    '2026-10-30 官方图写 11/17（火）14:00〜，开演记 14:00。'
    'https://x.com/iLiFE_official/status/2116103182489399418'
)

NOTE_872 = (
    '官方告知出演 YANFES2026。'
    'https://x.com/iLiFE_official/status/2113256707573088402 '
    '售票页 https://t-dv.com/YANFES-261118 （https://ticketdive.com/event/YANFES-261118）'
    '写 2026-11-18、豊洲PIT、开场 10:30、开演 11:00，出演名单含 iLiFE!。'
    '告知图同样是 @豊洲PIT。'
    '同一天另有「YANFES 2026 -裏-」在 duo MUSIC EXCHANGE'
    '（https://t-dv.com/YANFES_ura-261118），出演名单没有 iLiFE!，不建场。'
    '主办方双会场告知：https://x.com/heroines_idol/status/2113256751164522638 。'
    '推文中的 FC 先行写到 10/25 23:59；打开丰洲售票页时官方先行为 2026-10-27 22:00 至 2026-11-04 23:59。'
)


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
    if meta.get('member'):
        parts.append('member')
    if meta.get('era'):
        parts.append('era')
    parts.extend(['w', 'h'])
    return ','.join(parts)


def apply_lives(cur):
    sid_856 = source_id(cur, 'https://x.com/iLiFE_official/status/2115021795971432782')
    cur.execute(
        '''UPDATE lives SET title=?, open_time=?, start_time=?, note=?, source_id=? WHERE id=856''',
        ('iLiVE! TOUR SAPPORO', '13:00', '14:00', NOTE_856, sid_856))
    cur.execute('UPDATE lives SET note=? WHERE id=23', (NOTE_23,))
    cur.execute('UPDATE lives SET note=? WHERE id=24', (NOTE_24,))
    cur.execute(
        'UPDATE lives SET open_time=?, start_time=?, note=? WHERE id=852',
        ('10:00', '11:00', NOTE_852))
    cur.execute(
        'UPDATE lives SET open_time=?, start_time=?, note=? WHERE id=853',
        ('10:00', '11:00', NOTE_853))
    cur.execute('UPDATE lives SET note=? WHERE id=867', (NOTE_867,))
    cur.execute('UPDATE lives SET start_time=?, note=? WHERE id=868', ('14:00', NOTE_868))

    sid_872 = source_id(cur, 'https://x.com/iLiFE_official/status/2113256707573088402')
    row = cur.execute('SELECT id FROM lives WHERE date=? AND venue_id=?', ('2026-11-18', 9)).fetchone()
    if row:
        lid = row[0]
        cur.execute(
            '''UPDATE lives SET title=?, type=?, open_time=?, start_time=?, note=?, source_id=?, is_headliner=0
               WHERE id=?''',
            ('YANFES 2026', 'フェス', '10:30', '11:00', NOTE_872, sid_872, lid))
    else:
        cur.execute(
            '''INSERT INTO lives(id,date,title,venue_id,type,open_time,start_time,note,setlist,is_headliner,source_id,cover_image_id)
               VALUES(872,'2026-11-18','YANFES 2026',9,'フェス','10:30','11:00',?,NULL,0,?,NULL)''',
            (NOTE_872, sid_872))
        lid = 872
    return lid


def apply_images(cur, man):
    if not os.path.exists(PLAN):
        print('没有 upload053.json，跳过图片')
        return 0
    plan = json.load(open(PLAN, encoding='utf-8'))
    by_final = {p['final']: p for p in plan}
    added = 0
    skipped = []
    for final, meta in CLS.items():
        key = 'img/' + final
        if key not in man:
            skipped.append(key)
            continue
        item = by_final.get(final)
        if not item:
            raise SystemExit(f'清单有键但计划没有 {final}')
        cache = json.load(open(os.path.join(CACHE, item['post'] + '.json'), encoding='utf-8'))
        tw = cache['tweet']
        author = (tw.get('author') or {}).get('screen_name')
        if author not in HANDLE:
            raise SystemExit(f'未知作者 {author} {item["post"]}')
        post_url = HANDLE[author].format(item['post'])
        sid = source_id(cur, post_url)
        orig = item['url']
        if 'name=orig' not in orig and 'amplify_video_thumb' not in orig:
            raise SystemExit(f'orig URL 异常 {orig}')
        url = orig.replace('name=orig', 'name=large') if 'name=orig' in orig else orig
        local = key
        exists = cur.execute('SELECT id FROM images WHERE local=?', (local,)).fetchone()
        if exists:
            iid = exists[0]
        else:
            order = key_order(meta)
            cur.execute(
                '''INSERT INTO images(url,orig,date,post_id,text,category,local,source,kind,era,w,h,key_order)
                   VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)''',
                (url, orig, meta['date'], sid, tw.get('text'), meta['cat'], local,
                 f'X @{author}', meta.get('kind'), meta.get('era'), item['w'], item['h'], order))
            iid = cur.lastrowid
            added += 1
        era = cur.execute(
            'SELECT id FROM eras WHERE start<=? ORDER BY start DESC LIMIT 1', (meta['date'],)
        ).fetchone()[0]
        cur.execute('INSERT OR IGNORE INTO image_eras(image_id, era_id) VALUES(?,?)', (iid, era))
        if meta.get('member'):
            cur.execute('INSERT OR IGNORE INTO image_members(image_id, member_id) VALUES(?,?)',
                        (iid, meta['member']))
        for n, lid in enumerate(meta.get('lives') or []):
            mx = cur.execute('SELECT COALESCE(MAX(ord),-1) FROM image_lives WHERE live_id=?', (lid,)).fetchone()[0]
            cur.execute('INSERT OR IGNORE INTO image_lives(live_id, image_id, ord) VALUES(?,?,?)',
                        (lid, iid, mx + 1))
        for lid in meta.get('cover') or []:
            cur.execute('UPDATE lives SET cover_image_id=? WHERE id=?', (iid, lid))
    print(f'新图片 {added} 张；清单里还没有、因此没入库 {len(skipped)} 张')
    for k in skipped:
        print('  未上传', k)
    return added


def main():
    man = json.load(open(MAN, encoding='utf-8')) if os.path.exists(MAN) else {}
    c = sqlite3.connect(DB)
    c.execute('PRAGMA foreign_keys=ON')
    cur = c.cursor()
    lid = apply_lives(cur)
    print('YANFES live id', lid)
    apply_images(cur, man)
    c.commit()
    print('已提交')


if __name__ == '__main__':
    main()
