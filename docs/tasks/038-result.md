# 038 结果

分支：`agy/038-members-groups-images`（只推了这个分支，没有合并 main，没有部署，没有 force push）

提交：

- `278e2e8` 任务单确认三类图片收录；把 e2 / e3 / e6 / e10 已在库里的官方合照标成 `kind=group`
- `32f3fae` 新入库官网合照与 Instagram @ilife.idol 静图；恋星はるか告知图标成个人图；图库来源标签区分 Instagram / 官网
- 本文件与任务单「待验收」在其后的提交

导出检查：`python3 db/export.py --check` 通过。版本 `9e735003`。新图 22 张已写入 `db/r2_manifest.json`，公开地址抽查 5 张（团体合照、真守みゅう PECHE、Kアリーナ合照、心花りり打歌服特写、虹羽みに PECHE）HTTP 200，字节数与 md5 与清单一致。

## 时期团体图

标完并入库后，`kind=group` 按时期：

| 时期 | 张数 | 这次怎么补上的 |
|---|---|---|
| e1 | 3 | 原本就有，未改 |
| e2 | 1 | 已有帖 2021-03-13「Brand new LiFE!」舞台五人合照，标 `category=live` |
| e3 | 1 | 已有帖 2021-10-31「HAPPY HALLOWEEN」四人衣装合照，标 `category=costume` |
| e4–e5、e7–e9、e11 | 原数量 | 未改 |
| e6 | 4 | 已有帖 2023-07-14「3rd anniversary」四张舞台合照，标 `category=live` |
| e10 | 3 | 已有帖 2025-05-23「Road to ONELiFE!」三张九人舞台合照，标 `category=live` |
| e12 | 11 | 原 8 张，加上官网 2026-07-10 合照 1 张、Kアリーナ全员舞台合照 2 张 |

e2 / e3 / e6 / e10 用的都是库内已有文件。原帖在标之前打开过（fxtwitter / 状态页），画面是全员合照，不是拼贴或单人肖像。这些合照不挂 `image_members`。

## 新入库的图（22）

日期都是 JST。Instagram 用帖子 `taken_at` 换算。官网合照用文件名 `max_profile_20260710142402` 的日期 2026-07-10。长边已 ≤2048，没有裁切。

| 来源 | 张数 | 内容 |
|---|---|---|
| X 新文件 | 0 | 四时期团体图是给已有图补 `kind`，不是新下载 |
| Instagram @ilife.idol | 21 | 见下 |
| TikTok @ilife_official | 0 | 见「未找到」 |
| 官网（非 Wayback） | 1 | https://ilife-heroines.com/profile/ 上的 `max_profile_20260710…jpg`，九人白底公式合照，`category=official` `kind=group` |
| Wayback | 0 | 见「未找到」 |

Instagram 21 张、15 个帖。每个短码都用 oembed 打开过，作者是 `ilife.idol`，文案与下表一致。画面抽看过：PECHE 为单人肖像；Kアリーナ单人帖是该成员舞台照或打歌服特写；`Dc-0AffFLDF` 两张是全员舞台合照，因此 `kind=group` 且不挂成员。

PECHE 011（`category=official` `kind=individual`，文案 `model：成员名`）：

| 日期 | 成员 | 帖 |
|---|---|---|
| 2026-10-03 | 小熊まむ | https://www.instagram.com/p/DeB4br_R1um/ |
| 2026-10-04 | 心花りり | https://www.instagram.com/p/DeEi1YURRYG/ |
| 2026-10-05 | 福丸うさ | https://www.instagram.com/p/DeG83LjR4Rk/ |
| 2026-10-08 | 真守みゅう | https://www.instagram.com/p/DePLvKYx-zd/ |
| 2026-10-09 | 純嶺みき | https://www.instagram.com/p/DeRXcRhx7zJ/ |
| 2026-10-10 | あいす | https://www.instagram.com/p/DeUF-8PRi88/ |
| 2026-10-12 | 若葉のあ | https://www.instagram.com/p/DeZO732RVBf/ |
| 2026-10-13 | 空詩かれん | https://www.instagram.com/p/DebrHPux9jb/ |
| 2026-10-14 | 虹羽みに | https://www.instagram.com/p/DeeZI2cRtu-/ |

Kアリーナ横浜 / MEGALiFE（2026-09-06～09-11）：

