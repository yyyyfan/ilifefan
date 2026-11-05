#!/usr/bin/env python3
"""任务 055：2026-11-02 至 2026-11-05（JST）的公演备注、CD 封面设计，以及已记入清单的官方图。

公演备注和歌曲备注不依赖图片，每次运行都写成下面的定稿（幂等）。
图片只在 db/r2_manifest.json 里已经有对应键时写入。
不改 854 的开场开演，不改第 42 首的封面和 mv_date。
"""
import os
import sqlite3

D = os.path.dirname(os.path.abspath(__file__))
DB = os.path.join(D, 'ilife.sqlite')
MAN = os.path.join(D, 'r2_manifest.json')

HANDLE = {
    'iLiFE_official': 'https://x.com/iLiFE_official/status/{}',
    'iLiFE_STAFF': 'https://x.com/iLiFE_STAFF/status/{}',
    'falilv': 'https://x.com/falilv/status/{}',
}

NOTE_854 = (
    '补充核验：Special 2MAN LIVE 「VegaLiFE!」（https://www.eventernote.com/events/496580） '
    '開場 18:30 開演 19:30 終演 22:00；iLiFE! × Fear, and Loathing in Las Vegas '
    'Special 2MAN LIVE 「VegaLiFE!」（https://www.livefans.jp/events/2013201） 2026/11/05 (木)。'
    '丰洲PIT日程页确认出演 Fear, and Loathing in Las Vegas / iLiFE!，'
    '标题 Special 2MAN LIVE「VegaLiFE!」，开场 18:30、开演 19:30，'
    '一般票 ￥5000（税込、入场另付饮料）：'
    'https://toyosu.pia-pit.jp/schedule/202610/8919.html 。'
    '合作方官网 2026-10-14 公告同一日期、会场与开场开演：'
    'https://lasvegas-jp.com/topics/9299 。'
    '工作人员 11/2：先行物贩 16:30–18:10（会场前商品区，按整列顺序，可能限购）；'
    '本场只做前特典会，没有终演后特典会。受付/呼出 14:30，特典会 15:00–16:00（预定）。'
    '参加需要另购特典会参加券（FC 限定，且要持有公演票）：'
    'https://t-dv.com/pJ22P2JPQICNbkFc0Z1S ，申请截止 11/3 23:59。'
    'https://x.com/iLiFE_STAFF/status/2117225219186475391 。'
    '这张参加券的页面把开场/开演写成 14:30，页内说明它是特典会整理券，'
    '受付开始约 14:30，特典会 15:00–16:00，15:40 停止受付。'
    '14:30 不写入本场开场开演。公演开场仍是 18:30，开演仍是 19:30。'
    '合作方 @falilv 同日写先行物贩 16:30–18:10，另有 OPEN 中物贩 18:30–19:30'
    '（入场者、场内动线）：'
    'https://x.com/falilv/status/2117225220394348757 。'
    '合作 T 恤与会场商品一览已收，不替换既有告知封面。'
)

NOTE_42 = (
    '作詞・作曲・編曲：Medansy（TRIFRONTIER）。'
    '4th配信アルバム『アイドルライフメガパック』表題曲（2026-08-26 配信）。2026-08-16 MV公開。'
    'メジャー1stシングルとして 2027-01-11（月・祝）に Sony Music Labels から CD 発売'
    '（3 形態・全 3 曲収録：アイドルライフメガパック / LiMiT STRiKER! / きゃわぽっぴんどぅー）：'
    '初回生産限定盤（CD+Blu-ray）SRCL-13950〜13951 2,500 円、'
    'メンバー盤 全 9 種 SRCL-13952〜13960 各 1,500 円（各盤にメンバーセレクト曲 1 首）、'
    '通常盤 SRCL-13961 1,500 円。'
    '2026-11-05 官方公开了两张 CD 封面设计：九人合影与九人分格。'
    'https://x.com/iLiFE_official/status/2118282312316240064 '
    '正文标语为「好き超えてちゅき♡」。'
    '帖文没有写明哪一张对应初回生产限定盘、通常盘或成员盘，成员盘也没有拆成 9 个单独文件。'
    '歌曲封面仍用配信 jacket。'
)

CITE = [
    'https://toyosu.pia-pit.jp/schedule/202610/8919.html',
    'https://lasvegas-jp.com/topics/9299',
    'https://t-dv.com/pJ22P2JPQICNbkFc0Z1S',
    'https://x.com/iLiFE_STAFF/status/2117225219186475391',
    'https://x.com/falilv/status/2117225220394348757',
    'https://x.com/iLiFE_official/status/2118282312316240064',
    'https://x.com/iLiFE_official/status/2117924070620795174',
    'https://x.com/iLiFE_official/status/2117179964600775060',
]

