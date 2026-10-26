# 039 结果

分支：`cursor/039-special-costume-images-2975`（只推了这个分支，没有合并 main，没有部署，没有 force push）

提交：`b4aac05` 收录数据、清单、导出与任务说明。本文件补上该提交号。

导出检查：`python3 db/export.py --check` 通过。版本 `29319ec6`。新图 11 张在 R2 桶 `ilife-images`，已写入 `db/r2_manifest.json`。公开地址 `https://img.ilifefan.dpdns.org/` 抽查 7 张，HTTP 200，字节数与 md5 与清单一致。本地打开时期页：e12 团体公式图 21 张、个人公式图 92 张；e5 团体 14 张、个人 95 张；e8 团体 12 张。抽看的图 `naturalWidth` 不为 0。桌面宽约 1280、手机宽 390 都能排出格子。

改动脚本：`db/task039_special_photos.py`（可重复跑：已有 `local` 或已有 `kind` 会跳过）。

## 新入库（11）

日期是 JST。长边 2048，没有裁切。`source` 为 `X @iLiFE_official`。

| id | 键 | 日期 | kind | category | 成员 | 帖 |
|---|---|---|---|---|---|---|
| 4585 | `img/group-e12-HVHqN6eboAAHJ6y.webp` | 2026-10-21 | group | costume | — | https://x.com/iLiFE_official/status/2112727241683849571 |
| 4586 | `img/group-e12-HVHouunbAAAdeJu.webp` | 2026-10-21 | group | costume | — | https://x.com/iLiFE_official/status/2112725602902155435 |
| 4587 | `img/group-e12-HVKC69DbYAE7G6-.webp` | 2026-10-21 | group | costume | — | https://x.com/iLiFE_official/status/2112895135608717507 |
| 4588 | `img/group-e12-HU6lDWZbkAAST_1.webp` | 2026-10-18 | group | costume | — | https://x.com/iLiFE_official/status/2111806811527647317 |
| 4589 | `img/group-e12-HVZ7YhNbsAA-sjD.webp` | 2026-10-25 | group | live | — | https://x.com/iLiFE_official/status/2114012796753268900 |
| 4590 | `img/member-2-HVUTBnfbEAAQW3Q.webp` | 2026-10-23 | individual | costume | あいす | https://x.com/iLiFE_official/status/2113616527383736516 |
| 4591 | `img/member-2-HVUTBnea4AAmxOo.webp` | 2026-10-23 | individual | costume | あいす | 同上 |
| 4592 | `img/member-3-HVZBwFTbAAAZrpf.webp` | 2026-10-24 | individual | costume | 福丸うさ | https://x.com/iLiFE_official/status/2113949399353295303 |
| 4593 | `img/member-3-HVZBwFObMAAMS--.webp` | 2026-10-24 | individual | costume | 福丸うさ | 同上 |
| 4594 | `img/member-4-HVeNCNkbcAAfPkb.webp` | 2026-10-25 | individual | costume | 若葉のあ | https://x.com/iLiFE_official/status/2114313630619709879 |
| 4595 | `img/member-4-HVeNCNtbYAAZIdC.webp` | 2026-10-25 | individual | costume | 若葉のあ | 同上 |

4585 与 4586 是同一条文案的两条帖。缩略图对照过，站位和手的位置不同，所以两条都留。4585、4587 是任务要求必须入库的两张海盗九人合照。4588 文案写「みゅう初のパレード衣装」，画面是全员游行衣装，标 `costume`。4589 是 Venue101 感谢，全员一张，标 `live`。

出处 id：4447–4454。

## 已有图改标成团体图

`kind` 原来为空，没有挂成员。时期按日期对应，没有改 `image_eras`。同一文件只标 id 较小的一行。

`category=costume` `kind=group`：