- 单人舞台照 `category=live` `kind=individual`：空詩かれん、真守みゅう、小熊まむ、福丸うさ、心花りり各 1 张（帖 `Dc8Z-ajlBrg` `DdBX4dkEXVo` `DdENxSBlOy5` `DdGixJnlIT4` `DdJNZJbFIDy` 的第 1 张）
- 打歌服特写 `category=costume` `kind=individual`：同上五人各 1 张（同帖第 2 张）
- 全员舞台合照 `category=live` `kind=group`：https://www.instagram.com/p/Dc-0AffFLDF/ 两张（文案带 #若葉のあ，画面是九人，不挂成员）

2026-09 的「新アー写公開」Instagram 轮播与库内更早的 X 帖重复，没有再收。

另外把已在库的 TicketDive 图（id 4062，https://ticketdive.com/event/haruka-daikansyasai ，2026-05-24）从无 kind 改为 `category=other` `kind=individual`，关联恋星はるか。画面是她一个人的大感謝祭告知海报。

## 八名缺口成员

| 成员 | 原先 individual | 现在 | 说明 |
|---|---|---|---|
| 心咲めい | 1 | 1 | 个人 X 已不存在。见下 |
| 双葉りつ | 2 | 2 | 个人 X 已冻结。见下 |
| 桜餅ふゆ | 3 | 3 | 个人 X 已不存在。见下 |
| 琥珀しえる | 5 | 5 | 个人推文已清空。库内提及她的未挂成员图是多人新衣装/团体アー写，没有单人肖像可挂 |
| 真守みゅう | 7 | 10 | PECHE 1 + MEGALiFE 舞台 1 + 打歌服特写 1 |
| 響羽リズ | 7 | 7 | @rizu_adamth 仍标为有效，但 `https://api.fxtwitter.com/rizu_adamth` 返回 404，没有拿到可打开的新帖，没有猜状态 ID |
| 恋春ねね | 10 | 10 | `members.x` 为空。库内没有未挂成员、正文只写她的图。最近 24 条官方 IG 没有她 |
| 恋星はるか | 11 | 12 | 大感謝祭告知图。@Haru_nonfic 的 fxtwitter 用户接口同样 404，没有新的个人帖静图 |

心咲めい / 双葉りつ / 桜餅ふゆ：库内毕业相关帖抽看后没有当成新的单人公式图。

- id 59、64：心咲めい毕业场传单 / 周边，不是肖像
- id 87：双葉りつ毕业文字图，没有人像
- id 67：心咲めい毕业场感谢，画面是四人舞台，且已经挂在心咲めい名下；不再改成 `kind=individual`，也不改成不挂成员的团体图（避免改掉原有关联）
- id 96：双葉りつ毕业感谢，画面是四人便装合照，已经挂在双葉りつ名下，同样未改
- id 1065：深月らむ・天羽しおり毕业文字图，两人，不是单人公式照

Wayback：`web.archive.org/cdx` 503。`archive.org/wayback/available` 对 profile 页时间戳 20210301、20210901、20220201、20230601 都落到 2023-09-22 快照，该页成员照已在库。没有打开到 2020–2021 带心咲めい / 双葉りつ / 桜餅ふゆ的成员页快照。

## Instagram / TikTok 检索范围

- Instagram 公开 feed `https://www.instagram.com/api/v1/feed/user/45180339482/` 前两页 24 帖成功，第三页 401；带 cookie 再请求时首页 429、feed 401，没有继续翻。24 帖里，2026-09「新アー写」与 X 重复已跳过，其余官方静图即上表。
- TikTok https://www.tiktok.com/@ilife_official 页面已打开。账号 `ilife_official`，用户 id `6905693091408643074`，签名写明 iLiFE! 公式 TikTok，`videoCount` 1509，页面里的 `itemList` 长度为 0。`/api/post/item_list/` 响应体为空文件。没有图片帖，没有截视频帧。

## 页面

本地打开过首页、时期页 e12 / e2、图库「公式图」、成员页真守みゅう（桌面约 1280 与手机约 390）。英雄图、时期团体图、成员个人图都能从 `img.ilifefan.dpdns.org` 加载，控制台没有报错。e12 团体公式图 11 张，e2 为 1 张（不是「未找到」）。真守みゅう个人图 10 张。

图库来源：`source` 以 `Instagram` 开头时显示 Instagram 账号，含「官网」时显示「官网」；X 与 Wayback 的原有显示不变。
