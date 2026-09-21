---
title: "信用账户与用量"
description: "账户余额、用量费用视图与追加式账本。账户尚未开通额度时返回 404 而不是全零余额。所有金额都是最小货币单位的整数。"
---

# 信用账户与用量

话费模型是「信用账户 + 追加式账本」：发送前预留额度，Meta 受理后结算扣费，投递失败自动冲回。所有金额都是**最小货币单位的整数**（minor units）。

| 接口 | 用途 |
| --- | --- |
| [账户余额](get-v1-credit-account.md) | 币种、可用余额、预留余额三个字段。 |
| [用量与费用](get-v1-credit-account-usage.md) | 账户自助用量/费用视图，按日与按分类聚合。 |
| [账本流水](get-v1-credit-account-ledger.md) | 按时间倒序读取流水，含事件类型、方向、金额与幂等键。 |

:::warning

账户尚未开通额度时，余额接口返回 **`404`，而不是全零余额**——要用状态码区分「没开通」和「余额为零」。

用量接口里 `totalChargedCount`（净计费）与 `totalMessages`（发送量）**分母不同，不相等是正常的**，不要据此判断数据错了。真正成立的不变量是同币种下 `sum(byCategory.spentMinor) == totalSpentMinor`。

:::

账本流水的 `days` 只接受 7/30/90，其它值按 30 处理。这三个接口需要 `billing:read` scope。预留→结算→冲回的完整时序见[账务与信用额度](../guides/billing.md)。
