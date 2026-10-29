# iLiFE! 应援资料库 · 项目交接说明（HANDOFF）

> 写于 2026-10-22（JST/北京时间同日）。交给新的 AI / 协作者继续维护时，**先读本文件，再读根目录 `AGENTS.md` 和 `db/README.md`**。
> 本文不含任何令牌、密钥或密码，只说明去哪里、怎样获取。

## 1. 项目是什么
- 偶像团体 **iLiFE!**（アイライフ，运营 HEROINES / imaginate）的**非官方粉丝资料库**：成员、在籍时间轴、时期阵容、歌曲与打歌服、全部公演、会场、日历、图库。
- 界面文案三语（中 / 日 / 英），统一走 `app.js` 顶部的 `UI` 字典 + `i18n()`；
  成员名、歌名、公演名、备注、推文原文等数据正文保持原文。语言选择存 `localStorage`，也可用 `?lang=zh|ja|en` 直链。
- 线上地址：
  - **主站（自定义域名）**：<https://ilifefan.dpdns.org/>（Cloudflare Pages）
  - Cloudflare Pages：<https://ilifefan.pages.dev>（项目名 `ilifefan`，连 GitHub `yyyyfan/ilifefan`，push `main` 自动部署；旧址 `ilife-site.pages.dev` 已废弃）
  - GitHub Pages：<https://yyyyfan.github.io/ilifefan/>（push 到 `main` 自动发布，备用；**旧路径 `/ilife-site/` 已直接 404，不会跳转**，对外分享一律用新路径）
- GitHub 仓库：<https://github.com/yyyyfan/ilifefan>（owner `yyyyfan`，默认分支 `main`；由 `ilife-site` 改名而来）。
- 线上版本以各站 `data/version.json` 为准（主站 / Pages / GitHub Pages 应对齐）。
- **图片不在仓库里**：全部图片在 Cloudflare R2 桶 `ilife-images`，公开地址前缀 `https://img.ilifefan.dpdns.org/`（R2 自定义域名，见第 6 节）。

## 2. 技术栈
- 纯静态站：8 个很小的 HTML 壳 + 一个 `app.js`（原生 JS，无框架、无构建）+ `style.css`。数据由前端 `fetch('data/*.json?v=版本')` 读取。
- 数据源：SQLite 数据库 `db/ilife.sqlite`（唯一真源）→ `db/export.py`（Python 3 标准库）导出 `data/*.json`。
- 部署脚本：`deploy.sh`（bash）+ `db/cf_upload.py`（需 `pip install blake3 requests`）+ `db/cf_deploy.template.js`（生成的部署脚本在 Cloudflare 连接器里执行）。
- 图片处理：Pillow（转 webp、读宽高）。图片存储：Cloudflare R2（`db/r2_images.py` 维护清单 `db/r2_manifest.json`）。
- 本地预览：仓库根目录 `python3 -m http.server 8000`，打开 <http://localhost:8000/>。

## 3. 目录结构
```
ilifefan/
├─ AGENTS.md              协作规范与硬性规则（执行方必读）
├─ index/members/songs/lives/venues/calendar/eras/gallery.html   页面壳（data-page 区分页面）
├─ app.js                 全部前端逻辑（导航、各页渲染、灯箱、网格）
├─ style.css              样式（偶像应援风 + 成员应援色）
├─ _headers               Cloudflare Pages 缓存头（作为部署表单字段上传）
├─ .nojekyll              让 GitHub Pages 不走 Jekyll
├─ data/                  由 db/export.py 生成的 JSON（不要手改）
│   members / eras / timeline / lives / songs / images .json, version.json
├─ img/                   （不入库）新图上传 R2 前的本地暂存目录，已在 .gitignore
├─ db/
│   ├─ ilife.sqlite        数据库（唯一真源）
│   ├─ schema.sql          表结构
│   ├─ export.py           校验 + 导出 JSON + 更新 HTML 资源版本号
│   ├─ check_sources.py    抓取校验非 X 外部出处 / 会场容量出处
│   ├─ cf_upload.py        Cloudflare Pages 资产上传（自动跳过 img/ 与所有图片文件）
│   ├─ r2_manifest.json    R2 图片对象清单：键 → [字节数, md5, Content-Type]（export 用它校验图片存在）
│   ├─ r2_images.py        R2 图片工具：add 记入清单 / upload-cmd 打印 wrangler 上传命令 / verify 核对公开地址
│   ├─ cf_deploy.template.js  创建部署的连接器脚本模板
│   ├─ import_from_json.py 一次性迁移脚本（已执行，勿重跑）
│   ├─ curation/           人工复核数据（JSON）：粉丝影像白/黑名单、公演封面否决、出演成员例外、jacket 指定
│   ├─ curation_check.py   校验 curation/*.json 与数据库是否对得上
│   └─ README.md           数据库与发布说明（含「脚本分类」表）
├─ docs/
│   ├─ HANDOFF.md          本文件
│   └─ tasks/              任务单 001–018、结果(-result)、验收(-acceptance)、审计脚本(015-audit/016-audit/audit)
├─ member-audit.md, photo-audit.md   早期成员与照片核对记录
└─ deploy.sh              一键导出+推送+Cloudflare 上传
```
`.gitignore` 忽略 `db/cf_manifest.json`、`db/cf_deploy.js`、`__pycache__/`（部署临时产物），以及 `img/` 和 jpg/jpeg/png/webp/gif/avif/heic（图片一律不进 Git）。

