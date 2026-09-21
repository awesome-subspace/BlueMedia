---
title: "查询最近操作"
description: "查询最近操作；limit 为 1 至 50。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--get">GET</span><code class="endpoint-path">/v1/onboarding/embedded-signup</code></div>

查询最近操作；limit 为 1 至 50。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`onboarding:read`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `limit` | query | 否 | integer 1..50 | 默认 20。**超出范围返回 `400 VALIDATION_FAILED`**，不是夹取 |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

按创建时间倒序返回该账户最近的 operation 摘要列表（不含逐步骤详情，只有单条查询的 GET /{operationId} 才展开完整 steps 数组）；limit 越界（<1 或 >50）会被静默夹到 1–50 区间而不是报 400 或忽略，调用方不需要自己做边界处理。
