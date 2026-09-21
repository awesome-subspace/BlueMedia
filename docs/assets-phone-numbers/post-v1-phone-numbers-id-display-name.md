---
title: "提交新的显示名称"
description: "提交新的显示名称并进入 Meta 审核。"
---

`POST /v1/phone-numbers/{id}/display-name`

提交新的显示名称并进入 Meta 审核。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`phone_numbers:manage`。API Key 的可访问资源由当前授权范围决定。

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
| `newDisplayName` | string | 是 | 新的显示名称 |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "newDisplayName": {
      "type": "string",
      "description": "string · 必填 — 新的显示名称"
    }
  },
  "required": [
    "newDisplayName"
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

提交后进入 Meta 审核，不会立即生效在当前会话/聊天列表中显示。审核通过（收到显示名更新 webhook）后必须重新调用 register 才能把新名称同步到 WhatsApp 服务端；在审核通过前重复提交或再次 register 无效果。30 天内最多改名 10 次。
