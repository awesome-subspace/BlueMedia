---
title: "列出模板及最新审核状态"
description: "列出模板及最新审核状态。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--get">GET</span><code class="endpoint-path">/v1/templates</code></div>

列出模板及最新审核状态。

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
    "$ref": "#/components/schemas/MessageTemplate"
  }
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

查询参数 `wabaId` 用于只返回指定 WABA 的模板，必须传入当前 API Key 授权范围内的 WABA。返回本地保存的模板记录（含最近一次已知的审核 `status`），不是每次都实时查询 Meta；如果 Meta 侧状态已变但对应回调尚未处理，这里可能短暂滞后。
