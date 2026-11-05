# 055 结果

分支：`cursor/055-recent-media-update-32b0`（只推这个分支，没有合并 main，没有部署，没有 force push）

`python3 db/export.py --check` 通过。导出版本 `6334215d`。公演仍是 873。图片 4549→4557（新增 8，id 4659–4666）。`song_videos` 没有新增。

脚本：`db/task055_apply.py`。公演备注和歌曲备注是定稿，重复跑会写成同一段，并且拒绝改动 854 的开场 18:30 / 开演 19:30 / 封面 4041，以及第 42 首的封面 4008、`mv_date` 2026-08-16、`release_date` 2026-08-26。图片只在 `db/r2_manifest.json` 已有对应键时入库。8 个键已逐个 `r2_images.py add`（没有用通配符），随后 `task055_apply.py` 写入 8 行。

窗口：2026-11-02 00:00 JST 至 2026-11-05。最后一次打开官方媒体时间线时，@iLiFE_official 最新一条仍是 11/5 19:00 JST 的封面设计帖，@iLiFE_STAFF 最新一条仍是 11/4 23:15 的 FC 博客。VegaLiFE! 开演是 19:30，这次没有等到演后静图或歌单。

X 连接器返回 `client-not-enrolled`，没有用 X API。时间线来自 fxtwitter `/2/profile/<handle>/media`，用来改数据的帖再用 `https://api.fxtwitter.com/status/<id>` 打开。

## R2

8 张 webp 已按长边 ≤2048、不裁切转好，单张 ≤1MB，并记入清单。本环境 `npx wrangler whoami` 未登录。Cloudflare 执行环境可以调用账号 API，但禁止拉取外站字节，图片又放不进单次请求，所以**还没有放进桶 `ilife-images`**。抽查 `img/official-HWG79N9boAANU2N.webp` 的公开地址是 HTTP 404。

父进程把下面 8 个文件按同名键、`Content-Type: image/webp`、原字节上传之后，公开地址才会 200，md5 才会与清单一致。文件在运行产物 `task055/` 下，文件名与键的最后一段相同。

| 键 | 宽×高 | 字节 | md5 |
| --- | --- | ---: | --- |
| `img/group-e12-HWWmhXsawAE_O3m.webp` | 2048×2048 | 899044 | `ccc094d7d981b43435d8b2d914ea2d4a` |
| `img/official-HWWmhXeaQAAryE6.webp` | 2048×2048 | 859790 | `c032360b1f0a865656ca5ae1046392fa` |
| `img/other-HWRgtdNa0AAkanW.webp` | 1365×2048 | 465204 | `bfa6cca76c9da67d2a236331155366e0` |
| `img/other-HWRgtdDbUAADlzB.webp` | 1365×2048 | 261264 | `3fff63a8c95256cdf82f4cf4f8a7f5ba` |
| `img/official-HWG79N9boAANU2N.webp` | 1206×679 | 166910 | `fe716fedb1e4ea9a61a707690858f66b` |
| `img/live-854-HWHZgRNbwAE4PDP.webp` | 1448×2048 | 541312 | `019f4b71127758d701794d6e0bb665be` |
| `img/live-854-HWHaJ9Ia0AA-S6N.webp` | 2048×1448 | 518060 | `dfce67fe848c70d122510ee61f4f1088` |
| `img/live-854-HWHjyF7b0AAsPQA.webp` | 1448×2048 | 525390 | `34b55ddb126159d6626217fe28e6efa5` |

上传（登录 wrangler 之后，一次一个文件）：

```bash
npx wrangler r2 object put ilife-images/img/group-e12-HWWmhXsawAE_O3m.webp --file "img/group-e12-HWWmhXsawAE_O3m.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/official-HWWmhXeaQAAryE6.webp --file "img/official-HWWmhXeaQAAryE6.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/other-HWRgtdNa0AAkanW.webp --file "img/other-HWRgtdNa0AAkanW.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/other-HWRgtdDbUAADlzB.webp --file "img/other-HWRgtdDbUAADlzB.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/official-HWG79N9boAANU2N.webp --file "img/official-HWG79N9boAANU2N.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-854-HWHZgRNbwAE4PDP.webp --file "img/live-854-HWHZgRNbwAE4PDP.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-854-HWHaJ9Ia0AA-S6N.webp --file "img/live-854-HWHaJ9Ia0AA-S6N.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-854-HWHjyF7b0AAsPQA.webp --file "img/live-854-HWHjyF7b0AAsPQA.webp" --content-type image/webp --remote
python3 db/r2_images.py verify img/official-HWG79N9boAANU2N.webp img/group-e12-HWWmhXsawAE_O3m.webp img/live-854-HWHZgRNbwAE4PDP.webp
```

