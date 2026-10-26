# 039 特殊合照与特殊个人照（衣装 / 主题静图）

执行者：cloud agent（不合并 main，不部署）  
分支：`cursor/039-special-costume-images-2975`

## 目标

把万圣节、浴衣、夏フェス、特别衣装等**特殊合照**和**特殊个人照**放进现有 DB + R2 流程，并写上 `kind` / `era` / `category`，使它们出现在时期页（`eras.html`）的团体公式图或个人公式图里。

## 范围

- 改 `db/ilife.sqlite`、`db/r2_manifest.json`、导出的 `data/*.json` 与页面版本号。
- 新图只进 R2 桶 `ilife-images`（键 `img/<文件名>`），不把图片字节提交进 Git。
- 不改页面样式，不加表、不加列。
- 不把每一张现场感谢合照都标成团体图。

## 数据来源

- X @iLiFE_official。每条新帖用 fxtwitter 打开过，作者是 `iLiFE_official`，日期按推文时间换算成 JST。
- 历史图用库内已有文件和已有出处，不重新下载。

## 验收标准

- [x] `python3 db/export.py --check` 通过
- [x] 万圣节 2026 两张必须的九人合照，以及编辑版（画面不同）已入库并带出处
- [x] 任务单列出的历史合照已核对 id：全员的标成 `kind=group`，双人的跳过
- [x] 能对应到唯一成员的单人衣装静图已挂到时期页；双人、告知图、贩卖图跳过
- [x] 新图在 `db/r2_manifest.json`，公开地址字节数与 md5 一致
- [x] 只推送本分支；未合并 main，未部署

## 状态

待验收。明细见 `docs/tasks/039-result.md`。
