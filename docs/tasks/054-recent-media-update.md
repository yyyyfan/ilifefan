# 054 近期公演、官方图与影像

执行者：cloud agent（不合并 main，不部署）  
分支：`cursor/054-recent-media-update-1386`

## 目标

核对 2026-10-31 到 2026-11-02（JST）的官方动态。上一任务 053 收到 10/31 00:00 的万圣节合影为止，本窗口从这一刻之后接着看。做完后，10/31 与 11/1 两场 IDOL HALLOWEEN 的歌单和演后备注与官方帖一致；《i REVOLUTION》的官方 MV 写入影像表。新图已转成 webp，但本环境没能上传 R2，所以图还没入库。

## 范围

- 改：`db/ilife.sqlite` 的 `lives`（852、853 的备注与歌单）、`songs`（第 44 首的 MV 公开日与备注）、`song_videos`、`sources`；`db/export.py` 导出的 `data/*.json` 与页面版本号；本任务脚本 `db/task054_apply.py` 与 `db/task054_plan.json`。
- 不改：页面样式、`app.js` 文案、会场、开场开演（053 已按时间表写过，本窗口没有新的时间订正）。不把粉丝影像写进 `song_videos`。不使用 Eventernote / LiveFans 的图。不合并 main，不部署。
- 图片字节不进 Git。13 张 webp 已转好，放在本地 `img/`（gitignore）并复制到 `/opt/cursor/artifacts/054-webp/`。`db/r2_manifest.json` 没有记这些键。上传并逐个 `r2_images.py add` 之后，再跑 `python3 db/task054_apply.py` 才会入库、并改封面。

## 数据来源

- X @iLiFE_official、@iLiFE_STAFF、@HEROINES_FES、@heroines_idol、@IDOLHJ_official 的媒体时间线与 RSS（fxtwitter）。X 连接器返回 `client-not-enrolled`，没有用 X API。每条用来改数据的帖都用 `https://api.fxtwitter.com/status/<id>` 打开过，作者与正文一致。
- 官方 YouTube：`db/yt_channel_scan.py` 抓到 94 条；新的一条用观看页与 oEmbed 打开过。
- 日期用推文 snowflake 换算成 JST。没有打开到的地址不写入。

## 验收标准

- [x] `python3 db/export.py --check` 通过，导出版本 `669aa4dc`
- [x] 852、853 写入工作人员歌单；备注补上演后帖、合作合影衣装、抽选会位置。开场 10:00、开演 11:00 未改
- [x] 没有新的 iLiFE! 场次。11/2 截至再次确认，官方号最新一条仍是 11/1 22:46 JST
- [x] 《i REVOLUTION》写入官方 MV（`-IOtOZJutdk`，2026-10-31）；`mv_date` 从 2026-08-26 改为 2026-10-31，发行日不动
- [ ] 13 张 webp 上传 R2、逐个 `r2_images.py add`、再跑 `db/task054_apply.py` 入库。本环境 wrangler 未登录，Cloudflare 连接器中途要求重新认证，没有上传，也没有把缺对象的键写进清单
- [x] 官方 YouTube 除上述 MV 外，没有新的曲名影像。花絮、试镜、SE、翻唱不写入
- [x] 只推送本分支；未合并 main，未部署

## 状态

待验收。公演歌单、备注和官方 MV 已入库，导出版本 `669aa4dc`。13 张图只转码、未上传、未入库。明细见 `docs/tasks/054-result.md`。
