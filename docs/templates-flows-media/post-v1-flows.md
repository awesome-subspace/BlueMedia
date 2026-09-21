---
title: "创建 Flow"
description: "创建 Flow（可同时上传 Flow JSON 并直接发布）。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--post">POST</span><code class="endpoint-path">/v1/flows</code></div>

创建 Flow（可同时上传 Flow JSON 并直接发布）。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`templates:manage`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `wabaId` | string | 是 | 内部 WABA id（waba_...） |
| `name` | string | 是 | Flow 名称 |
| `categories` | array | 是 | 至少一个：SIGN_UP / SIGN_IN / APPOINTMENT_BOOKING / LEAD_GENERATION / CONTACT_US / CUSTOMER_SUPPORT / SURVEY / OTHER |
| `flowJson` | string | 否 | Flow JSON 整份（字符串）。省略则建空 Flow，之后用 POST /v1/flows/{id}/json 上传 |
| `publish` | boolean | 否 | 建完直接发布。**发布不可逆**，默认 false |
| `cloneFlowId` | string | 否 | 从已有 Flow 克隆（需有访问权限） |
| `endpointUri` | string | 否 | 数据交换端点 URL（Flow JSON 3.0 起只能通过 API 指定） |

Content-Type：`application/json`
示例：

```json
{
  "wabaId": "waba_x",
  "name": "预约登记",
  "categories": [
    "APPOINTMENT_BOOKING"
  ]
}
```

Schema：

```json
{
  "type": "object",
  "properties": {
    "wabaId": {
      "type": "string",
      "description": "string · 必填 — 内部 WABA id（waba_...）"
    },
    "name": {
      "type": "string",
      "description": "string · 必填 — Flow 名称"
    },
    "categories": {
      "type": "string",
      "description": "array · 必填 — 至少一个：SIGN_UP / SIGN_IN / APPOINTMENT_BOOKING / LEAD_GENERATION / CONTACT_US / CUSTOMER_SUPPORT / SURVEY / OTHER"
    },
    "flowJson": {
      "type": "string",
      "description": "string · 可选 — Flow JSON 整份（字符串）。省略则建空 Flow，之后用 POST /v1/flows/{id}/json 上传"
    },
    "publish": {
      "type": "string",
      "description": "boolean · 可选 — 建完直接发布。**发布不可逆**，默认 false"
    },
    "cloneFlowId": {
      "type": "string",
      "description": "string · 可选 — 从已有 Flow 克隆（需有访问权限）"
    },
    "endpointUri": {
      "type": "string",
      "description": "string · 可选 — 数据交换端点 URL（Flow JSON 3.0 起只能通过 API 指定）"
    }
  },
  "required": [
    "wabaId",
    "name",
    "categories"
  ],
  "example": {
    "wabaId": "waba_x",
    "name": "预约登记",
    "categories": [
      "APPOINTMENT_BOOKING"
    ]
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

#### 一定要读响应里的 validation_errors
Flow JSON 有问题时 Meta **照样返回成功和一个 flow id**，只把校验错误放在 `validation_errors` 数组里（每条带行列号与 JSON 路径）。把响应当成「建好了」就会得到一个发不出去的 Flow。

#### 发布是一道单向门
`publish: true` 或之后调 `/publish` 之后，这个 Flow **不能再修改、也不能删除**，只能 `deprecate`。所以建议先建草稿、预览确认，再发布。
