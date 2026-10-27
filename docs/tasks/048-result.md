# 048 结果：抽签页

新增 `draw.html`。导航在「歌曲」和「公演」之间是 `DRAW / 抽签`。

## 行为

- 大胶囊切换 **抽歌** / **抽推**，默认抽歌。偏好、今日首抽和每种模式最近 20 条写在 `localStorage` 键 `ilifefan-draw-v1`。
- 抽歌池子是 `songs.json`。筛选：全部 61 / 团体曲 44（`member` 为空）/ 个人曲 17。封面选择与歌曲列表相同。没有时长时写成 `—`。结果链到 `songs.html?s=<id>`。
- 抽推默认现役 9 人；打开「含前成员」后是 26 人。照片用 `latestPhoto`，应援色条用成员 hex，有口号才显示。结果链到 `members.html?m=`。
- 不锁每日次数。该模式在日本时间当天的第一抽带「今日首抽」。再抽会先把卡片翻过去再翻出来，并撒一圈站点粉或成员色花瓣。`prefers-reduced-motion: reduce` 时直接换结果，不撒花瓣。
- 下标用 `crypto.getRandomValues` 做拒绝采样。减少动态效果时不会用到 `Math.random`。
- 「保存卡片」用 canvas 画竖版 PNG（宽 1080，高度随内容，大约 1300–1500）并下载。图上有 iLiFE! 应援资料库、日期、歌曲或成员。浏览器有 Web Share 时多一个「分享」。页底可以导出 / 导入 JSON，清空时保留当前筛选。
- 卡片和分享图里的图片都是完整装入，不裁切。

## 版本

- `python3 db/export.py --check` 通过。版本 `8031997f`（上一版 `e95a0445`）。曲目、成员、图片 JSON 没有改内容，只更新了 `data/version.json` 和各页 `?v=`。
- 分享图要把 `img.ilifefan.dpdns.org` 画进 canvas。R2 桶 `ilife-images` 加了只读 CORS（`GET`/`HEAD`，`Origin: *`）。图片域名再加了一条响应头规则，缓存命中时也带 `Access-Control-Allow-Origin: *`。没有新上传文件。

## 怎么试

预览：<https://cursor-048-draw-f8d2.ilifefan.pages.dev/draw>

1. 抽歌：点「抽取」。看封面、日文歌名、假名、时长、作品和「今日首抽」。点「查看歌曲」进入 `songs.html?s=`。再抽一次，角标不再出现。筛「个人曲」后再抽，结果应是个人曲；筛「团体曲」则是团体曲。
2. 抽推：切到「抽推」再抽。默认是现役。打开「含前成员」后池子变成 26 人，可以抽到前成员。点「查看成员」进入 `members.html?m=`。
3. 「保存卡片」下载 PNG。「导出存档」得到 JSON，清空后再导入会恢复最近记录。

本地 Chrome 核对过桌面 1280 和手机 390：两种模式、再抽、筛选、含前成员、历史最多 20 条、导出导入、歌曲详情链接。手机宽度没有整页横向滚动。保存卡片时控制台不再报图片跨域。

## 截图

- 桌面待机：`/opt/cursor/artifacts/draw-idle-desktop.png`
- 桌面抽歌：`/opt/cursor/artifacts/draw-song-desktop.png`
- 桌面抽推：`/opt/cursor/artifacts/draw-member-desktop.png`
- 手机待机：`/opt/cursor/artifacts/draw-idle-mobile.png`
- 手机抽歌：`/opt/cursor/artifacts/draw-song-mobile.png`
- 手机抽推：`/opt/cursor/artifacts/draw-member-mobile.png`
- 手机导航：`/opt/cursor/artifacts/draw-nav-mobile.png`
- 分享图（抽歌）：`/opt/cursor/artifacts/draw-share-song.png`
- 分享图（抽推）：`/opt/cursor/artifacts/draw-share-member.png`