## 4. 数据模型（`db/ilife.sqlite`，行数为交接时）
| 表 | 行数 | 内容 |
|---|---|---|
| `members` | 26 | 成员（含已毕业、支援、候补生）：读音、生日、应援色 hex、X 账号、状态等；`sort`/`tl_sort` 为显示顺序 |
| `member_fields_sources` | 229 | 成员每个字段对应的出处 |
| `member_periods` | 30 | 在籍区间（type：r=正式，s=支援，n=非正式/候补生），驱动时间轴 |
| `timeline_marks` | 5 | 时间轴上的标记事件 |
| `eras` | 12 | 时期 e1..e12（起始日、阵容变化、出处） |
| `era_members` | 88 | 各时期阵容（role：支援/副支援/休止，空=正式） |
| `songs` | 61 | 歌曲：MV 公开日、发行日、收录作品、曲长 `duration`（m:ss）、封面 `cover_image_id`、`member_id`（非空=成员个人曲，任务 027） |
| `song_videos` | 101 | 歌曲 YouTube 影像：`kind`=MV/Lyric/Live/Dance/Other、原标题、上传日 `date`、缩略图直链 `thumb`（YouTube CDN，不入 R2）；`official`=1 官方 75 条 / =0 粉丝上传 26 条（任务 032，非官方必须记 `channel` 上传者） |
| `song_images` | 130 | 歌曲相关图片（任务 026）：引号点名曲名的官方帖图 |
| `costumes` / `costume_images` | 27 / 103 | 打歌服（对应歌曲与时期）及其图片 |
| `lives` | 872 | 公演：日期(JST)、标题、会场、type（ワンマン/主催/対バン/フェス/リリイベ/生誕祭/配信/その他）、开场/开演、note、setlist、主出处 `source_id`、封面 `cover_image_id` |
| `live_members` | 6572 | 每场出演成员（任务 028）：由 `member_periods` 按日期推导，`status`=出演/支援/非正式/休演/未出演 |
| `venues` | 215 | 会场：名称、都道府县、地址、容量、URL |
| `region_geo` | 26 | 场地足迹图锚点（任务 047）：`kind=pref` 为都道府县厅所在城市坐标；`overseas` / `unknown` 不上图 |
| `images` | 4453 | 图片：原图 URL `url`/`orig`、R2 对象键 `local`（如 `img/xxx.webp`，导出时拼成 R2 完整地址）、日期、来源帖 `post_id`(→sources)、类别 category、宽高 w/h、复核 review |
| `image_members` / `image_eras` / `image_lives` | 1348 / 4453 / 684 | 图片与成员 / 时期（按日期自动推导）/ 公演的关联 |
| `sources` | 4321 | 所有出处 URL（唯一） |
| `meta` | 2 | 杂项（timeline 来源与说明） |

要点：
- `*key_order` 列记录原 JSON 键顺序，保证导出逐字节稳定；新增记录照抄同类记录的 key_order。
- `lives.note` 里的约定词：`仅非官方来源`（只有 Eventernote/LiveFans 等第三方出处）、`未出演`（官方公告辞退）、`补充核验：URL`（第三方辅助链接）。
- 图片 category：other 1679、official 1032、live 888、member 381、costume 334、illustration 65。

## 5. 导出与检查命令
```bash
python3 db/export.py --check            # 只校验并与现有 JSON/HTML 版本号逐字节比对，不写文件（每次必跑）
python3 db/export.py                    # 校验通过后写出 data/*.json、version.json，并更新 HTML 的 ?v=
python3 db/export.py --rebuild-derived  # 改了时期起始日或图片日期后用，重算 image_eras
python3 db/check_sources.py [--year 2022]  # 联网抓取校验非 X 出处是否真实且提到 iLiFE!
python3 db/curation_check.py            # 校验 db/curation/*.json 的结构、引用与库内一致性（改过就必跑）
```
export 会检查：外键、日期/时间格式与先后、时期顺序、重复记录、图片在 R2 清单 `db/r2_manifest.json` 中、成员/时期关联一致。失败则列出问题、非零退出、不写文件。版本号 = style.css + app.js + 全部 JSON 的内容哈希。

