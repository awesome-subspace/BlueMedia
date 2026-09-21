---
title: "删除 Business Portfolio"
description: "删除 Business Portfolio。cascade=true 时自上而下连同子对象一起删除（计费账本与信用账户不受影响，仅在有在途信用预留时返回 409）；不带该参数则保持原行为：存在子对象时返回 409。"
---

`DELETE /v1/business-portfolios/{id}`

删除 Business Portfolio。cascade=true 时自上而下连同子对象一起删除（计费账本与信用账户不受影响，仅在有在途信用预留时返回 409）；不带该参数则保持原行为：存在子对象时返回 409。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 平台内 Business Portfolio ID，`bm_...` |
| `cascade` | query | 否 | `true` | 只有字面量 `true` 触发级联删除；其它值（含省略）走默认行为——存在子对象时返回 `409`。计费账本与信用账户始终不受影响 |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `204` | No Content |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

`cascade=true` 会自上而下一次性删除该 Business Portfolio 下所有 WABA、号码及相关业务数据，但计费账本（`ledger_entries`）与信用账户状态会**始终保留**，以保证财务记录可追溯。两种删除模式都将在存在在途信用预留时拒绝删除，避免删除操作与正在处理的扣费流程冲突。
