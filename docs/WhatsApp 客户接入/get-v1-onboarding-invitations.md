---
title: "列出当前账户已发出的邀请及其状态"
excerpt: "列出当前账户已发出的邀请及其状态，不回显 Token。"
---

`GET /v1/onboarding/invitations`

列出当前账户已发出的邀请及其状态，不回显 Token。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`onboarding:read`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `limit` | query | 否 | string |  |


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

`limit` 越界（超出 1–100）会被静默夹紧到边界值而非报错；列表按创建时间倒序排列，并始终限制在当前账户的授权范围内。响应体不含 Token 哈希或明文，无法从列表反推出可用的邀请链接。