**改数据先看 `db/curation/`**：粉丝影像算不算数、某张图能不能当公演封面、哪场整场辞退、哪首歌用哪张 jacket，
这些结论都在那 4 个 JSON 里，改完跑 `curation_check.py` 再跑对应脚本。`db/README.md` 有「脚本分类」表，
标明哪些是一次性迁移（别重跑）、哪些是幂等可重跑。

## 6. 图片规则与存储
### 6.1 存储：Cloudflare R2（任务 019 起）
- **GitHub 仓库（含全部历史）和 Cloudflare Pages 都不放任何图片**。图片全部在 R2：
  - 桶：`ilife-images`（Cloudflare 账号同 Pages 项目；位置 ENAM，Standard 存储）
  - 公开地址前缀（R2 自定义域名，任务 021 起）：`https://img.ilifefan.dpdns.org/`
    - 域名 `ilifefan.dpdns.org` 托管在 Cloudflare（NS `rommy.ns.cloudflare.com` / `alexia.ns.cloudflare.com`），
      2026-10-22 在 R2 → 桶 → Settings → Custom Domains 绑定 `img` 子域，证书自动签发，状态 Active。
    - 走 Cloudflare 边缘缓存，不再受 r2.dev 限速影响。
  - 备用地址（Public Development URL，仅开发/回滚用）：`https://pub-12b0e8cdf6994377a377f1b1909e1ea9.r2.dev/`（有限速，超限 429）
  - 对象键 = 原相对路径，如 `img/E-1mfcBVQAE82N2.jpg` → `https://img.ilifefan.dpdns.org/img/E-1mfcBVQAE82N2.jpg`
  - 019 迁移时 4048 个对象，851,782,258 字节（3693 jpg + 355 webp），按原字节上传、未转码。
- 唯一配置点：`db/export.py` 的 `IMG_BASE`。数据库 `images.local` 只存对象键；导出 JSON 时拼成完整地址，前端 `app.js` 直接用 JSON 里的地址，所以本地开发（`python3 -m http.server`）也从 R2 读图，本地不需要任何图片文件。换域名只改 `IMG_BASE`、重新导出并部署即可。
- `db/r2_manifest.json` 是 R2 中对象的清单（键 → [字节数, md5, Content-Type]），`export.py` 用它检查"图片存在"。新图必须先上传到 R2 再记入清单，否则导出失败。
- 缓存规则（2026-10-23 已配置）：Cache Rules 匹配 `Hostname equals img.ilifefan.dpdns.org`，
  Cache eligibility = Eligible for cache，Edge TTL / Browser TTL 均 override 为 1 年。
  实测首次 MISS、再次 `cf-cache-status: HIT`，响应 `Cache-Control: max-age=31536000`，10 张抽样 md5 全部一致。
  图片文件名唯一、内容不变，缓存后源站请求接近零；改图必须换文件名（或 purge）。
- 费用：R2 免费额度每月 10 GB 存储，读取流量本身不收费；当前约 0.85 GB。

### 6.2 新增图片的流程
1. 按下面的规则准备图片，放到本地暂存目录 `img/`（不会被 Git 提交、也不会被部署到 Pages）。
2. 上传到 R2（键必须是 `img/<文件名>`，Content-Type 要正确，字节原样）。任选一种，**凭据都不要写进仓库**：
   - wrangler：`npx wrangler login` 后，`python3 db/r2_images.py upload-cmd img/xxx.webp` 打印命令，形如 `npx wrangler r2 object put ilife-images/img/xxx.webp --file "img/xxx.webp" --content-type image/webp --remote`。
   - Cloudflare API（原流程用 Cloudflare MCP 连接器 `execute`）：`PUT /accounts/{account_id}/r2/buckets/ilife-images/objects/img/xxx.webp`，请求体为图片字节、`Content-Type` 为图片类型；返回的 `etag` 应等于文件 md5。连接器单次请求体上限约 4 MB（base64 后），适合少量图片。
   - S3 兼容接口（rclone / aws cli）：在 Cloudflare 面板为该桶创建 R2 API 令牌（Object Read & Write，限定桶 `ilife-images`），endpoint `https://<account_id>.r2.cloudflarestorage.com`；令牌用完删除。