`add` 已经跑过，不要为了同一批字节再跑一遍（内容相同会直接覆盖成同一条；内容不同会被拒绝）。上传完成前不要合并，否则这 8 张图在站上是空的。

## 公演

没有新场次。854 的标题、会场、开场 18:30、开演 19:30、封面（image 4041，既有告知图）都没改。

| 场次 | 改动 | 打开过的依据 |
| --- | --- | --- |
| 854 | 备注补上会场日程、合作方公告、工作人员物贩与前特典会、合作方 OPEN 中物贩。特典会券页面的 14:30 不写入开场开演 | https://toyosu.pia-pit.jp/schedule/202610/8919.html ；https://lasvegas-jp.com/topics/9299 ；https://x.com/iLiFE_STAFF/status/2117225219186475391 ；https://t-dv.com/pJ22P2JPQICNbkFc0Z1S ；https://x.com/falilv/status/2117225220394348757 |

丰洲PIT日程页写出演 Fear, and Loathing in Las Vegas / iLiFE!，Special 2MAN LIVE「VegaLiFE!」，开场 18:30、开演 19:30，一般票 ￥5000（税込、入场另付饮料）。合作方官网 `lasvegas-jp.com/topics/9299` 写同一日期、会场和开场开演，并写明是为 iLiFE! 提供「i REVOLUTION」之后的两曼。

工作人员帖：先行物贩 16:30–18:10（会场前，整列顺序，可能限购）；只做前特典会，没有终演后特典会；受付/呼出 14:30，特典会 15:00–16:00（预定）；参加券是 FC 限定，截止 11/3 23:59。TicketDive 页标题是「【11/05】iLiFE! 前特典会参加券 @ 豊洲PIT」，页首开场/开演 14:30，正文写这是特典会整理券，受付约 14:30，特典会 15:00–16:00，15:40 停止受付，并且要先持有公演票。所以 854 的开场开演仍是 18:30 / 19:30。

@falilv（作者名 Falilv）11/2 21:00 JST 的帖写「11/5開催のVega LiFE!」合作商品，先行物贩 16:30–18:10，并多一句 OPEN 中物贩 18:30–19:30（入场者、场内动线）。图上印着 iLiFE! × Las Vegas。

故意不建场：

- https://t-dv.com/heroines_league1113 的 HEROINES LEAGUE 決勝戦 vol.1（2026-11-13，Zepp Haneda，开场 16:30 / 开演 17:00）出演写的是 のんふぃく！/ iON! / TENRIN / AdamLilith / 夜行性アミューズ。海报 https://x.com/heroines_idol/status/2117557453458219165 也是这五组，没有 iLiFE!。
- https://t-dv.com/heroinesleague-20261108 是 2026-11-08 入れ替え戦（开场 10:00 / 开演 10:30）。海报 https://x.com/heroines_idol/status/2117199661257887858 列的是パラディーク、ポンコツコンポ、アキシブproject、ZUTTOMOTTO、ナナコロビヤオキ、ラストシーン、chuLa、Ill、テンシンランマン、ドレスコード，没有 iLiFE!。票页正文没有出演名单，以这张已打开的海报为准，不建场。
- @HEROINES_FES 媒体时间线在本窗口没有新帖（最新仍是 10/28）。@IDOLHJ_official 最新是 11/1 23:12，早于本窗口。

## 歌曲

| 歌 | 改动 | 打开过的依据 |
| --- | --- | --- |
| 42 アイドルライフメガパック | 备注改为 CD 封面设计已于 2026-11-05 公开。封面仍是配信 jacket（image 4008）。`mv_date` 2026-08-16、`release_date` 2026-08-26 不动。两张设计图挂到相关图片 | https://x.com/iLiFE_official/status/2118282312316240064 |

帖文用「」点了曲名「アイドルライフメガパック」，标语是「好き超えてちゅき♡」。没有写初回限定盘、通常盘、成员盘各对应哪一张，所以不把目录号安到某一张图上，也不新建曲目。现有打歌服（costume 24，新生期アー写衣装）是另一套衣服，这两张没有挂进那一套。

## 图片

分类按任务 039：九人封面合影是 `costume` + `group`；九人分格是告知拼贴，`official`，不设 `kind=group`。商品图是 `official`，挂 854，不换封面。私服照是 `other`，帖文没有点名成员，不挂 `image_members`。ネプリーグ是 `official`，正文点名虹羽みに，`related=1`，`match` 为「官方推文文本仅提及该成员」，不设 `kind=individual`，避免换成成员卡片头像。

