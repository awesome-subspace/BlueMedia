---
title: "Portfolio 预算"
description: "给单个 Business Portfolio 设置预算上限。它不是第二个钱包——调整预算不改变账户总余额。null 是不限额，0 是冻结。"
---

# Portfolio 预算

账户只有一个总余额；每个 Business Portfolio 可以在这个余额之上设置独立的**预算上限**。它不是第二个钱包——调整预算不会改变账户总余额，也没有「转入」或「转回」的动作。

| 接口 | 用途 |
| --- | --- |
| [预算总览](get-v1-credit-account-allocations.md) | 各 Portfolio 的上限、已花、已预留与剩余。 |
| [设置预算上限](put-v1-credit-account-allocations-portfolioid.md) | 给某个 Portfolio 设上限。 |
| [取消预算上限](delete-v1-credit-account-allocations-portfolioid.md) | 取消上限，恢复为不限额。 |
| [预算对账](get-v1-credit-account-allocations-audit.md) | 核对预算与实际消费。 |

:::warning

`allocatedMinor` 的两个取值意思**相反**，别混用：`null` 是**不限额**（没设过上限，只受账户余额约束），`0` 是**冻结**（这个 Portfolio 一分钱都不能花）。

剩余额度 = `allocatedMinor − spentMinor − reservedMinor`，其中 `reservedMinor` 是已发出、尚未结算的冻结部分。

:::

预算用完时发送以 `402 BM_BUDGET_EXCEEDED` 失败，账户总余额不足则是 `INSUFFICIENT_FUNDS`——两者含义不同，要根据错误码决定是调预算还是补账户额度。各 Portfolio 上限之和**允许**超过账户余额（`overAllocated: true` 只是提示），真实消费按账户剩余余额先到先得。详见[账务与信用额度](../guides/billing.md)。
