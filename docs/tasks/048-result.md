# 048 结果：抽签页

新增 `draw.html`。导航在「歌曲」和「公演」之间加入 `DRAW / 抽签`。

## 行为

- 大胶囊切换 **抽歌** / **抽推**，默认抽歌。偏好、今日首抽和最近 20 条记录写在 `localStorage` 键 `ilifefan-draw-v1`。
- 抽歌池子是 `songs.json`。筛选：全部 61 / 团体曲 44（`member` 为空）/ 个人曲 17。封面选择与歌曲列表相同（方形 jacket，其次 MV 缩略图，再退到其他封面）。结果链到 `songs.html?s=<id>`。
- 抽推默认现役 9 人；「含前成员」打开后是全部 26 人。照片用现有 `latestPhoto`。应援色条用成员 `hex`。有 `catch` 才显示口号。结果链到 `members.html?m=`。
- 不锁每日次数。该模式在日本时间当天的第一抽带「今日首抽」。再抽会先把卡片翻过去，再翻出新结果，并撒一圈站点粉 / 成员色花瓣。`prefers-reduced-motion: reduce` 时直接换结果。
- 随机下标用 `crypto.getRandomValues` 做拒绝采样，不用日期种子。
- 「保存卡片」用 canvas 画竖版 PNG（1080×1620）并下载。浏览器有 Web Share 时多一个「分享」。页底可导出 / 导入 JSON，或清空记录（保留当前筛选）。
- 图片在卡片和分享图里都是完整装入（`object-fit: contain` / canvas contain），不裁切。

## 版本

- `python3 db/export.py --check` 通过。版本 `5f4aa4ed`（上一版 `e95a0445`）。曲目、成员、图片 JSON 没有改内容，只更新了 `data/version.json` 和各页 `?v=`。
- 分享图要把 `img.ilifefan.dpdns.org` 画进 canvas，所以给 R2 桶 `ilife-images` 加了只读 CORS（`GET`/`HEAD`，`Origin: *`），并按主机名清了一次图片缓存。没有新上传文件。

## 怎么试

本地或预览站打开 `draw.html`。

1. 抽歌：点「抽取」，看封面、歌名、假名、时长、作品和「今日首抽」。点「查看歌曲」应进入 `songs.html?s=`。再抽一次，角标不再出现。筛选「个人曲」后再抽，结果应是个人曲。
2. 抽推：切到「抽推」再抽。默认是现役。打开「含前成员」后池子变成 26 人。点「查看成员」进入 `members.html?m=`。
3. 「保存卡片」下载 PNG。「导出存档」得到 JSON，清空后再导入应恢复最近记录。

## 截图

浏览器核对后补上桌面、手机和分享图。