首页英雄图仍按「当前时期、category=official、正文含アー写」选取。e12 里符合的仍是 2026-06-05 的新アー写（image 3625 / 3621）。这张封面合影是 `costume`，正文是封面设计公开，不会换上英雄图。它会进入首页「最新团体公式图」条，因为那一栏收的是全部 `kind=group` 静图。

| 文件 | id | 帖 | 入库后 |
| --- | --- | --- | --- |
| `group-e12-HWWmhXsawAE_O3m.webp` | 4659 | https://x.com/iLiFE_official/status/2118282312316240064 | 九人 CD 封面合影，挂歌曲 42，不作封面 |
| `official-HWWmhXeaQAAryE6.webp` | 4660 | 同上 | 九人分格封面，挂歌曲 42，不设团体 |
| `other-HWRgtdNa0AAkanW.webp` | 4661 | https://x.com/iLiFE_official/status/2117924070620795174 | 黄/薄荷私服全身。品牌字是 Candy Stripper、SHEIN。不挂成员 |
| `other-HWRgtdDbUAADlzB.webp` | 4662 | 同上 | 同一套衣服的近景 |
| `official-HWG79N9boAANU2N.webp` | 4663 | https://x.com/iLiFE_official/status/2117179964600775060 | 11/2 19:00 フジテレビ『ネプリーグ』告知，挂虹羽みに的相关图，不建公演 |
| `live-854-HWHZgRNbwAE4PDP.webp` | 4664 | https://x.com/iLiFE_STAFF/status/2117225219186475391 | 合作 T 恤海报，挂 854，不换封面 |
| `live-854-HWHaJ9Ia0AA-S6N.webp` | 4665 | 同上 | 11/5 商品一览，挂 854 |
| `live-854-HWHjyF7b0AAsPQA.webp` | 4666 | https://x.com/falilv/status/2117225220394348757 | 同一套合作海报的竖版，挂 854 |

## YouTube

`db/yt_channel_scan.py` 仍是 94 条，最新仍是 10/31 的《i REVOLUTION》MV `-IOtOZJutdk`，这条已在 054 入库。频道 RSS 在视频页之外还有本窗口的短片，oEmbed 作者都是 `iLiFE!【あいらいふ】`，标题对不上曲名，没有写入 `song_videos`：

| 上传（UTC） | id | 标题 |
| --- | --- | --- |
| 2026-11-05 09:00 | `JGCAaLPjQDM` | 好き超えてちゅき🩷 #iLiFE |
| 2026-11-04 09:00 | `9bu3wiSHGzw` | 🏴‍☠️#iLiFE |
| 2026-11-03 09:00 | `nR_c282Y5es` | iLiFE!にしチャイナ〜？🐼#iLiFE |
| 2026-11-02 12:00 | `kPdzSoZKeLk` | IDOL HALLOWEEN JAPANありがとうございました🎃 #iLiFE |
| 2026-11-02 09:00 | `7OvrRL2jAYQ` | 🧧iLiFE! HALLOWEEN🧧 お札、剥がしてくれる？👻❤️#心花りり#iLiFE |

「好き超えてちゅき」是封面帖的标语，曲库里没有这首歌，不新建歌曲，也不把短片当成 MV。

## 故意不收

- https://x.com/iLiFE_official/status/2117640307751993532 （11/4 00:29，初のGFEST，视频）和 https://x.com/iLiFE_official/status/2117201850357387642 （11/2 19:27，万圣节夜视频）是视频，没有静图，标题也不是曲名影像。
- FC 博客更新不收。打开过 https://x.com/iLiFE_STAFF/status/2117984181523566881 的第一张，是磨砂预览，认不出人。同模板的还有 https://x.com/iLiFE_STAFF/status/2117968213355159789 （若葉のあ）、https://x.com/iLiFE_STAFF/status/2117630941049020671 （真守みゅう）、https://x.com/iLiFE_STAFF/status/2117160970758103436 （純嶺みき）。
- @falilv 11/2 23:46–23:49 的四条是仙台 The Focus「Feeling of Unity」Vol.1，不是 VegaLiFE!，没有收图。
- 上面两张 HEROINES LEAGUE 海报没有 iLiFE!，不入库。

## 页面

导出的 `data/lives.json` 里 854 现有 4 张图（原封面 4041，加上 4664–4666），封面仍是 4041。歌曲 42 的相关图片加上 4659、4660。公开地址前缀 `https://img.ilifefan.dpdns.org/img/`。这 8 个键在上传完成前会 404。
