---
title: "提交 Meta 返回的 6 位验证码"
excerpt: "提交 Meta 返回的 6 位验证码。"
---

`POST /v1/phone-numbers/{id}/verify-code`

提交 Meta 返回的 6 位验证码。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`phone_numbers:manage`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string |  |

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `code` | string | 是 | 6 位数字 |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "code": {
      "type": "string",
      "description": "string · 必填 — 6 位数字"
    }
  },
  "required": [
    "code"
  ]
}
```


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `201` | Created |
| `202` | Accepted |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

提交上一步 request-code 收到的验证码以完成所有权验证；验证码有时效（约 10 分钟）且一次性，多次失败可能触发 Meta 侧临时限制。验证通过后号码具备被 register 的前提，但本接口不会自动触发注册，仍需显式调用 register。
