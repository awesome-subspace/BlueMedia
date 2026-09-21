---
title: "轮换签名密钥"
description: "轮换签名密钥，返回一次性新明文。"
---

`POST /v1/webhook-endpoints/{id}/rotate-secret`

轮换签名密钥，返回一次性新明文。

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
| `201` | Created |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

**立即生效、无重叠期**：下一条投递就用新 secret 签名。接收方在保存新 secret 之前收到的投递会验签失败，而验签失败通常表现为 4xx —— 按投递策略那是**永久失败、不重试**。所以请在低峰期轮换，或按「停用 → 轮换 → 保存 → 重新启用/验证」的顺序操作（回来的路是 `POST {id}/enable`）。明文只在本次响应出现，与创建时同一规则。