3. `python3 db/r2_images.py add img/xxx.webp`：把字节数/md5/类型记入 `db/r2_manifest.json`。
4. `python3 db/r2_images.py verify img/xxx.webp`：从公开地址下载核对（200、类型、字节、md5 一致）。不带参数默认抽查 20 个，`--all` 全量。
5. 在 `images` 表登记（`local` = `img/xxx.webp`，w、h、date、post_id、source、category），跑 `python3 db/export.py`，提交 `db/ilife.sqlite`、`db/r2_manifest.json`、`data/*`。暂存的 `img/xxx.webp` 之后可删。
- **替换图片必须换新文件名**，不要覆盖 R2 里已有的键（`r2_images.py add` 遇到同名不同内容会拒绝）。删除图片时，R2 对象可以保留（不影响网站），清单里的条目也可保留。

### 6.3 图片内容规则
- 每张图**必须**在 `images` 表登记（local、w、h、date、post_id、source、category）。早期 X 图多为 `<媒体ID>.jpg`（长边 ≤1600）；016 以后新增为 webp，如 `live-<live_id>-<媒体ID>.webp`、`jacket-<JAN>.webp`。
- **只用官方图**：@iLiFE_official、成员官方账号、主办方官方账号/官网、TicketDive 等主办方自建售票页、Apple Music 配信 jacket、官方月度日程图、演后官方感谢合照。
- **Eventernote / LiveFans 等第三方图片一律不用**（016 曾误加 77 张已删除）。
- **不裁剪、不改比例**；X 取 `name=orig`（或 large），转 webp，长边 ≤2048px（等比缩小），单张 ≤1MB。
- 公演封面 `images.date` = **演出日期**；写 `image_lives` 并设 `lives.cover_image_id`。
- **一场要收该场出处帖的全部图片，不是只收一张**（任务 025 起）。归属判断不需要猜：
  同一个 X 帖的图就是该场的图；图片键名约定 `img/live-<live_id>-<媒体ID>.webp` 可直接判重。
  工具：`db/live_images.py`（`--stage` 下载转码 → 上传 R2 + `r2_images.py add` → `--apply-new` 入库 → `--covers` 重算封面；
  另有 `--link` 补挂、`--fix-eras` 补时期）。`--fix-eras` 必须跑，否则导出报「image_eras 与日期不符」。
- **封面取「最能代表这一场」的那张**：演出照（`category='live'`）> 该场专属告知图 > 官方图 > 打歌服/成员 > 其他；
  同档时保持现有封面不动（避免把海报换成更大的时间表）。只有出现更高档的图才覆盖。
  目前 624 场有封面，其中 12 张被 3 场以上共用（多为巡演通版海报，等有当日图再换）。
- 歌曲封面：**方形配信 jacket 优先**；没有 jacket 才退到官方 MV 缩略图（第 7、13、20、22、31、43 首），再没有才用官方报道写真（第 17 首）；三者都无（第 14 首 Ride On!）才退到粉丝影像的缩略图，最后兜底是前端画的占位块。**不编造、不使用来源不明的图。**
- **歌曲影像与相关图片（任务 026）**：
  - 影像只收**官方 YouTube 频道**（`@iLiFE_official`）。判定：视频标题里出现曲名（NFKC 归一化、去空格、小写），
    类型按 `【MV】` > リリックビデオ/Lyric > LIVE映像/LIVE MOVIE > DANCE 排序；一歌多影像全部保留（MV + LIVE + Dance 版并存）。
    工具 `db/yt_channel_scan.py`（抓频道全量，含 continuation 分页；页面结构已从 `videoRenderer` 改为 `lockupViewModel`）
    + `db/task026_song_media.py --plan/--dates/--thumbs/--apply`。
  - 缩略图用 YouTube CDN 直链（`i.ytimg.com`，优先 maxresdefault），**不入 R2**：它是视频元数据，与视频同源同生共死。
  - 相关图片的判定必须**严格**：帖子文字里曲名要**被引号点名**（「」『』【】“”），且不含票务/抽选/物贩/粉丝数里程碑/卡拉OK 上架等事务性内容，
    并排除插画与该曲打歌服图（打歌服另有 `costumes` 分组）。只按「文字里出现过曲名」收会大量误收（巡演通版海报、里程碑感谢帖）。
  - 2026-10 现状：36/44 首歌有官方影像（MV 24、Lyric 5、Live 30、Dance 6、Other 3，共 68 条）；31 首歌有相关图片（共 121 张）。
    8 首查无官方影像：Sleeping face、Quest×Quest、キラメキダイアリー、HUNGRY!!!、Ride On!、Shout of Joy、メッセージ、i REVOLUTION。
