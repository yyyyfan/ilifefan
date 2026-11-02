# 054 结果

分支：`cursor/054-recent-media-update-1386`（只推这个分支，没有合并 main，没有部署，没有 force push）

`python3 db/export.py --check` 通过。导出版本 `95c9f791`。公演仍是 873。图片 4536→4549（新增 13，id 4646–4658）。`song_videos` 增加 1 条官方 MV。

脚本：`db/task054_apply.py`，分类在 `db/task054_plan.json`。公演备注和歌单是定稿，重复跑会写成同一段。图片只在 `db/r2_manifest.json` 已有对应键时才入库。13 个键已逐个 `r2_images.py add`，随后 `task054_apply.py` 写入 13 行。

## R2

13 张已在桶 `ilife-images`。公开地址抽查 3 张为 HTTP 200、`image/webp`，字节数与 md5 与清单一致：

- `img/live-852-HV9rKbFacAA--g1.webp`（852 封面）
- `img/live-853-HWCz892aAAAXxHx.webp`（853 封面）
- `img/official-HV7kJtDaEAALkGM.webp`

前缀 `https://img.ilifefan.dpdns.org/img/`。登记是逐个 `python3 db/r2_images.py add`，没有用通配符。852 封面现为舞台背影 `live-852-HV9rKbFacAA--g1.webp`（image 4648）。853 封面现为焰火舞台 `live-853-HWCz892aAAAXxHx.webp`（image 4652）。

当初上传前暂存的命令（已执行 add / verify / apply，不再需要重跑）：

```bash
npx wrangler r2 object put ilife-images/img/group-e12-HV9rKa6bEAAdTkv.webp --file "img/group-e12-HV9rKa6bEAAdTkv.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/group-e12-HWCz89waAAAHrIw.webp --file "img/group-e12-HWCz89waAAAHrIw.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-852-HV9rKbEbcAACEO3.webp --file "img/live-852-HV9rKbEbcAACEO3.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-852-HV9rKbFacAA--g1.webp --file "img/live-852-HV9rKbFacAA--g1.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-852-HV9rKbIa0AAt5et.webp --file "img/live-852-HV9rKbIa0AAt5et.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-853-HWBiOcAbYAAIkx4.webp --file "img/live-853-HWBiOcAbYAAIkx4.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-853-HWCAhYebMAAMHI2.webp --file "img/live-853-HWCAhYebMAAMHI2.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-853-HWCilDraUAAZbHg.webp --file "img/live-853-HWCilDraUAAZbHg.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-853-HWCz892aAAAXxHx.webp --file "img/live-853-HWCz892aAAAXxHx.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-853-HWCz89ybcAEGA-Q.webp --file "img/live-853-HWCz89ybcAEGA-Q.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/official-HV7kJtDaEAALkGM.webp --file "img/official-HV7kJtDaEAALkGM.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/official-HV8pKDsaMAAhr7J.webp --file "img/official-HV8pKDsaMAAhr7J.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/official-HV9MAeracAAE1M0.webp --file "img/official-HV9MAeracAAE1M0.webp" --content-type image/webp --remote
python3 db/r2_images.py add img/group-e12-HV9rKa6bEAAdTkv.webp
python3 db/r2_images.py add img/group-e12-HWCz89waAAAHrIw.webp
python3 db/r2_images.py add img/live-852-HV9rKbEbcAACEO3.webp
python3 db/r2_images.py add img/live-852-HV9rKbFacAA--g1.webp
python3 db/r2_images.py add img/live-852-HV9rKbIa0AAt5et.webp
python3 db/r2_images.py add img/live-853-HWBiOcAbYAAIkx4.webp
python3 db/r2_images.py add img/live-853-HWCAhYebMAAMHI2.webp
python3 db/r2_images.py add img/live-853-HWCilDraUAAZbHg.webp
python3 db/r2_images.py add img/live-853-HWCz892aAAAXxHx.webp
python3 db/r2_images.py add img/live-853-HWCz89ybcAEGA-Q.webp
python3 db/r2_images.py add img/official-HV7kJtDaEAALkGM.webp
python3 db/r2_images.py add img/official-HV8pKDsaMAAhr7J.webp
python3 db/r2_images.py add img/official-HV9MAeracAAE1M0.webp
python3 db/r2_images.py verify img/live-852-HV9rKbFacAA--g1.webp img/live-853-HWCz892aAAAXxHx.webp img/official-HV7kJtDaEAALkGM.webp
python3 db/task054_apply.py
python3 db/export.py --rebuild-derived
```

