---
title: "转化事件上报"
description: "把「点击进入 WhatsApp」广告带来的成交回报给 Meta，让广告后台能算出转化。需要 Business Portfolio 已绑定 Pixel。"
---

# 转化事件上报

从「点击进入 WhatsApp」（CTWA）广告点进来的客户，其第一条消息里带着广告点击 id，平台会存下来。要让 Meta 广告后台算出这条广告带来了多少成交，需要把转化事件回报给 Meta。

| 接口 | 用途 |
| --- | --- |
| [上报转化事件](post-v1-conversions-events.md) | 回报一次成交/加购等转化，关联到对应的广告点击。 |
| [列出转化事件](get-v1-conversions-events.md) | 查看已上报事件及其上报状态。 |

:::info

Business Portfolio 尚未绑定 Pixel 时收到的事件不会丢——会以 `skipped` 状态存下来，[绑定 Meta Pixel](../assets-phone-numbers/post-v1-business-portfolios-id-dataset.md) 之后自动重新排队。

:::

完整的归因链路、事件字段与去重规则见[广告归因与转化上报](../guides/ctwa-attribution.md)。
