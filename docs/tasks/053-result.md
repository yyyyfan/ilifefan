# 053 结果

分支：`cursor/053-recent-media-update-e7b2`（只推这个分支，没有合并 main，没有部署，没有 force push）

`python3 db/export.py --check` 通过。导出版本 `0685780f`。公演 872→873。图片 4500→4536（新增 36）。36 张已由本机上传到 R2 桶 `ilife-images`，记入 `db/r2_manifest.json`。公开地址抽查 4 张（`live-856-HVoRGPuaAAAUhl3`、`live-872-HVPLxcNaMAEaWns`、`member-5-HVoyc_Ja0AAmDZr`、`group-e12-HV4xj_9bkAApTfC`）为 HTTP 200、`image/webp`，字节数与 md5 与清单一致。前缀 `https://img.ilifefan.dpdns.org/img/`。

脚本：`db/task053_apply.py`。公演备注是定稿，重复跑会写成同一段。图片只在清单里已经有对应键时才入库。`task028_live_members.py` 重算后，相对 main 只多了 872 的 9 名现役成员，没有改其他场的出演状态。23、24 的あいす仍是「出演」（公告只休息特典会）。

## 公演

| 场次 | 改动 | 打开过的依据 |
| --- | --- | --- |
| 856 | 标题 `iLiVE! TOUR SAPPORO`；开场 13:00、开演 14:00；主出处改为札幌时间表帖。图上 iLiFE! 为 19:10、特典会终演后 | https://x.com/iLiFE_official/status/2115021795971432782 ；https://t-dv.com/ilive-261116 |
| 23 | 备注：あいす只休息特典会；10/27 新作バニー；主办方 DAY1 感谢 | https://x.com/iLiFE_official/status/2114726742619459683 ；https://x.com/iLiFE_official/status/2114703934472556591 ；https://x.com/HEROINES_FES/status/2115051197094834265 |
| 24 | 备注：同一则あいす公告；10/28 为 2025 年トランプ衣装；主办方 DAY2 感谢 | 同上衣装帖；https://x.com/HEROINES_FES/status/2115414315402752442 |
| 852 | 开场 10:00、开演 11:00。iLiFE! PUMPKIN STAGE 19:35–20:10；キョンシー衣装；前特典会 17:00–18:00 | https://x.com/iLiFE_official/status/2114706138067542338 ；https://x.com/iLiFE_STAFF/status/2115413983310356649 ；https://x.com/iLiFE_STAFF/status/2115734045342707806 |
| 853 | 开场 10:00、开演 11:00。iLiFE! 19:20–19:55；订正后为海盗衣装；しなこ 13:35–13:55 合作，不另建场；前特典会 17:10–18:10 | 同上时间表；https://x.com/iLiFE_official/status/2116101817176367411 |
| 867 | 备注确认 11/14 リミスタ线上签名与宾果（每回 300 人）。图上没有开始时刻，`start_time` 仍空 | https://x.com/iLiFE_official/status/2116103182489399418 |
| 868 | 开演 14:00（同一张图写 11/17 14:00〜、アリオ札幌） | 同上 |
| 872 新 | `YANFES 2026`，2026-11-18，豊洲PIT，フェス，开场 10:30、开演 11:00。现役 9 人出演 | https://x.com/iLiFE_official/status/2113256707573088402 ；https://t-dv.com/YANFES-261118 |

裏会场已打开 https://t-dv.com/YANFES_ura-261118 ：标题「YANFES 2026 -裏-」，duo MUSIC EXCHANGE，出演名单没有 iLiFE!，开场开演页面上是 0:00。不建场。主办方双会场帖 https://x.com/heroines_idol/status/2113256751164522638 只作备注，那张双会场海报没有入库，避免把没有 iLiFE! 的半张当成这场的图。

856 的封面是札幌时间表 `img/live-856-HVoRGPuaAAAUhl3.webp`。872 的封面是丰洲告知图 `img/live-872-HVPLxcNaMAEaWns.webp`。23、24 的封面换成主办方演后感谢（`category=live`）。852、853 原告知图封面未换。

## 图片

