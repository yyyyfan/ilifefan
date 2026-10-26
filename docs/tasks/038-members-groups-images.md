# 038 补全团体公式图与成员（含历史）个人图（X / Instagram / TikTok）

执行者：本次按用户 2026-10-26 指示，由 cloud agent 在既定分支实现（不使用 Antigravity）  
分支：`agy/038-members-groups-images`（只推送这个分支，不推 main，不部署；见 `AGENTS.md`）

## 目标

把**各时期团体公式图**和**全体成员（现役 + 前成员/支援）个人公式图**补齐，并首次把 **Instagram / TikTok 官方账号**上的官方静图纳入图库。做完后：

- 时期页（`eras.html`）每个时期都有「团体公式图」；缺口时期不再是「未找到」
- 成员页卡片与详情能用到足够的 `kind=individual` 图（尤其初期毕业生与支援成员）
- 每张新图进 R2 + `r2_manifest.json` + `images` / `image_members` / `image_eras`，有可打开的出处

## 现状（main，`db/ilife.sqlite` 实测）

| 维度 | 数量 |
|---|---|
| 成员 | **26**（现役正式 9 + 前成员/支援 17） |
| `kind=group` 团体公式图 | **57**（全部来自 X；**0** Instagram/TikTok） |
| `kind=individual` 个人公式图 | **785**（约 730 X + 55 官网 Wayback；**0** IG/TikTok） |
| `sources` 中含 instagram / tiktok | **0 / 0** |

按时期的团体图缺口（`images.kind='group'`）：

| 时期 | 团体图 | 个人图（该时期） |
|---|---|---|
| e1 结成期 | 3 | 6 |
| e2 Brand new LiFE! | **0** | 10 |
| e3 四人期 | **0** | 0 |
| e4 START with YOU | 3 | 28 |
| e5 あいす加入期 | 9 | 71 |
| e6 过渡期（響羽リズ） | **0** | 36 |
| e7 九人新体制 | 7 | 193 |
| e8 ENDLESS LiFE! | 6 | 74 |
| e9 空詩かれん加入期 | 9 | 79 |
| e10 武道馆期 | **0** | 53 |
| e11 LiFESTART | 12 | 95 |
| e12 真守みゅう加入 | 8 | 66 |

个人图偏少（`kind=individual` &lt; 15）的成员（优先补）：

| 成员 | 状态 | individual | 备注 |
|---|---|---|---|
| 心咲めい | 前 | 1 | X 账号已不存在 |
| 双葉りつ | 前 | 2 | X 已冻结 |
| 桜餅ふゆ | 前 | 3 | X 已不存在 |
| 琥珀しえる | 前 | 5 | 推文已清空 |
| 真守みゅう | 现役 | 7 | 新加入，可继续补 |
| 響羽リズ | 前（支援） | 7 | X 仍有效 |
| 恋春ねね | 前（副支援） | 10 | 库内无个人 X |
| 恋星はるか | 前（支援） | 11 | X 仍有效 |

说明：本库**没有「姐妹团」实体表**。「团体」在本站 = iLiFE! 的 `kind=group` 公式合照（时期页「团体公式图」、首页最新公式图），不是 i-COL / GILTY×GILTY 等兼任团体的独立图库。

## 范围

### 要做

1. **团体公式图（`kind=group`）**  
   - 优先补 e2 / e3 / e6 / e10（现为 0）。  
   - 其余时期若官方有该体制新アー写 / 体制公开合照且库内未收，一并补入。  
   - 判定：帖文明确是团体アーティスト写真 / 新体制アー写 / 全员公式合照；写 `images.era`，并保证 `image_eras` 与日期一致（必要时 `export.py --rebuild-derived` 或现有 `--fix-eras` 类工具）。

2. **成员个人公式图（`kind=individual`）**  
   - **全体 26 人**，含已毕业、支援、副支援。  
   - 优先：上表缺口成员；其次现役中图较少者（真守みゅう、小熊まむ、純嶺みき、虹羽みに等）。  
   - 写入 `image_members`；`kind=individual`；能从官方文案认定本人时关联成员。  
   - 成员页卡片用的是「最近一张 individual」（`latestPhoto`），补新图会自动改善卡片。

3. **平台（必须实际打开帖/页再入库）**  
   - X：`@iLiFE_official`、成员个人 X（`members.x` 且 `x_status=有效`；已失效账号不要猜新 ID）。  
   - Instagram：团体官方 `@ilife.idol`（https://www.instagram.com/ilife.idol/）；成员个人 IG **仅当**从官网、官方 X 简介/置顶、或官方 YouTube About 链出可核验时使用。  
   - TikTok：团体官方 `@ilife_official`（https://www.tiktok.com/@ilife_official）；成员个人同左核验规则。  
   - 官网成员页 / Wayback 存档写真（已有先例，可继续补早期成员）。  
   - 每张图：下载原图像素（IG/TikTok 取帖内原图或可拿到的最大静图；X 用 `name=orig`/`large`），**不裁剪、不改比例**；转 webp 时长边 ≤2048、单张 ≤1MB（与既有规则一致）。

