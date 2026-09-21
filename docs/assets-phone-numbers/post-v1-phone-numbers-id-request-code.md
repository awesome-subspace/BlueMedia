---
title: "请求 SMS/VOICE 验证码"
description: "请求 SMS/VOICE 验证码。"
---

`POST /v1/phone-numbers/{id}/request-code`

请求 SMS/VOICE 验证码。

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
| `codeMethod` | SMS \| VOICE | 是 | 验证码发送方式 |
| `language` | string | 否 | 默认 en_US |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "codeMethod": {
      "type": "string",
      "description": "SMS | VOICE · 必填 — 验证码发送方式"
    },
    "language": {
      "type": "string",
      "description": "string · 可选 — 默认 en_US"
    }
  },
  "required": [
    "codeMethod"
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

是号码验证流程的第一步，用于尚未通过所有权验证的号码获取验证码；若号码已验证再调用会被 Meta 拒绝。与 register 是两条独立流程：request-code + verify-code 验证的是号码所有权，register 才是接入 Cloud API，二者顺序不由本接口强制，需业务方按状态自行判断。