- e5：635、636、637、685、702（2022 ウマ娘 / 学園 / 万圣节 / TAXI 全员）
- e7：1341、1342、1343、1344、1345、1893、1994、2048（2023 万圣节与 2024 夏前特别衣装）
- e8：2130、2131、2208、2215、2255、2256
- e9：2594
- e10：2724、2806、2818、2885（含 2025 浴衣合照）
- e11：2932、3003、3056、3078、3079、3173、3445
- e12：3747、3772（夏フェス衣装）、3774（NEOLiFE!特別衣装）、3859（浴衣）

`category=live` `kind=group`：3689（2026-06-30 TRAVELiFE! Zepp 感谢，一张）

任务单点名、且 id 在当前 main 上核对过的：685→e5，1344→e7，2208 与 2215→e8，3003 与 3056→e11，3772、3774、3859→e12。

## 已有单人衣装

两类，都不改原来的 `review_note`：

1. 已经是 `kind=individual`、已确认、`category=other` 的 87 张，只把分类改成 `costume`。这样时期页的「文本仅提及」过滤才会放行（过滤要求 `review=confirmed` 且分类是 `official` 或 `costume`）。id：645、646、657–660、665–668、670–676、687–690、696、697、1346、1347、1353、1354、2158、2159、2161、2162、2164、2165、2167、2168、2170、2171、2176、2177、2179、2180、2183、2184、2187、2188、2190–2195、2196–2198、2199–2201、2205–2207、2209–2211、2218–2220、2224–2226、3025–3032、3038–3041、3045–3048、3051、3052。
2. `kind` 为空、库里已经只挂了一名成员的 42 张，标成 `individual` + 日期时期 + `costume`。缩略图看过，都是单人衣装。时期页要 `review=confirmed` 才显示，所以补了确认说明「官方文案只点名这一名成员，画面是单人衣装」。id：611、612、616–621、625–632、692–695、698–701、1293、1294、1299、1300、1301–1304、1314、1315、1319、1320、1324–1327、1329、1330。1299、1300 是 2023 南瓜主题，文案写全日文名 日日にこり；同文件的 1297、1298 只写昵称「にこり」，没有再标，避免同一张图出现两次。

## 跳过

- 2203、2204：2024-10-29 护士主题，两个人，不是全员。
- 2213：万圣节感谢，文案是「どっちが好き」，两个人。
- 571 以及同系列 iLiFE×FAMILY：不是全员公式合照。
- 2933：与 2932 同一文件 `img/G0zk0yvaUAIcM2Y.jpg`，只标 2932。
- 2727、2728：同一文件，分类仍是 other，文案不是特别衣装标题，未标。
- 3608：みゅうお披露目感谢，不是衣装静图。
- 3619、3620：集合チェキ赠送告知，同一文件，保持 `official`、`kind` 为空。
- 3839–3842：MEGALiFE! 感谢四张。038 已收 Instagram `Dc-0AffFLDF` 的全员舞台合照，这里不再把感谢帖成批标进时期页。
- 170：早安提到女仆服，不是衣装静图。664：FIRST TAKE 企划图。691：文案是「大門兄弟 / ゆあ&あいす」，虽然只挂了あいす，仍是双人。3695–3697：夏フェスグッズ贩卖图。
- 229、392、1279、3055 以及带「ランチェキ」「出演いたします」「タイムテーブル」的特别衣装告知：是贩卖或公演预告，不是这次要补的衣装静图。
- 3920：文案只写昵称「みゅう」做 Malymoon 模特，没有全日文名，未新挂成员。
- 2026 万圣节单人：打开到的官方帖是あいす（10-23）、福丸うさ（10-24）、若葉のあ（10-25）。心花りり、空詩かれん、虹羽みに、純嶺みき、小熊まむ、真守みゅう 这次没有打开到对应的官方单人帖，没有编状态 ID。
- 夏フェス衣装、NEOLiFE!特別衣装：库内官方帖是全员合照（3772、3774），没有已挂成员的单人切图。2025 / 2026 浴衣单人里，已经是 `costume` + `individual` 的没有再改。

## 页面

时期页团体区用 `kind=group` 且 `era` 等于该时期。个人区还要求通过「官方推文文本仅提及该成员」的确认条件。图库「打歌服/衣装」按 `category=costume` 筛选。