4. **R2 流程（HANDOFF §6）**  
   - 暂存 `img/` → 上传桶 `ilife-images` 键 `img/<文件名>` → `python3 db/r2_images.py add` → `verify` → 登记 `images`（`local`/`w`/`h`/`date`/`post_id`/`source`/`category`/`kind`）→ `python3 db/export.py`。  
   - 文件名建议：`group-<era>-<mediaId>.webp`、`member-<member_id>-<mediaId>.webp`，避免覆盖。  
   - **不提交**图片文件与令牌；只提交 sqlite、`r2_manifest.json`、`data/*`、结果文档。

5. **出处**  
   - 每个外部 URL 写入 `sources` 并关联；必须实际打开，确认是官方账号帖且内容对应 iLiFE! / 该成员 / 该体制。  
   - **不得拼接或猜测**推文 ID、短链、media ID。  
   - 日期用 **JST**（X 从 snowflake 换算）。团体 / 个人公式图的 `images.date` = 公开日。生诞祭现场图同样记该帖的公开日（JST），`category=live`，与纯アー写（`category=official`）区分；不把演出日改写成别的日期。

### 不做（out of scope）

- 不建姐妹团（i-COL、GILTY×GILTY、のんふぃく！、BLK LiLiY、iON! 等）独立图库；兼任成员**只收其作为 iLiFE! 成员期间、且帖文与 iLiFE! 相关**的图。  
- 不改公演封面、歌曲封面、打歌服主记录（025/029/030 等）：不改 `lives.cover_image_id` / `songs.cover_image_id`，不新增 `image_lives` / `costume_images`。生诞祭现场图、公演告知拼图、打歌服特写仍收入图库，只按下面的 `category` / `kind` 区分，不挂进封面或打歌服主流程。  
- 不收录粉丝图、搬运号、Eventernote/LiveFans 图。  
- **不把 TikTok/Reels 视频截帧当公式图**（除非该平台帖本身附带的是官方静图/多图相册）。  
- 不删已有图；不 force push；不部署。  
- 不改 `members` 表结构去加 `instagram`/`tiktok` 字段（若执行中发现稳定链接，写入结果报告，另开任务再议 schema）。

## 数据来源（起点；执行时仍须逐条打开核验）

| 类型 | 账号 / URL |
|---|---|
| 官网 | https://ilife-heroines.com/ |
| X 团体 | https://x.com/iLiFE_official |
| Instagram 团体 | https://www.instagram.com/ilife.idol/ |
| TikTok 团体 | https://www.tiktok.com/@ilife_official |
| YouTube About（交叉核验成员链出） | https://www.youtube.com/@iLiFE_official |
| 成员 X | `members.x`（仅 `x_status=有效`） |
| 早期官网写真 | Wayback 上的成员页（已有 55 张 individual 先例） |

第三方汇总文（如 SNS 一览博客）**只能当线索**，出处必须落到官方帖/官网本身。

## 执行顺序与提交

1. 盘点：按时期列出待补团体图线索；按成员列出待补个人图线索（含 IG/TikTok 是否核验到个人号）。  
2. 先补 **e2/e3/e6/e10 团体图**，再补 **缺口成员个人图**，再扫现役/其余前成员增量。  
3. **每完成一批**（例如一个时期或 3–5 名成员）就：`r2_images.py add` + `export.py --check` + commit + push 分支。  
4. 网络请求一律超时（如 `curl -m 20`）；禁止无超时长循环。  
5. 全部完成后写 `docs/tasks/038-result.md`，状态改为「待验收」，附各组提交号与「未找到」清单及原因。

## 验收标准

- [x] `python3 db/export.py --check` 通过；新图均在 `db/r2_manifest.json` 且 `r2_images.py verify` 抽查通过  
- [x] e2 / e3 / e6 / e10 至少各有 ≥1 张可核验的 `kind=group`（若官方确实无图，结果里写明检索范围与结论，不得留空不解释）  
- [x] 上表 8 名缺口成员：每人至少尝试补图；补到的有出处；仍为 0 新增的写明原因（账号消失 / 仅视频无静图等）  
- [x] 新图来源统计：X / Instagram / TikTok / 官网·Wayback 各多少张；每张能打开原帖且为官方  
- [x] 图片未裁剪、比例正确；时期页团体区与成员详情个人图可加载  
- [x] 只推送了 `agy/038-members-groups-images`；未部署、未改 main  

## 状态

待验收。明细与提交号见 `docs/tasks/038-result.md`。

## 待用户确认（启动前由规划方确认，写入本单后再跑）

1. ~~**毕业 / 退团发表照**~~：**已确认（2026-10-24）** — 官方「卒業」「契約違反による活動終了」等帖里的个人/合照**算**公式图并入库；`kind=individual`（多人则 `group`），`category=official`，能从文案认定的单人写入 `image_members`。  
2. ~~**图片类型边界**~~：**已确认：收录（2026-10-26）**。生诞祭现场图、公演告知拼图、打歌服特写都纳入本任务，用既有 `category` / `kind` 与纯アー写区分，不新开表、不加列：
   - 纯アー写 / 体制公式照 / 毕业·退团发表照：`category=official`，`kind=group` 或 `individual`
   - 生诞祭现场图：`category=live`，单人 `kind=individual`，全员合照 `kind=group`
   - 公演告知拼图：`category=other`，`kind=group` 或 `individual`（文案能认定单人时）
   - 打歌服特写：`category=costume`，单人 `kind=individual`，全员 `kind=group`
   一张图只关联一名成员（`export.py` 禁止 `image_members` 多名）。全员合照不挂成员，避免只写出其中一人。
