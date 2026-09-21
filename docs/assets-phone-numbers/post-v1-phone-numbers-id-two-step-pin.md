---
title: "设置或轮换两步验证 PIN"
description: "设置或轮换两步验证 PIN。"
---

`POST /v1/phone-numbers/{id}/two-step-pin`

设置或轮换两步验证 PIN。

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
| `pin` | string | 是 | 6 位数字 |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "pin": {
      "type": "string",
      "description": "string · 必填 — 6 位数字"
    }
  },
  "required": [
    "pin"
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

Meta 侧没有关闭两步验证的 API（只能在 WhatsApp Manager 手动关闭），本接口只能设置新 PIN 不能禁用；忘记旧 PIN 时可直接用本接口设新值覆盖，无需先验证旧 PIN。
