---
title: "读取单个端点"
description: "读取单个端点。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--get">GET</span><code class="endpoint-path">/v1/webhook-endpoints/{id}</code></div>

读取单个端点。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 回调端点 ID，`whe_...` |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

同样不返回 secret；跨账户访问返回 404 而非 403，避免暴露资源存在与否。
