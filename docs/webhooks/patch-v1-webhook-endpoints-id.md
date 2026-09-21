---
title: "局部更新端点"
description: "局部更新端点（url / events / metadata）。"
---

`PATCH /v1/webhook-endpoints/{id}`

局部更新端点（url / events / metadata）。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 回调端点 ID，`whe_...` |

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `url` | string | 否 | 新回调地址。**同样过 SSRF 校验** —— 只在创建时校验的话，改一次 url 就能绕过整道防护 |
| `events` | string[] | 否 | 替换订阅列表（整体替换，不是追加）。取值与创建时相同：`message`、`status`、`change`、`probe`、`job.completed`、`job.failed`、`usage.updated`、`webhook.verification`、`*` |
| `metadata` | object | 否 | 调用方自定义数据 |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "description": "string · 可选 — 新回调地址。**同样过 SSRF 校验** —— 只在创建时校验的话，改一次 url 就能绕过整道防护"
    },
    "events": {
      "type": "string",
      "description": "string[] · 可选 — 替换订阅列表（整体替换，不是追加）"
    },
    "metadata": {
      "type": "string",
      "description": "object · 可选 — 调用方自定义数据"
    }
  }
}
```

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

空 body 返回 400 而不是静默 200：空 patch 通常意味着字段名写错了，静默成功会让调用方以为改动生效。不返回 secret。