官方媒体时间线从 2026-10-12 拉到 2026-10-31 00:00 JST（46 条，最旧一条已早于 10/20）。下面「已在库」是 main 上就能对上帖号的，没有重复下载。新图全部从 `?name=orig` 转成 webp，长边 ≤2048，没有裁切。单人帖各 2 张，都看过文案只点一名成员；空詩かれん那张近景也看过，是单人。

### 已在库，未再下载

| 帖 | JST | 内容 |
| --- | --- | --- |
| https://x.com/iLiFE_official/status/2112727241683849571 | 10-21 | 海盗九人合照 |
| https://x.com/iLiFE_official/status/2112895135608717507 | 10-21 | 海盗九人合照 |
| https://x.com/iLiFE_official/status/2113616527383736516 | 10-23 | あいす单人 |
| https://x.com/iLiFE_official/status/2113949399353295303 | 10-24 | 福丸うさ单人 |
| https://x.com/iLiFE_official/status/2114012796753268900 | 10-25 | Venue101 感谢，已是 `live` / `group` |
| https://x.com/iLiFE_official/status/2114313630619709879 | 10-25 | 若葉のあ单人 |
| https://x.com/iLiFE_official/status/2114658662820294785 | 10-26 | 純嶺みき单人 |

### 已转码、待上传（36）

分类按任务 039：单人衣装 `costume` + `individual`，全员静图 `costume` + `group`，舞台或主办方演后 `live` + `group`，时间表和告知 `official` 且不进时期页。`db/task053_apply.py` 里的 `CLS` 是入库规则。文件在 `img/<文件名>`，不进 Git。

