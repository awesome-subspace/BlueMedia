---
title: "创建模板并提交 Meta 审核"
excerpt: "创建模板并提交 Meta 审核。"
---

`POST /v1/templates`

创建模板并提交 Meta 审核。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`templates:manage`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `wabaId` | string | 是 | 平台内 WABA ID |
| `name` | string | 是 | 小写字母、数字、下划线 |
| `language` | string | 是 | 如 en_US、zh_CN |
| `category` | MARKETING \| UTILITY \| AUTHENTICATION | 是 | 模板分类 |
| `components` | object[] | 是 | Meta 模板组件 |
| `parameterFormat` | positional \| named | 否 | 参数格式 |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "wabaId": {
      "type": "string",
      "description": "string · 必填 — 平台内 WABA ID"
    },
    "name": {
      "type": "string",
      "description": "string · 必填 — 小写字母、数字、下划线"
    },
    "language": {
      "type": "string",
      "description": "string · 必填 — 如 en_US、zh_CN"
    },
    "category": {
      "type": "string",
      "description": "MARKETING | UTILITY | AUTHENTICATION · 必填 — 模板分类"
    },
    "components": {
      "type": "string",
      "description": "object[] · 必填 — Meta 模板组件"
    },
    "parameterFormat": {
      "type": "string",
      "description": "positional | named · 可选 — 参数格式"
    }
  },
  "required": [
    "wabaId",
    "name",
    "language",
    "category",
    "components"
  ]
}
```


## 响应

| 状态码 | 说明 |
| --- | --- |
| `201` | Created |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

创建时按 name+language+wabaId 做本地预检重复，避免向 Meta 重复提交；components 原样转发给 Meta，不做二次校验，格式错误由 Meta 审核拒绝，不在创建阶段报错。审核结果不同步返回——创建响应里的 status 只是 Meta 当时回的初始值（通常 PENDING），真正的 APPROVED/REJECTED 由状态更新 webhook 异步回填，需要轮询 GET /v1/templates/{id} 或订阅 webhook 才能拿到终态，审核通常在 24 小时内完成。