上面的 add、verify、apply 已经跑过。`verify` 核对 3 个对象，问题 0 个。852、853 的封面已换成舞台照，不再是 image 4081。

## 公演

没有新场次。开场、开演、会场、标题都沿用 053，本窗口没有新的时间表订正。

| 场次 | 改动 | 打开过的依据 |
| --- | --- | --- |
| 852 | 写入 10/31 歌单。备注补演后感谢、歌单帖、抽选会位置 | https://x.com/iLiFE_STAFF/status/2116530730633515138 ；https://x.com/iLiFE_official/status/2116528186276372746 ；https://x.com/iLiFE_STAFF/status/2116718380137021901 |
| 853 | 写入 11/1 歌单。备注补夜场海盗感谢、合作兔耳合影、主办方拍照区、白天远景、第 2 首可拍摄 | https://x.com/iLiFE_STAFF/status/2116907365933170757 ；https://x.com/iLiFE_official/status/2116889696349602273 ；https://x.com/iLiFE_official/status/2116833162743689697 ；https://x.com/IDOLHJ_official/status/2116870593605968037 ；https://x.com/IDOLHJ_official/status/2116801059310178480 ；https://x.com/iLiFE_STAFF/status/2116825798355419628 |

852 歌单（工作人员原文，SE 保留，📸 留在 i REVOLUTION）：SE、会いにKiTE!、サイクロンライフ！、きゃわぽっぴんどぅー、sweet timer、アイドルライフブースターパック、i REVOLUTION 📸🉑、ガンバッテンダー、アイドルライフメガパック、メッセージ。

853 歌单：SE、初恋リバイバル、#ラブコード 📸🉑、BRAVE GROOVE、アイドルライフエクストラパック、LOML、サイクロンライフ！、i REVOLUTION、LiMiT STRiKER!、アイドルライフメガパック。开演前帖写撮影可能曲是第 2 首；不计 SE 时第 2 首就是 #ラブコード。

## 歌曲

| 歌 | 改动 | 打开过的依据 |
| --- | --- | --- |
| 44 i REVOLUTION | 新增官方 `kind=MV`，`video_id=-IOtOZJutdk`，上传日 2026-10-31，缩略图 `maxresdefault`（HTTP 200）。`mv_date` 改为 2026-10-31。`release_date` 仍是 2026-08-26。两条粉丝影像保留 | https://www.youtube.com/watch?v=-IOtOZJutdk （页内「2026/10/31に公開済み」，oEmbed 标题与频道 @iLiFE_official）；https://x.com/iLiFE_official/status/2116379742752620866 |

频道扫描 94 条，比 053 的 93 条多这一支 MV。其余未入库的仍是试镜、SE、甘音ゆあ翻唱、巡演花絮（标题里的「LIVE映像」是 making，不是曲名影像）。

没有新的时期公式アー写。首页英雄图仍按「当前时期、category=official、正文含アー写」选取，本窗口的万圣节合影和 MV 静帧不会换上。

## 图片

全部从 `?name=orig` 转成 webp，长边 ≤2048，没有裁切，单张 ≤1MB。分类按任务 039：九人台阶/海盗合影是 `costume` + `group`，舞台与主办方演后是 `live`，MV 告知是 `official`。会场远景不设 `kind=group`，避免进时期页团体区。しなこ合作合影中间是嘉宾，也不设 `kind=group`。

