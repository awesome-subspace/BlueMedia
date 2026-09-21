---
title: "新增或覆盖号码消息路由配置"
description: "新增或覆盖号码消息路由配置。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--put">PUT</span><code class="endpoint-path">/v1/phone-numbers/{id}/messaging-config</code></div>

新增或覆盖号码消息路由配置。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 平台内号码 ID，`pn_...` |

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `inboundEndpointId` | string | 否 | 入站消息端点 |
| `statusEndpointId` | string | 否 | 状态回执端点 |
| `defaultCountry` | string | 否 | 默认国家 |
| `throughputLimit` | number | 否 | 吞吐限制 |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "inboundEndpointId": {
      "type": "string",
      "description": "string · 可选 — 入站消息端点"
    },
    "statusEndpointId": {
      "type": "string",
      "description": "string · 可选 — 状态回执端点"
    },
    "defaultCountry": {
      "type": "string",
      "description": "string · 可选 — 默认国家"
    },
    "throughputLimit": {
      "type": "string",
      "description": "number · 可选 — 吞吐限制"
    }
  }
}
```

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

### 200 响应 Schema

```json
{
  "$ref": "#/components/schemas/MessagingConfig"
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

纯平台内部配置，与 Meta 无关，不产生任何 Cloud API 调用；throughputLimit 是本地限流数值，不等于 Meta 侧的吞吐等级字段。
