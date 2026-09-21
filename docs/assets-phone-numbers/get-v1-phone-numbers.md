---
title: "列出号码"
description: "列出号码，可按 WABA 过滤。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--get">GET</span><code class="endpoint-path">/v1/phone-numbers</code></div>

列出号码，可按 WABA 过滤。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `wabaId` | query | 否 | string | 按 WABA 过滤，`waba_...`。省略或传空串表示不过滤 |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

### 200 响应 Schema

```json
{
  "type": "array",
  "items": {
    "$ref": "#/components/schemas/PhoneNumber"
  }
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

纯本地查询，不触达 Meta，因此 status/qualityRating 等字段是上次 PATCH 或同步时写入的快照，不代表实时状态；要拿实时状态用 registration-status。