- 017 中节日 cosplay / 万圣节棚拍照**没有**作为演出封面（不能证明出演该场）；3 张已撤封面但保留在图库。用户尚未把这条定为永久规则。

## 7. 前端概览（`app.js`）
- 每个 HTML 只有 `<body data-page=…>` 和空的 header/main，`app.js` 按 `data-page` 渲染：home 首页、members 成员（卡片+在籍时间轴）、songs 歌曲（统一方形封面卡片网格→详情，详情顶部为「封面 + 元信息」两栏，下接「影像（官方/非官方可切换）/ 相关图片 / 打歌服」三段；缩略图优先方形 jacket，其次 MV 缩略图）、lives 公演（按年卡片网格，每场一张封面；详情显示类型、开场/开演、出处链接、note 原文与 setlist）、venues 会场、calendar 日历、eras 时期/公式图、gallery 图库（按时期/成员/类别筛选）。
- `NAV` 数组定义导航；`V` 为当前版本号，所有 fetch 带 `?v=`；灯箱 `#lb` 支持左右翻页。
- 网格：按行铺满、格子以图片最大分辨率占位，图片用 `object-fit:contain` 不裁剪。
- 页脚声明非官方、版权归原发布者。

## 8. 发布与部署
### 8.1 GitHub Pages
- 仓库 Settings → Pages：Source 为 `main` 分支根目录。push 到 main 后约 1–2 分钟自动发布。
- 需要对 `yyyyfan/ilifefan` 有 push 权限的 GitHub 账号（HTTPS + 个人访问令牌或 SSH key，**自行配置，不在仓库里**）。

### 8.2 Cloudflare Pages（项目 `ilifefan`，生产分支 `main`）
- 项目名：`ilifefan` → 默认域名 <https://ilifefan.pages.dev>；自定义域名 <https://ilifefan.dpdns.org/>（同区 DNS）。
- **主路径**：仓库已连 GitHub（`yyyyfan/ilifefan`）。push 到 `main` 会自动构建并部署到 Cloudflare Pages（与 GitHub Pages 并行）。日常发布：验收合并后 `./deploy.sh "提交说明"`（不带令牌）即可同时推 GitHub Pages 与触发 CF 自动部署。
- **备用直传**（连接器 / wrangler，一般用不上）：需要 Account → Cloudflare Pages: Edit 权限的 API Token。
  1. `GET /accounts/{account_id}/pages/projects/ilifefan/upload-token` 取得短期上传 JWT；
  2. `./deploy.sh "说明" /tmp/cf-upload-token.json` → 生成 `db/cf_deploy.js`；
  3. 在 Cloudflare 连接器 `execute` 中运行该脚本创建部署（或 `npx wrangler pages deploy . --project-name ilifefan --branch main`）。
  用完删除令牌与 `db/cf_deploy.js`、`db/cf_manifest.json`。
- 部署包**不含图片**（`cf_upload.py` 跳过 `img/`；图片在 R2，见第 6 节）。
- 验证：`curl https://ilifefan.dpdns.org/data/version.json`、`curl https://ilifefan.pages.dev/data/version.json`、`curl https://yyyyfan.github.io/ilifefan/data/version.json` 三者与仓库 `data/version.json` 一致；抽查页面与图片（`img.ilifefan.dpdns.org`）。

## 9. 长期数据规则（用户要求严格执行）
1. **数据只改 `db/ilife.sqlite`**，不手改 `data/*.json`；改完跑 export。
2. **每条事实都要有出处，且出处必须实际打开过**、页面确实提到 iLiFE! 且与日期/会场/活动名一致；不得拼接或猜 URL / 推文 ID / events 编号；查不到就留空并写“未查到”。数字（容量等）要有能直接看到该数字的页面。
3. **Eventernote / LiveFans 只能当线索**：只有第三方出处的公演在 note 写 `仅非官方来源`；尽量升级为官方出处（@iLiFE_official、主办方 X/官网/售票页），原第三方链接可留作 `补充核验：`，不能是唯一出处。
4. 官方出处与现有数据不一致时以官方为准并在结果里列出；官方显示没出演的**不要删**，交用户决定。
5. **日期一律 JST**；推文时间由 post ID 换算（snowflake：`(id>>22)+1288834974657` 毫秒，再 +9h），不要用 UTC 日期。
6. 图片规则见第 6 节（只用官方图、不裁剪不改比例、webp ≤2048px ≤1MB、images.date=演出日期）。
7. 视觉沿用现有偶像应援风与成员应援色；界面文案走 `UI` 字典（中 / 日 / 英），数据正文保持原文。
8. 一个任务一组提交，提交信息写清改了什么、依据是什么；**不提交令牌/密钥**。

