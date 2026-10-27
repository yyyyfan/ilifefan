# 043 2025–2026 ワンマン / 生誕祭演后返图

## 目标
把 2025–2026 年 `type` 为ワンマン或生誕祭的场次，挂上官方演后 / 返场舞台静图（不是只有传单或时间表）。做完时：能对上的场次详情里能翻完该帖的全部静图，封面在已有舞台照时升到 `category=live`。不合并、不部署。

## 范围
- 改：这些场次的 `image_lives`、封面 `cover_image_id`；已在库静图里属于演后舞台照、但类别还是 `member` / `other` 的，改为 `live`；没有成员标注的，`images.date` 改为演出日（JST）并重算 `image_eras`。TRAVELiFE! 2026 八场共用的告知海报（image 3391）从误标的 `live` 改回 `official`，避免挡住当日舞台照。
- 不改：取消场 123、124、125、127；首页主视觉构图；万圣节 / 特典服装任务；2024 封面批次。图片不进 Git。本轮没有新的 R2 对象：打开过的帖里，静图都已经在桶 `ilife-images` 和 `db/r2_manifest.json` 里。
- 范围内共 48 场（2025-01-08 至 2026-12-02）。其中 44 场新挂演后静图，4 场没有新的舞台照，原因见 `043-result.md`。

## 数据来源
@iLiFE_official 的演后帖。X 的正式搜索接口这次返回 `client-not-enrolled`，没有用猜的帖号。帖号来自库里已有的 `images.post_id`，以及检索页上实际出现、再经 fxtwitter 打开的地址。每条用来挂图的帖都打开过：作者是 `iLiFE_official`，正文里的日期或活动名与该场一致，帖内静图张数与库内已有文件一致。不用 Eventernote / LiveFans 的图。

抽查公开地址（已有键，不是新上传）：`python3 db/r2_images.py verify` 对 5 个键核对为 0 个问题。

## 验收标准
- [x] `python3 db/export.py --check` 通过（导出版本 `d54d9e40`）
- [x] 44 场新挂官方演后静图，共 101 条 `image_lives`；同一帖的静图全部挂上，不是只挂一张
- [x] 41 场封面从告知图 / 服装图升到演后 `category=live`；ONELiFE!、LiFESTART、MEGALiFE! 原本已是舞台照，封面保持，只补同帖其余静图
- [x] 没有新的 R2 键；图片不在 Git
- [x] 123、124、125、127 未改；741（已取消）未改
- [x] 不合并、不部署

## 状态
待验收（分支 `cursor/043-2025-2026-live-encore-photos-623a`，不合并）。

场次、帖子和仍缺的原因见 `docs/tasks/043-result.md`。