| 文件 | 字节 | md5 | 帖 |
| --- | ---: | --- | --- |
| `member-5-HVoyc_Ja0AAmDZr.webp` | 434124 | `05db468f32375f458dd857ef95f65316` | https://x.com/iLiFE_official/status/2115058461163815095 |
| `member-5-HVoyc9xbEAAE68b.webp` | 572926 | `296d6486004e46b2626231d07d69e445` | 同上，空詩かれん |
| `member-8-HVuAU1obwAA-dTz.webp` | 347702 | `8a4842b913f7c7de64769e4d4d1f9186` | https://x.com/iLiFE_official/status/2115425553998311855 |
| `member-8-HVuAU11aAAA2rFC.webp` | 520344 | `485e687307abe51b6118988472b8c8df` | 同上，小熊まむ |
| `member-6-HVy8iFtacAAtnC2.webp` | 473364 | `662a1a865340fab1db9ab45f8552806c` | https://x.com/iLiFE_official/status/2115773246910157203 |
| `member-6-HVy8iFcbMAAmkKA.webp` | 521982 | `358326a743d5a5ae1fc3be9be0634bf8` | 同上，虹羽みに |
| `member-9-HV3DwQxaoAAd4jQ.webp` | 405730 | `5b55c6d49067b60bc9feefe15d5e67e2` | https://x.com/iLiFE_official/status/2116062653093454229 |
| `member-9-HV3DwQia4AEbpp-.webp` | 527200 | `b7392b5bbd231b0e9345e5763058d311` | 同上，真守みゅう |
| `member-1-HV39CBTbwAEL1kp.webp` | 357386 | `24186c4648b4f0b350d93c1cba678357` | https://x.com/iLiFE_official/status/2116125626159755274 |
| `member-1-HV39CBVagAABAZk.webp` | 537854 | `4c4679439b96d3bd795162c48bb62491` | 同上，心花りり |
| `group-e12-HVo46xaaAAAWtgQ.webp` | 457002 | `2729eda3dfd3383f3f113e5f0b398e9c` | https://x.com/iLiFE_official/status/2115065570148384948 バニー九人 |
| `live-23-HVo46xxbsAAJHJM.webp` | 235664 | `f5b1f0101503e67e84fff5189200e6d4` | 同上第二张，舞台。正文没写场名；日程把 10/27 标成バニー，挂 23，不设封面 |
| `group-e12-HVuF5mUa8AE7aAy.webp` | 553690 | `5ef3cda50daee31d0fccd8bffc5531b0` | https://x.com/iLiFE_official/status/2115431727711805785 トランプ九人 |
| `live-24-HVuF5mWa0AA_0gZ.webp` | 384892 | `39ef075d83e68cbcdcf2f49fe761714d` | 同上第二张，舞台有 HEROINES 与南瓜，挂 24 |
| `group-e12-HVj5_RNboAAWpF7.webp` | 409002 | `35f0daa3a2ec620834f30b6f753ecafb` | https://x.com/iLiFE_official/status/2114714902657155420 女仆风九人，不挂场 |
| `group-e12-HV4xj_9bkAApTfC.webp` | 738840 | `9cb6ad81a7f5a96f472958db42144424` | https://x.com/iLiFE_official/status/2116183379720978561 Happy Halloween 九人 |
| `live-23-HVor1P9aoAAfOTh.webp` | 501048 | `a0723dd71a9f7bbf50d1b76e82c1678d` | https://x.com/HEROINES_FES/status/2115051197094834265 DAY1 感谢，画面标 iLiFE!。入库后作 23 的封面 |
| `live-24-HVt2GDRbYAA5-Y-.webp` | 483682 | `34df7f79ceb977af9a7a3698178b6ae3` | https://x.com/HEROINES_FES/status/2115414315402752442 DAY2 感谢。入库后作 24 的封面 |
| `live-856-HVoRGPuaAAAUhl3.webp` | 741860 | `818fdd09c43f5a7d2c7f803a50bc2c78` | 札幌时间表。入库后作 856 的封面 |
| `live-856-HVIrkHYagAEzTDx.webp` | 611022 | `3e0f3f5b891e873d922a13273733702b` | https://x.com/iLiFE_official/status/2112799086168649943 北海道出演者发表直播告知，挂 856，不作封面 |
| `live-872-HVPLxcNaMAEaWns.webp` | 471308 | `ba4f7b03249632c44120a4d7732bd029` | YANFES 丰洲告知图。入库后作 872 的封面 |
| `official-HVdlI2Na8AAaqq6.webp` | 440214 | `a390c59029430e627e128dcdbc1ed242` | https://x.com/iLiFE_official/status/2114269760888393768 巡演物贩。不挂场，避免变成福冈 / 大阪尚无封面场次的卡片图 |
| `official-HVi1lIFbEAA9qLM.webp` | 670120 | `9d7c812af9dfbf9cc2358389e8f45e17` | https://x.com/iLiFE_official/status/2114639685347930522 衣装日程初版。11/1 写成バニー第二回 |
| `official-HVjwAoQaEAA9St2.webp` | 680328 | `985886737be1675c2fb0e3a47478978d` | https://x.com/iLiFE_official/status/2114703934472556591 订正版。11/1 改为 iLiVE! 着用海盗衣装 |
| `live-852-HVjyA4waMAEzciW.webp` | 538444 | `152fde9848cbd79b520326344d557b56` | https://x.com/iLiFE_official/status/2114706138067542338 DAY2 时间表 |
| `live-853-HVjyA4ybUAA8y0M.webp` | 548724 | `ba685857758013a4eec8407363aeb204` | 同帖 DAY3 时间表 |
| `live-852-HVjyA4wbQAAveFN.webp` | 393920 | `dc377490d75cfda93d615dc82273a9dd` | 同帖ヒロインズくじ，挂 852 与 853 |
| `live-852-HVjyA4zaYAAGx23.webp` | 264784 | `b7d99d89d7e00185b6f60ca633300f0d` | 同帖会场地图，挂 852 与 853 |
| `live-853-HV3nYi4aQAA40iU.webp` | 467574 | `d8766e809a89e2cf1c3d67dfe53158ad` | https://x.com/iLiFE_official/status/2116101817176367411 しなこ合作 |
| `live-867-HV3onxNbMAA30Cv.webp` | 875996 | `12b030a05b0d44a20f5952379aaf2039` | https://x.com/iLiFE_official/status/2116103182489399418 发售活动第二弹，挂 852、853、867、868 |
| `live-852-HVyY5gLbIAALGGd.webp` | 339740 | `b877ac1857f8d221651a75c71064e535` | https://x.com/iLiFE_STAFF/status/2115734045342707806 DAY2 特典会时间表 |
| `live-853-HVyY5gIawAAToL5.webp` | 319758 | `fd510dbc6f0da9913b22c5ad29e2fa4d` | 同帖 DAY3 特典会时间表 |
| `live-852-HVt1nLybQAEwxQS.webp` | 488522 | `925f982e5f8cf8fc02e2db6da2360cf7` | https://x.com/iLiFE_STAFF/status/2115413983310356649 两日物贩清单，挂 852 与 853 |
| `official-HVyr8dDboAANxYh.webp` | 325882 | `c807736bc5792822fa30e8ae22189ca5` | https://x.com/heroines_idol/status/2115760570104209779 DAY1 ブース图，没有 iLiFE!，只入库不挂场 |
| `live-852-HVyr8dCbcAArpKn.webp` | 341454 | `aea32cff16bef298dda4e5448399b2a2` | 同帖 DAY2。时间不变，左侧标 27〜30 |
| `live-853-HVyr8ctbQAADiaf.webp` | 312508 | `1982e4c793e3ff3b47bdfcaf2c535b61` | 同帖 DAY3 |

