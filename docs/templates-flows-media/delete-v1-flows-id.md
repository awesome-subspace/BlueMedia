---
title: "删除 Flow"
description: "删除 Flow。**仅 DRAFT 可删**；已发布的请用 deprecate。"
---

`DELETE /v1/flows/{id}`

删除 Flow。**仅 DRAFT 可删**；已发布的请用 deprecate。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`templates:manage`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | Meta 侧的 Flow id |
| `wabaId` | query | 是 | string | 平台内 WABA ID，`waba_...`。**必填** |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。
