# 048 结果：抽签页

新增 `draw.html`。导航在「歌曲」和「公演」之间是 `DRAW / 抽签`。

## 行为

- 待机是居中窄栏。大标题「今日抽一首歌」或「今日抽一位推」，下面一行小字说明不限次数。大胶囊切换 **抽歌** / **抽推**，默认抽歌。票根样式的签、大圆角「抽取」，以及三张说明卡：抽歌、抽推、分享。
- 点抽取后，签先摇大约两秒，旁边是「正在抽歌…」或「正在抽推…」。摇完展开横线签纸：日期、拍立得式图片、圆章、歌名或成员名。当天该模式的第一抽，圆章是「今日首抽」，并有一圈粉色花瓣。
- 偏好、今日首抽和每种模式最近 20 条写在 `localStorage` 键 `ilifefan-draw-v1`。最近记录是软卡片格子，点开回到那一次的签纸，不重新抽。
- 抽歌池子是 `songs.json`。筛选：全部 61 / 团体曲 44（`member` 为空）/ 个人曲 17。封面选择与歌曲列表相同。没有时长时写成 `—`。结果链到 `songs.html?s=<id>`。
- 抽推默认现役 9 人；打开「含前成员」后是 26 人。照片用 `latestPhoto`，应援色条用成员 hex，有口号才显示。结果链到 `members.html?m=`。
- 不锁每日次数。`prefers-reduced-motion: reduce` 时跳过摇签、圆章弹出和花瓣，直接出结果。下标用 `crypto.getRandomValues` 做拒绝采样。减少动态效果时不会用到 `Math.random`。
- 曲目或成员信息下面是「今日运势」。签语是一句应援口吻的短句。幸运色是圆点色块加中文名：抽推用该成员的应援色和色名，抽歌从粉色系浅色里抽。幸运物品、今日行动各一行。词库在 `app.js` 的 `PASTELS` / `LUCK_ITEMS` / `LUCK_ACTS` / `LUCK_MOTTOS`。同一抽的运势写进 `ilifefan-draw-v1` 的历史记录，再打开和分享图用的是同一份。
- 「保存卡片」只一个按钮。浏览器能 `canShare({files})` 时用系统分享把 PNG 发出去；取消分享不会再下载。其他情况下载 900×1600 的 PNG。图上有横线签纸、拍立得、圆章、今日运势四项、iLiFE! 应援资料库、日本时间日期、歌曲或成员，页脚写非官方粉丝站。页底可以导出 / 导入 JSON，清空时保留当前筛选。
- 页面和分享图里的图片都是完整装入，不裁切。

## 版本

- `python3 db/export.py --check` 通过。合入 main 后版本 `87167ce6`（上一版 `4167adc3`）。曲目、成员、图片 JSON 没有改内容，只更新了 `data/version.json` 和各页 `?v=`。
- 分享图要把 `img.ilifefan.dpdns.org` 画进 canvas。R2 桶 `ilife-images` 已有只读 CORS（`GET`/`HEAD`，`Origin: *`）。图片域名的响应头规则让缓存命中时也带 `Access-Control-Allow-Origin: *`。没有新上传文件。

## 怎么试

预览：<https://cursor-048-draw-f8d2.ilifefan.pages.dev/draw>

1. 抽歌：点「抽取」。先看到摇签，大约两秒后是签纸、封面、日文歌名、假名、时长、作品和「今日首抽」。下面有今日运势：签语、幸运色（浅色圆点）、幸运物品、今日行动。点「查看歌曲」进入 `songs.html?s=`。再抽一次，圆章改成「抽歌」，运势换一套。筛「个人曲」后再抽，结果应是个人曲；筛「团体曲」则是团体曲。
2. 抽推：切到「抽推」再抽。默认是现役。幸运色圆点和色名对应该成员的应援色。打开「含前成员」后池子变成 26 人，可以抽到前成员。点「查看成员」进入 `members.html?m=`。
3. 「保存卡片」在能分享文件的浏览器里直接分享，否则下载 900×1600 的 PNG，图里也有这四项运势。「导出存档」得到 JSON，清空后再导入会恢复最近记录。

## 截图

- 桌面待机：`/opt/cursor/artifacts/draw-idle-desktop.png`
- 桌面摇签：`/opt/cursor/artifacts/draw-shake-desktop.png`
- 桌面抽歌：`/opt/cursor/artifacts/draw-song-desktop.png`
- 桌面抽推：`/opt/cursor/artifacts/draw-member-desktop.png`
- 手机待机：`/opt/cursor/artifacts/draw-idle-mobile.png`
- 手机抽歌：`/opt/cursor/artifacts/draw-song-mobile.png`
- 手机抽推：`/opt/cursor/artifacts/draw-member-mobile.png`
- 手机导航：`/opt/cursor/artifacts/draw-nav-mobile.png`
- 分享图（抽歌）：`/opt/cursor/artifacts/draw-share-song.png`
- 分享图（抽推）：`/opt/cursor/artifacts/draw-share-member.png`
