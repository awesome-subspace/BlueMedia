---
title: "暂停派发"
description: "暂停派发。已经交给 WhatsApp 的消息追不回来。"
---

`POST /v1/broadcasts/{id}/pause`

暂停派发。已经交给 WhatsApp 的消息追不回来。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`messages:send`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 群发活动 ID，`bc_...` |

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `reason` | string | 否 | 暂停原因，会写进活动的 pauseReason |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "reason": {
      "type": "string",
      "description": "string · 可选 — 暂停原因，会写进活动的 pauseReason"
    }
  }
}
```

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

只对 scheduled / running 的活动有效，其它状态返回 409 并在 details.status 里说明当前状态。余额耗尽时平台会**自动**暂停活动并把 pauseReason 设为 insufficient credit——充值后调 resume 即可继续发剩下的人，不需要重建活动。