## 10. 工作流程
- **角色**：规划/验收/合并/部署 = 主 AI（原为 Grok Bot）；写代码改数据 = 外部编码代理（默认 Antigravity，备选 Codex）。
- **流程**：规划方在 `docs/tasks/NNN-简短名.md` 写任务单（目标/范围/数据来源/验收标准/状态）→ 新建 worktree 与分支（Antigravity `agy/NNN-slug`，Codex `codex/NNN-slug`，从最新 main 拉出）→ 编码代理只推送自己的分支（绝不推 main、不 force push、不部署），完成后写 `NNN-result.md` 并把状态改为「待验收」→ 规划方逐项验收（按年份逐条打开出处抽查/全查），修正写入 `NNN-acceptance.md` → 合并 main → 部署 → 两站核对版本。
- **启动编码代理**（在 worktree 根目录运行，完全信任、不弹确认）：
  ```bash
  nohup ~/.local/bin/agy -p "先读 AGENTS.md 和 docs/tasks/NNN-xxx.md，严格按任务单完成……" \
    --model gemini-3.8-flash-high --dangerously-skip-permissions --print-timeout 180m \
    </dev/null > /workspace/agy-NNN.log 2>&1 &
  codex exec --skip-git-repo-check --dangerously-bypass-approvals-and-sandbox "任务内容" </dev/null
  ```
  `</dev/null` 很重要，否则可能挂起等输入。
- **巡检**：每 20 分钟看 PID 是否存活（`kill -0`）、日志修改时间、是否有新提交；超过 40 分钟无进展则重启，同一任务失败 3 次换 Codex。用户希望**自动观察并修复异常**，只汇报里程碑和阻塞；23:30–08:00 安静时段只静默修复，08:00 后合并汇报。
- 与用户沟通用简体中文；需要用户拍板的事项（如删数据、规则变更）先问再做。

## 11. 历史任务摘要（详见 `docs/tasks/`）
| 编号 | 内容 | 结果 |
|---|---|---|
| 001 | 新增歌曲页与打歌服 | 完成 |
| 002 | 歌曲日期与出处修正（区分 MV 公开日/发行日） | 完成 |
| 003 | 修复 deploy.sh 的 Cloudflare 上传步骤与令牌解析 | 完成 |
| 004 | 歌曲页改统一卡片网格（方案 A） | 完成 |
| 005 | 补歌曲卡片封面与打歌服 | 完成 |
| 006 | 静态资源自动版本号、缓存头 | 完成 |
| 007 | 部署时正确上传 `_headers` | 完成 |
| 008 | 再找 Ride On! / Shout of Joy 官方图 | Shout of Joy 找到，Ride On! 未找到 |
| 009 | 公演数据结构 + 2020–2021 年全部公演 | 完成（36→172 场） |
| 010 | 2022 年公演（第一版） | **撤回**（69 个第三方出处指向无关页面） |
| 011 | 2020–2021 出处换官方 | 完成（随 012 合并） |
| 012 | 2022 年公演严格出处重做 | 完成 |
| 013 | 公演页改卡片并配图（Antigravity 卡住，改 Codex） | 完成 |
| 014 | 补 23/24 场会场 + 2027 年官方配图 | 会场完成；2027 年 11 场未找到配图 |
| 015 | 补全 2023–2026 年公演（严格出处） | 完成，新增 535 场，共 865 场 |
| 016 | 补全所有配图（歌曲 + 公演） | 完成；删 Eventernote 图；图片日期改演出日期；GMOアリーナさいたま 会场改名已用官方出处确认 |
| 017 | 2020–2023 公演配图（逐场找主办方官方原帖） | 完成，有封面 239→277（共 472）；撤 3 张万圣节棚拍照 |
| 018 | 2020–2022 公演逐场换官方出处 | 完成，182 场中 98 场升级，剩 84 场 |
| 019 | 图片全部迁到 Cloudflare R2；仓库全部历史与 Pages 删除图片 | 完成（见 019-result.md；历史已重写，旧提交号作废） |
| 020 | 主流出道单曲『アイドルライフメガパック』发行信息 + 7 场发售纪念活动 | 完成，lives 865→872，会场 210→215 |
| 021 | 图片基地址从 r2.dev 切到 R2 自定义域名 img.ilifefan.dpdns.org | 完成，4310 条图片地址切换，抽查 25 个对象 0 问题 |
| 022 | 统一仓库行尾为 LF | 完成，新增 `.gitattributes`，114 个文件转 LF，`export.py --check` 不再误报 |
| 023 | 2021 年新冠自肃辞退的 5 场统一标「未出演」 | 完成，未出演 2→5，124/126/127 补注并改引 imaginate 公告 |
| 024 | 里程碑公演改用官方公告为源并补开场/开演时间 | 完成，10 条 Wikipedia 源改官方，27→17；新增官方公告索引 |
| 025 | 每场公演收录出处帖的全部图片 + 封面按代表性重算 | 完成，新增 68 张（43 场），多图场 9→42，17 场从无封面到有封面 |
| 026 | 歌曲补官方影像（MV 链接）与相关图片 | 完成，36/44 首有影像（68 条），31 首有相关图片（121 张），歌曲详情新增「官方影像 / 相关图片」两段 |
| 027 | 补齐歌曲信息 + 成员个人曲入库 | 完成，songs 44→61（新增 17 首个人曲），曲长 52/61、mv_date 38/61，10 首无 MV 写进 note，LiMiT STRiKER! 改为 CD 单曲收录 |
| 028 | 每场出演成员按在籍区间推导入库 | 完成，`live_members` 0→6572（872 场全覆盖），公演详情改用它、列表加 `?m=` 成员筛选、成员页显示出演场次 |
| 029 | 从出处页 og:image 补公演封面 | 完成，624→693 场有封面（+69），样板图识别刷掉 102 张 LivePocket 错误页/logo |
| 030 | 用配信 jacket 补歌曲封面 | 完成，43→59 首（8 张 jacket 覆盖 16 首），仅剩 Ride On! 与 PIXEL by PIXEL |
| 031 | 歌曲卡片统一成方形封面 | 完成，8 首从 X 告知图换成配信 jacket（52/61 为方形）；卡片封面区改方形，详情页加封面 |
| 032 | 非官方影像入 song_videos | 完成，`official`/`channel` 两列；26 条粉丝影像覆盖 20 首，详情页「官方 / 非官方」可切换；有影像的歌 43→58 |
| 033 | 人工复核数据外置到 `db/curation/*.json` | 完成，4 份 JSON（影像 26+3、封面否决 10、成员例外 5+1、jacket 3+1）取代散在各脚本里的硬编码常量；新增 `curation_check.py` 查结构/引用/一致性；`db/README.md` 补「脚本分类」表 |

