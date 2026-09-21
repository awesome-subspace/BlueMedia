---
title: "修改 Flow 的名称 / 分类 / 数据交换端点"
excerpt: "修改 Flow 的名称 / 分类 / 数据交换端点。"
---

`PATCH /v1/flows/{id}`

修改 Flow 的名称 / 分类 / 数据交换端点。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`templates:manage`。API Key 的可访问资源由当前授权范围决定。

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
| `wabaId` | string | 是 | 归属校验用；Flow 不在平台库里，flowId 是 Meta 侧全局 id |
| `name` | string | 否 | 新名称 |
| `categories` | array | 否 | 不传保持原值；传则至少一个 |
| `endpointUri` | string | 否 | 数据交换端点 URL |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "wabaId": {
      "type": "string",
      "description": "string · 必填 — 归属校验用；Flow 不在平台库里，flowId 是 Meta 侧全局 id"
    },
    "name": {
      "type": "string",
      "description": "string · 可选 — 新名称"
    },
    "categories": {
      "type": "string",
      "description": "array · 可选 — 不传保持原值；传则至少一个"
    },
    "endpointUri": {
      "type": "string",
      "description": "string · 可选 — 数据交换端点 URL"
    }
  },
  "required": [
    "wabaId"
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

**已发布的 Flow 改不了**（Meta 拒绝），只有 DRAFT 可改。Flow JSON 不在这里改 —— 用 `POST /v1/flows/{id}/json`。
