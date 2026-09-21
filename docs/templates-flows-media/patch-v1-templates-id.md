---
title: "编辑模板"
description: "编辑模板。改完 Meta 会重新审核，本地状态回到 PENDING。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--patch">PATCH</span><code class="endpoint-path">/v1/templates/{id}</code></div>

编辑模板。改完 Meta 会重新审核，本地状态回到 PENDING。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`templates:manage`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 平台内模板 ID，`tmpl_...` |

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `components` | array | 否 | 新的组件数组（整份替换） |
| `category` | MARKETING \| UTILITY \| AUTHENTICATION | 否 | 新类别 |
| `parameterFormat` | positional \| named | 否 | 参数占位符风格 |
| `allowCategoryChange` | boolean | 否 | 允许 Meta 在审核时重新归类（避免因类别不符被拒） |
| `messageSendTtlSeconds` | integer | 否 | 用该模板发送的消息的 TTL |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "components": {
      "type": "string",
      "description": "array · 可选 — 新的组件数组（整份替换）"
    },
    "category": {
      "type": "string",
      "description": "MARKETING | UTILITY | AUTHENTICATION · 可选 — 新类别"
    },
    "parameterFormat": {
      "type": "string",
      "description": "positional | named · 可选 — 参数占位符风格"
    },
    "allowCategoryChange": {
      "type": "string",
      "description": "boolean · 可选 — 允许 Meta 在审核时重新归类（避免因类别不符被拒）"
    },
    "messageSendTtlSeconds": {
      "type": "string",
      "description": "integer · 可选 — 用该模板发送的消息的 TTL"
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
  "$ref": "#/components/schemas/MessageTemplate"
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

#### 只有 APPROVED / REJECTED 能改
PENDING 的模板正在审核，改它会被 Meta 拒 —— 我们本地先挡并返回 409，让你看到「等审核结果」而不是一个含糊的上游错误。

#### 改完状态会回到 PENDING
Meta 对编辑后的模板**重新审核**。所以本地状态被打回 `PENDING`、上一次的拒绝原因被清空 —— 如果继续显示「已通过」，你会以为现在就能发，而实际会被拒。审核结果仍由 `message_template_status_update` webhook 回填。

#### 改不了 name 和 language
Meta 的编辑接口里没有这两个字段，要换名字只能新建模板。请求体是 `.strict()` 的：传了它们会 400，而不是被默默忽略。

本地没有 Meta template id 的模板（没同步过）会返回 409，先调 `POST /v1/templates/sync`。
