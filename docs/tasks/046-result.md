# 046 结果：日历页改版

SCHEDULE / 日历去掉了「有公演的月份」药丸墙和类型筛选药丸。年月用原生 `<input type="month">`，界面显示为「YYYY年M月」，旁边是 ‹ / › 和「今天」。

## 行为

- 桌面（≥761px）：七列格子高度固定。今天的日期是粉色实心圆（选中时再加一圈）。有公演的日子淡粉底。每场一条：36px 方形封面 + 类型标签 + 单行省略标题。封面与 LIVE 卡片同一来源（`cover`，否则 `images[0]`），没有图时用 🎤 占位。点公演进入 `lives.html?l=<id>`。点日期，或一天超过 2 场时的 `+N`，在网格下方打开当天列表。
- 手机（≤760px）：格子里只放最多 3 张小封面（没有图则用类型色点）和场数，标题不再拆成一字一行。点日期后，网格下方列出封面、标题、类型、会场和时间，同样链到 `lives.html?l=<id>`。
- 默认选中：这个月含今天就选今天，否则选本月第一场，否则选 1 日。今天按日本时间。

## 计数

- 公演 872 场。与 LIVE 卡片同源、能出封面的 708 场；没有图的 164 场走占位。
- 2026-10 共 9 场，9 场都有封面。全库同一天最多 2 场（25 天），两场并排时格子高度仍是 112px。
- `python3 db/export.py --check` 通过。版本 `e95a0445`（上一版 `fe9b63df`）。数据 JSON 没有改。

## 截图

本地 Chrome 打开 `calendar.html?m=2026-10`（今天 2026-10-27 选中）：

- 桌面 1280：`/opt/cursor/artifacts/calendar-after-desktop-1280.png`
- 手机 390：`/opt/cursor/artifacts/calendar-after-mobile-390.png`
- 手机点 10 月 13 日后的当天列表：`/opt/cursor/artifacts/calendar-after-mobile-390-agenda.png`

核对过：点 27 日封面进入 `lives.html?l=23`（HEROINES HALLOWEEN 2026 DAY1（出演））；上月、今天、年月输入、点日期换列表都正常。390 宽没有横向溢出。未合并、未部署。

## 点击修复

年月药丸整块点击会调用 `input.showPicker()`（失败时仍把点击交给铺满药丸的原生指示条）。手机上的小封面改成 `<a href="lives.html?l=<id>">`，点空白处或日期数字仍只选中当天。桌面公演条和当天列表链接不变。

核对：桌面和 390 宽点「2026年10月」正中，`showPicker()` 成功且月份面板保持打开；选月后网格跟着变。390 宽点 10 月 27 日小封面进入 `lives.html?l=23`。点日期数字只改 `?d=`，不离开日历。12 月 31 日两张小封面分别指向两场。

- 月份面板：`/opt/cursor/artifacts/calendar-month-picker-desktop.png`、`/opt/cursor/artifacts/calendar-month-picker-mobile.png`
- 手机小封面进详情：`/opt/cursor/artifacts/calendar-mobile-thumb-live.png`

## 年份快捷

月份条旁边加了「« 上一年」「下一年 »」。跳到同一月的上一年或下一年，超出收录范围就停在最早或最晚有数据的月份（2020-06 … 2027-04）。已经在两端时，对应按钮变灰、不能再点。‹ ›、「今天」和年月选择器仍在，没有月份药丸墙。

核对：2026-10 的上一年是 2025-10，下一年收到 2027-04。2020-08 的上一年收到 2020-06。390 宽按钮换行，没有横向溢出。

- 桌面：`/opt/cursor/artifacts/calendar-year-desktop-1280.png`
- 手机：`/opt/cursor/artifacts/calendar-year-mobile-390.png`

PR：https://github.com/yyyyfan/ilifefan/pull/8（版本 `e95a0445`）
