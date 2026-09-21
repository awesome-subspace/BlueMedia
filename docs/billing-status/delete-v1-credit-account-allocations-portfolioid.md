---
title: "取消某个 Business Portfolio 的预算上限"
description: "取消某个 Business Portfolio 的预算上限，之后只受账户余额约束。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--delete">DELETE</span><code class="endpoint-path">/v1/credit-account/allocations/{portfolioId}</code></div>

取消某个 Business Portfolio 的预算上限，之后只受账户余额约束。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`billing:read`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `portfolioId` | path | 是 | string | 平台内 Business Portfolio ID，`bm_...` |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

和“设为 0”是**相反**的意思：0 是冻结这个 Portfolio，删除是不再对它单独设限。没有分配记录时返回 404。

已经发生的消费流水不会被删——账本是只增的，`spentMinor` 只是不再有上限与之比较。