## 12. 当前覆盖情况（交接时由数据库计算）
| 年份 | 公演数 | 有封面 | 无封面 | 多图场 | 仅非官方来源 | 标记未出演 |
|---|---|---|---|---|---|---|
| 2020 | 45 | 38 | 7 | 2 | 4 | 0 |
| 2021 | 95 | 72 | 23 | 6 | 24 | 5 |
| 2022 | 157 | 96 | 61 | 17 | 56 | 0 |
| 2023 | 175 | 133 | 42 | 8 | 65 | 0 |
| 2024 | 156 | 129 | 27 | 4 | 32 | 0 |
| 2025 | 121 | 116 | 5 | 3 | 12 | 0 |
| 2026 | 111 | 108 | 3 | 2 | 0 | 0 |
| 2027 | 12 | 1 | 11 | 0 | 0 | 0 |
| **合计** | **872** | **693** | **179** | **42** | **193** | **5** |

- 歌曲：**61 首**（44 团体 + 17 成员个人曲），`cover_image_id` 有 **59 首**（030 补 16 首、031 把 8 首换成方形 jacket）。
  列表卡片实际显示：**52 首方形 jacket + 7 首官方 MV 图 + 1 首报道写真 + 1 首占位块**（Ride On! 未音源化，没有官方图）。
  PIXEL by PIXEL 用官方 MV 缩略图（只在 YouTube，配信平台没有）。
  曲长 52/61，MV 公开日 38/61。
- 歌曲影像（026/027/032）：**58 首有影像共 101 条**，其中官方 75 条（MV 31 / Lyric 5 / Live 30 / Dance 6 / Other 3）、粉丝上传 26 条（`official=0`，覆盖 20 首；全是 2023–2026 的现场/全曲，标题与频道都核对过）。只剩 3 首完全没有影像（Snow Magic、スター☆まむナイズ、特別ダメハート♡，只搜到别的艺人的同名曲或伴奏）。
  没有**官方**影像的 18 首里，10 首已确认「确实没做过 MV」并写进 note；其中 15 首现在有粉丝影像可看（032）。
  仍未确认的 3 首：Snow Magic、スター☆まむナイズ、特別ダメハート♡（搜到的都是别的艺人的同名曲或伴奏）。
  交叉校验：31 首有 `mv_date` 的歌里 27 首与对应 MV 上传日完全一致，另 4 首差 1 天（跨日上传）或原 MV 已删后重发（第 13 首）。