上传（在仓库根目录，文件还在 `img/` 时）：

```bash
npx wrangler r2 object put ilife-images/img/member-5-HVoyc_Ja0AAmDZr.webp --file "img/member-5-HVoyc_Ja0AAmDZr.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/member-5-HVoyc9xbEAAE68b.webp --file "img/member-5-HVoyc9xbEAAE68b.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/member-8-HVuAU1obwAA-dTz.webp --file "img/member-8-HVuAU1obwAA-dTz.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/member-8-HVuAU11aAAA2rFC.webp --file "img/member-8-HVuAU11aAAA2rFC.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/member-6-HVy8iFtacAAtnC2.webp --file "img/member-6-HVy8iFtacAAtnC2.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/member-6-HVy8iFcbMAAmkKA.webp --file "img/member-6-HVy8iFcbMAAmkKA.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/member-9-HV3DwQxaoAAd4jQ.webp --file "img/member-9-HV3DwQxaoAAd4jQ.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/member-9-HV3DwQia4AEbpp-.webp --file "img/member-9-HV3DwQia4AEbpp-.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/member-1-HV39CBTbwAEL1kp.webp --file "img/member-1-HV39CBTbwAEL1kp.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/member-1-HV39CBVagAABAZk.webp --file "img/member-1-HV39CBVagAABAZk.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/group-e12-HVo46xaaAAAWtgQ.webp --file "img/group-e12-HVo46xaaAAAWtgQ.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/group-e12-HVuF5mUa8AE7aAy.webp --file "img/group-e12-HVuF5mUa8AE7aAy.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/group-e12-HVj5_RNboAAWpF7.webp --file "img/group-e12-HVj5_RNboAAWpF7.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/group-e12-HV4xj_9bkAApTfC.webp --file "img/group-e12-HV4xj_9bkAApTfC.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-23-HVo46xxbsAAJHJM.webp --file "img/live-23-HVo46xxbsAAJHJM.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-23-HVor1P9aoAAfOTh.webp --file "img/live-23-HVor1P9aoAAfOTh.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-24-HVuF5mWa0AA_0gZ.webp --file "img/live-24-HVuF5mWa0AA_0gZ.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-24-HVt2GDRbYAA5-Y-.webp --file "img/live-24-HVt2GDRbYAA5-Y-.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-856-HVoRGPuaAAAUhl3.webp --file "img/live-856-HVoRGPuaAAAUhl3.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-856-HVIrkHYagAEzTDx.webp --file "img/live-856-HVIrkHYagAEzTDx.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-872-HVPLxcNaMAEaWns.webp --file "img/live-872-HVPLxcNaMAEaWns.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/official-HVdlI2Na8AAaqq6.webp --file "img/official-HVdlI2Na8AAaqq6.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/official-HVi1lIFbEAA9qLM.webp --file "img/official-HVi1lIFbEAA9qLM.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/official-HVjwAoQaEAA9St2.webp --file "img/official-HVjwAoQaEAA9St2.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-852-HVjyA4waMAEzciW.webp --file "img/live-852-HVjyA4waMAEzciW.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-853-HVjyA4ybUAA8y0M.webp --file "img/live-853-HVjyA4ybUAA8y0M.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-852-HVjyA4wbQAAveFN.webp --file "img/live-852-HVjyA4wbQAAveFN.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-852-HVjyA4zaYAAGx23.webp --file "img/live-852-HVjyA4zaYAAGx23.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-853-HV3nYi4aQAA40iU.webp --file "img/live-853-HV3nYi4aQAA40iU.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-867-HV3onxNbMAA30Cv.webp --file "img/live-867-HV3onxNbMAA30Cv.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-852-HVyY5gLbIAALGGd.webp --file "img/live-852-HVyY5gLbIAALGGd.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-853-HVyY5gIawAAToL5.webp --file "img/live-853-HVyY5gIawAAToL5.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-852-HVt1nLybQAEwxQS.webp --file "img/live-852-HVt1nLybQAEwxQS.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/official-HVyr8dDboAANxYh.webp --file "img/official-HVyr8dDboAANxYh.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-852-HVyr8dCbcAArpKn.webp --file "img/live-852-HVyr8dCbcAArpKn.webp" --content-type image/webp --remote
npx wrangler r2 object put ilife-images/img/live-853-HVyr8ctbQAADiaf.webp --file "img/live-853-HVyr8ctbQAADiaf.webp" --content-type image/webp --remote
python3 db/r2_images.py add img/*.webp
python3 db/r2_images.py verify img/member-5-HVoyc_Ja0AAmDZr.webp img/group-e12-HV4xj_9bkAApTfC.webp img/live-856-HVoRGPuaAAAUhl3.webp
python3 db/task053_apply.py
python3 db/export.py --rebuild-derived
```