| 文件 | 宽×高 | 字节 | md5 | 帖 | 入库后 |
| --- | --- | ---: | --- | --- | --- |
| `group-e12-HV9rKa6bEAAdTkv.webp` | 2048×1365 | 863310 | `55daaea7e52b9480b45df5f21eea7e60` | https://x.com/iLiFE_official/status/2116528186276372746 | キョンシー九人，挂 852，不作封面 |
| `live-852-HV9rKbFacAA--g1.webp` | 2048×1365 | 425528 | `7a5305f2160fd714c13b31af86e238ee` | 同上 | 舞台背影，入库后作 852 封面 |
| `live-852-HV9rKbEbcAACEO3.webp` | 2048×1365 | 233424 | `ffdba6dcd80e7a3c73520e3e1e7468d8` | 同上 | 会场远景，挂 852 |
| `live-852-HV9rKbIa0AAt5et.webp` | 2048×1365 | 225370 | `634b10e598aee920ff7f9cfbcca036f0` | 同上 | 会场远景，挂 852 |
| `group-e12-HWCz89waAAAHrIw.webp` | 2048×1365 | 389644 | `bb61ed6924b819d03922ee94179a3444` | https://x.com/iLiFE_official/status/2116889696349602273 | 海盗九人，挂 853，不作封面 |
| `live-853-HWCz892aAAAXxHx.webp` | 2048×1365 | 672652 | `b0f77c96aa5e7b72491ad1b68cb64f98` | 同上 | 焰火舞台，入库后作 853 封面 |
| `live-853-HWCz89ybcAEGA-Q.webp` | 2048×1365 | 296998 | `c8e80dafa051b558a8ef9d52fef169cb` | 同上 | 会场远景，挂 853 |
| `live-853-HWCAhYebMAAMHI2.webp` | 2048×1365 | 649472 | `ac80e35003554b028ab74b7d6991d0e2` | https://x.com/iLiFE_official/status/2116833162743689697 | しなこ合作，兔耳，挂 853，不设团体 |
| `live-853-HWCilDraUAAZbHg.webp` | 1080×604 | 214882 | `81b149a276e66454fe8f36dab6560990` | https://x.com/IDOLHJ_official/status/2116870593605968037 | DAY3 拍照区九人，挂 853，不作封面 |
| `live-853-HWBiOcAbYAAIkx4.webp` | 2048×1366 | 368896 | `e86f3fcefed78f9acc28fee1e38cd3b2` | https://x.com/IDOLHJ_official/status/2116801059310178480 | 白天会场远景，画面认不出成员，挂 853 |
| `official-HV7kJtDaEAALkGM.webp` | 2048×1152 | 200544 | `68a1d467125e8c0531e8d9a31c19250d` | https://x.com/iLiFE_official/status/2116379742752620866 | MV 公开帖，正文有「i REVOLUTION」，入库后挂歌曲 44 |
| `official-HV8pKDsaMAAhr7J.webp` | 2048×1152 | 189518 | `0ed95bb1cb487e5587297a3e675d651e` | https://x.com/iLiFE_official/status/2116455610179047864 | 18:30 プレミア帖，同样挂歌曲 44 |
| `official-HV9MAeracAAE1M0.webp` | 2048×1365 | 374326 | `6ce1e3f2ac8e228e936494fabec5e534` | https://x.com/iLiFE_official/status/2116493946528596203 | 与 Fear, and Loathing in Las Vegas 的合影。曲名没有写在「」里，只入库、不挂歌曲、不挂万圣节场 |

## 故意不收

- https://x.com/iLiFE_official/status/2116783165109055544 与 https://x.com/IDOLHJ_official/status/2116870356028063992 、https://x.com/IDOLHJ_official/status/2116503928175231096 是现场视频，预览是视频帧，不是静图，也不是 YouTube 曲名影像。
- https://x.com/IDOLHJ_official/status/2116508545525153793 两张都是三个团体拼贴。一张底部才是 iLiFE! 的キョンシー，上两排是别的团体；另一张是 VAMPIRE STAGE，没有 iLiFE!。不入库。
- https://x.com/iLiFE_STAFF/status/2116519079469257069 是福丸うさ FC 博客更新，图是模糊预览，不是衣装或演后静图。
- https://x.com/heroines_idol/status/2116909891919200479 是主办方对整场万圣节的感谢，没有新时间、没有 iLiFE! 专属静图。同账号窗口里的新アー写是 chuLa、AdamLilith，不是 iLiFE!。
- @HEROINES_FES 本窗口没有新媒体帖。
- 10/31 00:00 的 Happy Halloween 九人合影（`2116183379720978561`）已在 053 入库，没有重复下载。

## 页面

导出的 `data/lives.json` 里 852 有 14 张图，封面是 `live-852-HV9rKbFacAA--g1.webp`；853 有 17 张图，封面是 `live-853-HWCz892aAAAXxHx.webp`。新图在 `data/images.json`（id 4646–4658）。歌曲 44 相关图片 1→3（配信 jacket 之外加上两张引号点名「i REVOLUTION」的 MV 告知图）。公开地址前缀 `https://img.ilifefan.dpdns.org/img/`。