JACKET = (
    '【CDジャケットデザイン公開】\n\n'
    '1月11日に発売される 「アイドルライフメガパック」のジャケットデザイン公開🎙❤︎\n\n'
    '「好き超えてちゅき♡」\n\n'
    '#iLiFE'
)
OOTD = '黄色とミントカラーがマイブーム💭🤍\n\n#iLiFE'
NEP = (
    'この後19時から放送されるフジテレビ『ネプリーグ』の新クイズ'
    '【ティーンはどれだけ知っている？知名度リーグ】に虹羽みにが登場します❤︎\n\n'
    '頑張ってクイズに挑戦するみにちゃん見てみてね🪽\n\n'
    'TVerでも配信されるよ📺\n\n'
    '#iLiFE #ネプリーグ'
)
STAFF_GOODS = (
    '【特典会&グッズ販売情報】\n\n'
    '11月5日開催の「VegaLiFE!」グッズ販売・特典会に関するお知らせです。\n\n'
    'なんと、、、\n⚠️🚨コラボ商品販売あり🚨⚠️\n\n'
    'それぞれのテイストがひっくり返った、激レアTシャツ。\n'
    'お見逃しなく✨\n\n'
    '●グッズ販売について\n'
    '・先行物販（整列順）\n16:30〜18:10 @ 会場前 グッズ販売エリア\n\n'
    '●特典会について\n'
    '事前案内の通り、本公演では前特典会を実施いたします。（終演後特典会はございません）\n\n'
    '受付/呼び出し開始 14:30\n特典会 15:00〜16:00（予定）\n\n'
    'https://t-dv.com/pJ22P2JPQICNbkFc0Z1S\n※11月3日 23:59まで'
)
FALILV_GOODS = (
    '11/5開催のVega LiFE!でスペシャルコラボグッズが出るでーー！\n'
    'こんなん！！\n\n'
    'みんな是非ともゲットして！！\n\n'
    '先行物販（整列順）\n16:30〜18:10\n'
    '※混雑状況に応じて購入制限あり\n\n'
    'OPEN中物販\n18:30〜19:30\n'
    '（入場者向け・場内動線のみ）'
)

