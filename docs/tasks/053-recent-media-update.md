# 053 近期公演、官方图与影像

执行者：cloud agent（不合并 main，不部署）  
分支：`cursor/053-recent-media-update-e7b2`

## 目标

把大约 2026-10-20 到 2026-10-31（JST）的官方动态补进资料库：公演标题、时间、备注和出处，以及这期间还没入库的官方照片。已经宣布、落在 11 月上旬的场次（札幌巡演、YANFES、11/14 线上签名与宾果、11/17 札幌发售活动）一并核对。做完后，能对上的场次详情与官方帖一致；新图走 R2，不进 Git。

## 范围

- 改：`db/ilife.sqlite` 的 `lives` / `sources` / `live_members`，以及成功上传并核对过的 `images` 与关联表；`db/r2_manifest.json` 只记已上传对象；`db/export.py` 导出的 `data/*.json` 与页面版本号；本任务脚本 `db/task053_apply.py`。
- 不改：页面样式、`app.js` 文案、歌曲表结构。不把粉丝影像自动写进 `song_videos`。不使用 Eventernote / LiveFans 的图。不合并 main，不部署。
- 图片字节只放本地 `img/`（已 gitignore）和 R2。Cloudflare 连接器在本环境需要重新登录，`wrangler` 也未登录，因此本分支**还没有**把新图写入清单或数据库。上传命令和校验值在 `053-result.md`。

## 数据来源

- X @iLiFE_official 媒体时间线（fxtwitter `/2/profile/iLiFE_official/media`，2026-10-12 至 2026-10-31），以及任务单点名的状态帖。每条用来改数据的帖都打开过，作者是官方账号。
- 主办 / 工作人员：@HEROINES_FES、@iLiFE_STAFF、@heroines_idol 的同期媒体帖。只收写明 iLiFE! 的演后静图和特典会 / 物贩告知，不收其他团体的照片。
- 售票页（从官方帖链接打开）：`https://t-dv.com/ilive-261116`、`https://t-dv.com/YANFES-261118`、`https://t-dv.com/YANFES_ura-261118`、`https://t-dv.com/IHJ2026`。
- 官方 YouTube 频道 @ilife_official，用 `db/yt_channel_scan.py` 抓列表，再与 `song_videos` 对照。

日期用推文 snowflake / `created_at` 换算成 JST。没有打开到的地址不写入。

## 验收标准

- [x] `python3 db/export.py --check` 通过
- [x] 856 标题改为官方售票页与时间表上的「iLiVE! TOUR SAPPORO」，开场 13:00、开演 14:00，出处改为札幌时间表帖
- [x] 23 / 24 的备注写明あいす只休息特典会，并写上订正后的衣装
- [x] 852 / 853 开场 10:00、开演 11:00，备注含 iLiFE! 舞台时间、しなこ合作、特典会时间与衣装订正
- [x] 867 备注补上 11/14 线上签名与宾果（图上没有开始时刻，不填时间）
- [x] 868 开演改为官方图上的 14:00
- [x] 新增 2026-11-18「YANFES 2026」（豊洲PIT，开场 10:30、开演 11:00）；裏会场没有 iLiFE!，不建场
- [ ] 36 张已转好的 webp 上传到 R2 并 `r2_images.py verify` 通过后，再跑 `python3 db/task053_apply.py` 入库。本环境 Cloudflare 未登录，这一步未做，数据库里没有新图片行
- [x] 官方 YouTube 没有新的曲名影像需要写入 `song_videos`
- [x] 只推送本分支；未合并 main，未部署

## 状态

待验收。公演事实已入库。图片转码完成但未上 R2，明细见 `docs/tasks/053-result.md`。
