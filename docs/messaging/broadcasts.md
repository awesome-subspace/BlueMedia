---
title: "群发 Broadcasts"
excerpt: "创建并管理批量模板消息活动。群发在创建时就按总成本试算额度，不足即拒绝，不会发一半停下。"
---

# 群发 Broadcasts

把一个模板消息批量派发给一批收件人，并在派发过程中暂停、恢复或取消。

群发在**创建时**就按总成本试算额度：账户余额或 Business Portfolio 预算不够就直接拒绝整个活动，不会发出一半再停下。

| 接口 | 用途 |
| --- | --- |
| [创建群发](post-v1-broadcasts.md) | 提交模板、收件人名单与参数，创建一个活动。 |
| [列出群发活动](get-v1-broadcasts.md) | 当前账户的活动列表及各自状态。 |
| [活动详情](get-v1-broadcasts-id.md) | 单个活动的进度与汇总计数。 |
| [收件人明细](get-v1-broadcasts-id-recipients.md) | 逐个收件人的投递状态与失败原因。 |
| [暂停派发](post-v1-broadcasts-id-pause.md) | 停止继续派发，已提交的消息不受影响。 |
| [恢复活动](post-v1-broadcasts-id-resume.md) | 让一个已暂停的活动继续派发。 |
| [取消活动](post-v1-broadcasts-id-cancel.md) | 终止活动，剩余收件人不再派发。 |

群发只能发已审核通过的模板消息，因此不受 24 小时客服窗口限制。额度预留与冲回的规则与单条消息一致，见[账务与信用额度](../guides/billing.md)。
