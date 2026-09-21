---
title: "清零未读计数"
description: "清零未读计数；不会向 WhatsApp 发送已读回执(那需要 POST /v1/messages/read)。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--post">POST</span><code class="endpoint-path">/v1/conversations/{id}/read</code></div>

清零未读计数；不会向 WhatsApp 发送已读回执(那需要 POST /v1/messages/read)。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`messages:read`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 会话 ID，`conv_...` |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

仅清零平台本地未读计数，是纯本地操作，不产生任何出站请求；如果要让 WhatsApp 侧显示"已读"回执给对方用户，必须另外调用 POST /v1/messages/read，两者互不联动、需要客户端分别调用。
