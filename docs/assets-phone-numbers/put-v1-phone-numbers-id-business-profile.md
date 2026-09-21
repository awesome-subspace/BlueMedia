---
title: "新增或覆盖号码商业资料"
description: "新增或覆盖号码商业资料。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--put">PUT</span><code class="endpoint-path">/v1/phone-numbers/{id}/business-profile</code></div>

新增或覆盖号码商业资料。

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
| `about` | string | 否 | 简介 |
| `description` | string | 否 | 详细描述 |
| `address` | string | 否 | 地址 |
| `email` | string | 否 | 联系邮箱 |
| `websites` | string[] | 否 | 网站列表 |
| `vertical` | string | 否 | 行业 |
| `profilePictureUrl` | string | 否 | 头像地址 |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "about": {
      "type": "string",
      "description": "string · 可选 — 简介"
    },
    "description": {
      "type": "string",
      "description": "string · 可选 — 详细描述"
    },
    "address": {
      "type": "string",
      "description": "string · 可选 — 地址"
    },
    "email": {
      "type": "string",
      "description": "string · 可选 — 联系邮箱"
    },
    "websites": {
      "type": "string",
      "description": "string[] · 可选 — 网站列表"
    },
    "vertical": {
      "type": "string",
      "description": "string · 可选 — 行业"
    },
    "profilePictureUrl": {
      "type": "string",
      "description": "string · 可选 — 头像地址"
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
  "$ref": "#/components/schemas/BusinessProfile"
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

覆盖式写入本地商业资料记录，不调用 Meta 的 Business Profile API 同步头像/简介/网站等字段，纯平台侧持久化，需自行保证与 Meta 端实际资料一致。
