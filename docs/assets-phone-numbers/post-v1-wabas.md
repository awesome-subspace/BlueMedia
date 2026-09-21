---
title: "手工创建 WABA 记录"
description: "手工创建 WABA 记录。"
---

`POST /v1/wabas`

手工创建 WABA 记录。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `portfolioId` | string | 是 | 所属 bm_... |
| `name` | string | 是 | WABA 名称 |
| `timezone` | string | 否 | 时区 |
| `defaultCurrency` | string | 否 | 币种 |
| `metaWabaId` | string | 否 | Meta WABA ID |

Content-Type：`application/json`
示例：

```json
{
  "portfolioId": "bm_x",
  "name": "Acme 组合",
  "metaWabaId": "<waba_id>"
}
```

Schema：

```json
{
  "type": "object",
  "properties": {
    "portfolioId": {
      "type": "string",
      "description": "string · 必填 — 所属 bm_..."
    },
    "name": {
      "type": "string",
      "description": "string · 必填 — WABA 名称"
    },
    "timezone": {
      "type": "string",
      "description": "string · 可选 — 时区"
    },
    "defaultCurrency": {
      "type": "string",
      "description": "string · 可选 — 币种"
    },
    "metaWabaId": {
      "type": "string",
      "description": "string · 可选 — Meta WABA ID"
    }
  },
  "required": [
    "portfolioId",
    "name"
  ],
  "example": {
    "portfolioId": "bm_x",
    "name": "Acme 组合",
    "metaWabaId": "<waba_id>"
  }
}
```

## 响应

| 状态码 | 说明 |
| --- | --- |
| `201` | Created |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

同样属于手工兜底路径；正常情况下 WABA 应该通过 Embedded Signup 自动创建，或者随后台从 Meta 同步资产时自动补建。会校验 portfolioId 确实归属当前账户，不属于或不存在都返回 404；创建时如果带上了 metaWabaId，平台会同步维护一份跨账户的反查索引（`meta_resource_index`）——这个索引是入站 webhook 处理链路的关键依赖：Meta 推来的 webhook payload 里只有 Meta 自己的 WABA id，平台靠这份索引才能反查出这条消息该落到哪个 tenant/portfolio 下，缺了这一步整条 webhook 处理就会失去归属。
