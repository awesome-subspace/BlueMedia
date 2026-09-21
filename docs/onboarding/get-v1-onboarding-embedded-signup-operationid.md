---
title: "查询步骤、错误和已落地资产"
description: "查询步骤、错误和已落地资产；ID 为 onb_...。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--get">GET</span><code class="endpoint-path">/v1/onboarding/embedded-signup/{operationId}</code></div>

查询步骤、错误和已落地资产；ID 为 onb_...。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`onboarding:read`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `operationId` | path | 是 | string | 接入操作 ID，`onb_...` |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

返回完整的 steps 数组（每一步的 id、status，用于渲染进度条）与 lastError/lastErrorCode 等字段，是诊断"卡在哪一步"最直接的入口；operationId 格式（`onb_` 前缀 + UUIDv7）不匹配会直接 400，请求根本不会打到数据库层，避免拿一个随手编的 id 去探测系统。
