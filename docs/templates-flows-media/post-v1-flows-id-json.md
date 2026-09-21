---
title: "上传 / 替换 Flow JSON"
description: "上传 / 替换 Flow JSON（整份替换）。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--post">POST</span><code class="endpoint-path">/v1/flows/{id}/json</code></div>

上传 / 替换 Flow JSON（整份替换）。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`templates:manage`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | Meta 侧的 Flow id |

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `wabaId` | string | 是 | 归属校验用 |
| `flowJson` | string | 是 | Flow JSON 整份（字符串），上限 10MB |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "wabaId": {
      "type": "string",
      "description": "string · 必填 — 归属校验用"
    },
    "flowJson": {
      "type": "string",
      "description": "string · 必填 — Flow JSON 整份（字符串），上限 10MB"
    }
  },
  "required": [
    "wabaId",
    "flowJson"
  ]
}
```

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

Meta 侧这个接口要求 multipart form-data，且三个字段的值是固定的（`name=flow.json`、`asset_type=FLOW_JSON`）。平台收 JSON 字符串、内部拼 multipart —— 让调用方自己发 multipart 只是多一种拼错的方式。

同 create：**响应里的 `validation_errors` 要看**，它不影响 HTTP 状态码。