# file, w, h, date, cat, author, post, orig media id, text, extras
IMAGES = [
    dict(file='group-e12-HWWmhXsawAE_O3m.webp', w=2048, h=2048, date='2026-11-05',
         cat='costume', kind='group', era='e12', author='iLiFE_official',
         post='2118282312316240064', mid='HWWmhXsawAE_O3m', text=JACKET, song=42),
    dict(file='official-HWWmhXeaQAAryE6.webp', w=2048, h=2048, date='2026-11-05',
         cat='official', author='iLiFE_official', post='2118282312316240064',
         mid='HWWmhXeaQAAryE6', text=JACKET, song=42),
    dict(file='other-HWRgtdNa0AAkanW.webp', w=1365, h=2048, date='2026-11-04',
         cat='other', author='iLiFE_official', post='2117924070620795174',
         mid='HWRgtdNa0AAkanW', text=OOTD),
    dict(file='other-HWRgtdDbUAADlzB.webp', w=1365, h=2048, date='2026-11-04',
         cat='other', author='iLiFE_official', post='2117924070620795174',
         mid='HWRgtdDbUAADlzB', text=OOTD),
    dict(file='official-HWG79N9boAANU2N.webp', w=1206, h=679, date='2026-11-02',
         cat='official', author='iLiFE_official', post='2117179964600775060',
         mid='HWG79N9boAANU2N', text=NEP, member=6,
         match='官方推文文本仅提及该成员', related=1),
    dict(file='live-854-HWHZgRNbwAE4PDP.webp', w=1448, h=2048, date='2026-11-02',
         cat='official', author='iLiFE_STAFF', post='2117225219186475391',
         mid='HWHZgRNbwAE4PDP', text=STAFF_GOODS, lives=[854]),
    dict(file='live-854-HWHaJ9Ia0AA-S6N.webp', w=2048, h=1448, date='2026-11-02',
         cat='official', author='iLiFE_STAFF', post='2117225219186475391',
         mid='HWHaJ9Ia0AA-S6N', text=STAFF_GOODS, lives=[854]),
    dict(file='live-854-HWHjyF7b0AAsPQA.webp', w=1448, h=2048, date='2026-11-02',
         cat='official', author='falilv', post='2117225220394348757',
         mid='HWHjyF7b0AAsPQA', text=FALILV_GOODS, lives=[854]),
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
    if meta.get('member'):
        parts.extend(['member', 'match', 'related'])
    return ','.join(parts)


def orig_of(mid):
    return f'https://pbs.twimg.com/media/{mid}.jpg?name=orig'


def apply_facts(cur):
    for url in CITE:
        source_id(cur, url)
    cur.execute('UPDATE lives SET note=? WHERE id=854', (NOTE_854,))
    row = cur.execute(
        'SELECT open_time, start_time, cover_image_id, note FROM lives WHERE id=854'
    ).fetchone()
    if row[0] != '18:30' or row[1] != '19:30' or row[2] != 4041 or row[3] != NOTE_854:
        raise SystemExit(f'854 没有保持开场开演和封面: {row[:3]}')
    cur.execute('UPDATE songs SET note=? WHERE id=42', (NOTE_42,))
    song = cur.execute(
        'SELECT cover_image_id, mv_date, release_date, note FROM songs WHERE id=42'
    ).fetchone()
    if song[0] != 4008 or song[1] != '2026-08-16' or song[2] != '2026-08-26' or song[3] != NOTE_42:
        raise SystemExit(f'第 42 首封面或日期被改动: {song[:3]}')


def apply_images(cur, man):
    added = 0
    skipped = []
    for meta in IMAGES:
        key = 'img/' + meta['file']
        if key not in man:
            skipped.append(key)
            continue
        author = meta['author']
        if author not in HANDLE:
            raise SystemExit(f'未知作者 {author}')
        post_url = HANDLE[author].format(meta['post'])
        sid = source_id(cur, post_url)
        orig = orig_of(meta['mid'])
        url = orig.replace('name=orig', 'name=large')
        exists = cur.execute('SELECT id FROM images WHERE local=?', (key,)).fetchone()
        if exists:
            iid = exists[0]
        else:
            cur.execute(
                '''INSERT INTO images(
                       url,orig,date,post_id,text,category,local,source,kind,era,w,h,
                       match,related,key_order)
                   VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)''',
                (url, orig, meta['date'], sid, meta['text'], meta['cat'], key,
                 f'X @{author}', meta.get('kind'), meta.get('era'), meta['w'], meta['h'],
                 meta.get('match'), meta.get('related'), key_order(meta)))
            iid = cur.lastrowid
            added += 1
        era = cur.execute(
            'SELECT id FROM eras WHERE start<=? ORDER BY start DESC LIMIT 1',
            (meta['date'],)).fetchone()[0]
        if meta.get('era') and meta['era'] != era:
            raise SystemExit(f'{key} 指定时期 {meta["era"]} 与日期 {meta["date"]} 的 {era} 不符')
        cur.execute('INSERT OR IGNORE INTO image_eras(image_id, era_id) VALUES(?,?)', (iid, era))
        if meta.get('member'):
            cur.execute(
                'INSERT OR IGNORE INTO image_members(image_id, member_id) VALUES(?,?)',
                (iid, meta['member']))
        for lid in meta.get('lives') or []:
            mx = cur.execute(
                'SELECT COALESCE(MAX(ord),-1) FROM image_lives WHERE live_id=?', (lid,)
            ).fetchone()[0]
            cur.execute(
                'INSERT OR IGNORE INTO image_lives(live_id, image_id, ord) VALUES(?,?,?)',
                (lid, iid, mx + 1))
        if meta.get('song'):
            mx = cur.execute(
                'SELECT COALESCE(MAX(ord),-1) FROM song_images WHERE song_id=?',
                (meta['song'],)).fetchone()[0]
            cur.execute(
                'INSERT OR IGNORE INTO song_images(song_id, image_id, ord) VALUES(?,?,?)',
                (meta['song'], iid, mx + 1))
        # 商品图和封面设计都不替换 854 / 第 42 首的现有封面
        cover = cur.execute('SELECT cover_image_id FROM lives WHERE id=854').fetchone()[0]
        song_cover = cur.execute('SELECT cover_image_id FROM songs WHERE id=42').fetchone()[0]
        if cover != 4041 or song_cover != 4008:
            raise SystemExit('封面被图片入库改掉了')
    print(f'新图片 {added} 张；清单里还没有、因此没入库 {len(skipped)} 张')
    for k in skipped:
        print('  未上传', k)
    return added


def main():
    import json
    man = json.load(open(MAN, encoding='utf-8')) if os.path.exists(MAN) else {}
    c = sqlite3.connect(DB)
    c.execute('PRAGMA foreign_keys=ON')
    cur = c.cursor()
    apply_facts(cur)
    apply_images(cur, man)
    c.commit()
    print('已提交')


if __name__ == '__main__':
    main()