- 歌曲相关图片（026/027）：**37 首共 130 张**（引号点名曲名的官方帖图，已排除票务/抽选/物贩/里程碑帖与打歌服图）。
- 图片：**4453 条**（029/030/031 新增 74 张：69 张公演主视觉 + 11 张配信 jacket，均已上传 R2 并记入清单；
  R2 清单 4196 个对象）。
  公演图片关联 684 条（`image_lives`），其中 42 场挂了 2–4 张。
- 会场 215 个；时期 12 个；成员 26 人（现役正式 9 人）。
- 里程碑公演（27 条曾以 Wikipedia 为源）经 024 后剩 **17 条**仍为 Wikipedia：live 5、7、8、10、11、13、25–35。
  这 17 条同时 open_time/start_time 为空，官网现存公告不覆盖，等官方公告或 X 帖可确认时再补。

## 13. 未完成 / 待决定事项

> **按优先级排好的后续路线图在 `docs/ROADMAP.md`（任务 028 起）**，含每项的可自动化范围与实测数字。
> 本节只记「已确认的问题与结论」，不排期。
1. ~~**2021 年 imaginate 7/21 新冠公告**~~：023 已处理，123/124/125/126/127 共 5 场统一标「未出演」，出处改引 imaginate 公告。
2. **2027-01-11 主流出道单曲『アイドルライフメガパック』**：020 已录入发行信息与 7 场发售纪念活动；
   剩余 CD 各形态 jacket（官方「決まり次第掲載」）与 7 场活动封面（告知图待上传 R2）。
3. **2027 年 12 场 JAPANLiFE! 2027 巡演 + 1/9 发售活动封面**：等官方出海报后补。
4. **179 场仍无封面**（029 之后）：2022 年 61 场是 eventernote 上主视觉就是坏的（LivePocket 图床返回错误页），
   2027 年 11 场等官方海报，其余分散在 2020–2024 的小场次，出处页没有主视觉。要再补只能逐场找主办方 X 帖。
5. **仅非官方来源仍有 193 场**：2020–2022 共 84 场（明细见 `018-result.md`，多为售票页失效或主办方账号已删），2023: 65、2024: 32、2025: 12。
   **024 已确认 2023 那 65 场无法用官网公告升级**：官网 `topics/detail/<id>` 详情页仍在线，但 ID 段 900–2050 全量扫完只剩
   21 条公告（最早 2023-04-12，2018–2022 已被 JamClip 改版删除），全部是巡演/TIF/成员异动类，不含单场对盘告知；
   Wayback CDX 仍离线，X 站内关键词搜索需登录。要推进只能逐场找主办方官网（018 的路子），成本高，待定。
6. 歌曲 **Ride On!** 封面缺失；**TIF 2025 8/2（live 723）** 封面为空（原图无法核实已撤）。
   027 之后 Ride On! 仍是唯一「封面/影像/打歌服」三项全空的歌。
7. ~~**7 首成员个人曲的 MV 不在 `songs` 表**~~：027 已解决——规则定为「个人曲与团体曲同表，用 `member_id` 区分」，
   17 首个人曲整首入库（id 45–61），7 首补到官方 MV。剩余 10 首个人曲 B 面无官方影像，待查。
8. **i REVOLUTION（第 44 首）有 `mv_date` 2026-08-26 但官方频道查无此 MV**，可能发布在别的频道或已下架，待查。
9. 规则待定：节日 cosplay / 棚拍照是否永久不算演出封面（目前按不算处理）。
9b. **18 首歌曲无封面**（Ride On! + 17 首个人曲）。个人曲的配信 jacket 可以从 Apple Music artwork 取
   （`itunes.apple.com` 的 `artworkUrl100` 换 `100x100` → `1200x1200`），是合规且稳定的来源，但需先决定
   「jacket 是否算歌曲封面」——目前 `songs.cover_image_id` 的语义是「官方图/官方告知图」，jacket 属新类别。
10. ~~`live_members` 尚未填写~~：028 已完成（6572 行，按在籍区间推导，前端已用）。
    遗留：対バン/フェス 563 场「只到几个成员」的情况一律按全员记，前端标「推定」，要精确需逐场现场 repo。

## 14. 给接手 AI 的建议起手式
```bash
git clone https://github.com/yyyyfan/ilifefan.git && cd ilifefan
pip install blake3 requests pillow
python3 db/export.py --check          # 应全部“逐字节一致”
python3 -m http.server 8000            # 本地预览（图片直接从 R2 加载，本地无需图片）
```
然后读 `AGENTS.md` → 本文件 → 最近的 `docs/tasks/019-*.md`，从第 13 节挑任务、写任务单 020 开始。
