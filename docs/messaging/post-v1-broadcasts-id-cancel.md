---
title: "取消活动"
description: "取消活动，并把尚未派发的收件人一次性作废。不可恢复。"
---

`POST /v1/broadcasts/{id}/cancel`

取消活动，并把尚未派发的收件人一次性作废。不可恢复。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`messages:send`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 群发活动 ID，`bc_...` |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

返回 `canceledRecipients`（被作废的待派发人数）。已经派发出去的消息无法撤回——WhatsApp 没有撤回接口，那些消息该送到还是会送到，也照常计费。
