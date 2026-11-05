# 055 近期公演、官方图与影像

执行者：cloud agent（不合并 main，不部署）  
分支：`cursor/055-recent-media-update-32b0`

## 目标

核对 2026-11-02 到 2026-11-05（JST）的官方动态。上一任务 054 收到 11/1 的演后与《i REVOLUTION》MV 为止，本窗口从 11/2 00:00 JST 接着看，到 11/5 晚间再次确认官方媒体时间线为止。做完后，11/5「VegaLiFE!」的物贩与前特典会备注与已打开的官方页一致；《アイドルライフメガパック》的 CD 封面设计入库，配信 jacket 仍是歌曲封面。

## 范围

- 改：`db/ilife.sqlite` 的 `lives`（854 的备注）、`songs`（第 42 首的备注）、`images` 与关联表、`sources`；`db/r2_manifest.json`；`db/export.py` 导出的 `data/*.json` 与页面版本号；本任务脚本 `db/task055_apply.py`。
- 不改：页面样式、`app.js` 文案、会场、854 的开场 18:30 / 开演 19:30、歌曲封面、首页英雄图所用的现时期团体アー写。不把粉丝影像或标题对不上曲名的短片写进 `song_videos`。不使用 Eventernote / LiveFans 的图。不合并 main，不部署。
- 图片字节不进 Git。8 张 webp 已转好。本环境 wrangler 未登录，Cloudflare 执行环境也不能拉取外站字节，所以原文件放在运行产物里，清单按本地字节登记。父进程上传到 R2 后，公开地址才应是 200。校验值见 `055-result.md`。

## 数据来源

- X @iLiFE_official、@iLiFE_STAFF、@falilv、@HEROINES_FES、@heroines_idol、@IDOLHJ_official 的媒体时间线（fxtwitter `/2/profile/<handle>/media`）。X 连接器返回 `client-not-enrolled`，没有用 X API。每条用来改数据的帖都用 `https://api.fxtwitter.com/status/<id>` 打开过。
- 售票与会场页（从帖子或会场日程打开）：`https://t-dv.com/pJ22P2JPQICNbkFc0Z1S`、`https://toyosu.pia-pit.jp/schedule/202610/8919.html`、`https://lasvegas-jp.com/topics/9299`、`https://t-dv.com/heroines_league1113`、`https://t-dv.com/heroinesleague-20261108`。
- 官方 YouTube：频道视频页 94 条，与 054 相同；另打开了频道 RSS 与本窗口 5 条短片的 oEmbed。标题对不上曲名，不写入。

日期用推文时间换算成 JST。没有打开到的地址不写入。

## 验收标准

- [x] `python3 db/export.py --check` 通过，导出版本 `6334215d`
- [x] 854 备注写上已打开的会场日程、合作方公告、工作人员物贩 / 前特典会、合作方 OPEN 中物贩。开场 18:30、开演 19:30 不改。特典会券页面上的 14:30 不写进开场开演
- [x] 没有新的 iLiFE! 场次。HEROINES LEAGUE 决赛与入れ替え戦的票页和海报都没有 iLiFE!
- [x] 第 42 首备注改为 CD 封面设计已于 2026-11-05 公开。封面仍是配信 jacket。两张设计图挂到歌曲相关图片
- [x] 8 张 webp 逐个 `r2_images.py add`。对象还没在桶里，文件名、md5 和上传命令在 `055-result.md`
- [x] 官方 YouTube 没有新的曲名影像需要写入 `song_videos`
- [x] 首页英雄图仍是当前时期、category=official、正文含アー写的团体图
- [x] 只推送本分支；未合并 main，未部署

## 状态

待验收。854 的备注、第 42 首的封面设计说明和 8 张图的清单已写入，导出版本 `6334215d`。8 个对象还没有上传到 R2，公开地址目前 404。明细见 `docs/tasks/055-result.md`。
