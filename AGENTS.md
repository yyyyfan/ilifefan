# iLiFE! 应援资料库 · 协作规范

## 分工
- **执行（写代码 / 改数据）**：默认使用 **Antigravity**；Codex 作为备选（Antigravity 不可用或需要第二意见时）。
- **规划与验收**：Grok Bot。负责拆任务、写验收标准、核对结果、部署后线上抽查。
- 流程：Grok Bot 在 `docs/tasks/` 写任务单 → 执行方在**任务分支**上实现并推送该分支 → Grok Bot 按验收清单逐项检查 → 通过后由 Grok Bot 合并到 main 并部署。

## 分支流程（main 推送即自动发布到 GitHub Pages）
- 执行方必须在分支上工作：Antigravity 用 `agy/NNN-slug`，Codex 用 `codex/NNN-slug`（如 `agy/012-lives-2022`）。
- **只推送自己的任务分支，绝不推送 main，绝不 force push，不部署。**
- 任务单状态（待验收 + 提交号）也提交在任务分支上。
- 验收通过后由 Grok Bot 合并到 main 并部署；未通过则在同一分支返工。

## 任务单格式（`docs/tasks/NNN-简短名.md`）
```
# 标题
## 目标        为什么做，做完是什么样
## 范围        要改的页面/表/脚本；明确不做什么
## 数据来源    必须引用的出处（官方 X、官网、Wikipedia 等）
## 验收标准    可逐条勾选的检查项
## 状态        待办 / 进行中 / 待验收 / 已完成（附提交号）
```

## 硬性规则
1. **数据只改 `db/ilife.sqlite`**，不要手改 `data/*.json`；改完运行 `python3 db/export.py`（改了时期起始日或图片日期加 `--rebuild-derived`），检查必须全部通过。
2. **每条事实要有出处**：新增/修改的数据写入 `sources` 并关联；查不到就留空并注明，不得编造。
   - 每个外部出处 URL 都必须**实际打开**，确认页面内容提到 iLiFE! 且与该事实（演出名、日期等）一致后才能写入。
   - **不得拼接或猜测 ID / URL**（如 Eventernote、LiveFans 的 events/数字、推文 ID）；只用实际打开过的页面地址。
   - 找不到出处就留空并注明“未查到”，不要填近似值。数字类（如会场容纳人数）必须有能直接看到该数字的页面。
3. **日期一律用日本时间（JST）**。推文时间从 post ID 换算，不要用 UTC 日期。
4. **图片不裁剪、不改比例**；网格按行铺满，格子以最大分辨率占位，列数可调。
5. 视觉沿用现有偶像应援风与成员应援色，参考成熟站点，不自创风格。
6. **界面文案走 `app.js` 顶部的 `UI` 字典**（中 / 日 / 英三语，键是简体中文原文，值 `[日本語, English]`），
   新加文案一律写成 `i18n('中文原文')`，不要直接写死中文；带数量的句子用 `{n}` 占位符。
   数据正文（成员名、歌名、公演名、备注、推文原文、打歌服名）保持原文，不进字典。
   都道府县显示用 `pname(pref)`，公演类型显示用 `liveType(t)`。
7. 提交信息写清改了什么、依据是什么；一个任务一组提交，不夹带无关改动。
8. 不要提交令牌、密钥。**图片不进 Git、不进 Pages**：新图上传到 Cloudflare R2 桶 `ilife-images`（键 `img/<文件名>`，原字节），用 `python3 db/r2_images.py add` 记入 `db/r2_manifest.json`，再登记到 `images` 表（流程见 `docs/HANDOFF.md` 第 6 节）。

## 验收清单（每次都查）
- [ ] `python3 db/export.py --check` 通过
- [ ] 本地打开受影响页面，桌面与手机宽度各看一遍，无报错、无空白图
- [ ] 新数据有出处链接，日期为 JST
- [ ] 部署后 GitHub Pages 与 Cloudflare Pages 的 `data/*.json` 与仓库一致

## 发布
见 `db/README.md` 的“发布”一节（`deploy.sh` + Cloudflare 连接器创建部署）。发布由 Grok Bot 在验收通过后执行。

## 相关文档
- `db/README.md` 数据库与导出
- `member-audit.md`、`photo-audit.md` 成员与照片核对记录