上传已完成（本机逐个 `wrangler r2 object put`，不是通配符）。随后按上表文件名逐个 `python3 db/r2_images.py add`，没有扫到 `stage-` / `org-` 临时文件。`python3 db/task053_apply.py` 写入 36 行。公开核对 4 张，0 个问题。

## 故意不收

- https://x.com/iLiFE_official/status/2115046653040439346 文化放送广播预告。只有 43 秒视频，预览是三人坐着的视频帧，不是海报，也不是歌曲影像。
- https://x.com/iLiFE_official/status/2113926004544835816 Venue101 播出前视频。预览是视频帧。同场感谢静图已在库（帖 https://x.com/iLiFE_official/status/2114012796753268900 ）。
- DAY1 感谢帖里的另一张是ガガピエロ（`HVor1P0a0AAAGxH`），不是 iLiFE!。
- 工作人员 FC 博客更新（2115809828576899156、2114975860243722294、2113966343695573356）是博客截图，不是衣装或演后静图。
- @HEROINES_FES 上其他团体的感谢图和单曲视频。iLiFE! 当天的 X 视频（DAY2「君がジョーカーです」、DAY1 的登场视频）没有静图，不编 YouTube 链接。
- 850（10/21 豊洲）、851（10/26 东京）在官方号和主办方时间线里没有演后静图。852、853 截至时间线最新一条（10/31 00:00）还没有演后帖。
- 官方 YouTube @ilife_official 抓到 93 条，和任务 026 时的条数相同。最新曲名影像（きゃわぽっぴんどぅー、アイドルライフメガパック等）已在 `song_videos`。不在表里的 19 条是新成员试镜、开场 SE、甘音ゆあ翻唱 Ado、巡演花絮，标题对不上曲库，不写入。没有放进 `db/curation/videos.json`。

## 页面

导出的 `data/lives.json` 里 856、852、853、868、872 的标题和时间与上表一致。856 有 2 张图，封面是时间表；872 有 1 张图，封面是告知图。新图在 `data/images.json`（id 4610–4645）：衣装单人 10、衣装全员 4、演后/舞台 4、告知 18。公开地址前缀 `https://img.ilifefan.dpdns.org/img/`。
