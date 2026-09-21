---
title: "读取号码当前消息路由配置"
description: "读取号码当前消息路由配置；从未配置过返回 `null`。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--get">GET</span><code class="endpoint-path">/v1/phone-numbers/{id}/messaging-config</code></div>

读取号码当前消息路由配置；从未配置过返回 `null`。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 平台内号码 ID，`pn_...` |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

### 200 响应 Schema

```json
{
  "allOf": [
    {
      "$ref": "#/components/schemas/MessagingConfig"
    }
  ],
  "nullable": true
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

理由同 business-profile 的读接口。这一条的现状比商业资料更需要看得见：`inboundEndpointId` / `statusEndpointId` 是**指向 webhook 端点的 id**，凭记忆填错不会报错，它只是把这个号码的入站消息或状态回执安静地投递到另一个端点上。纯平台内部配置，不产生任何 Cloud API 调用。
