---
title: "从 Cloud API 注销号码"
description: "从 Cloud API 注销号码。"
---

`POST /v1/phone-numbers/{id}/deregister`

从 Cloud API 注销号码。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`phone_numbers:manage`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 平台内号码 ID，`pn_...` |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

仅使号码在 Cloud API 侧失效，**不删除号码或消息历史**；重新使用需再次 register。同样有 72 小时 10 次的限流；号码若同时用于 WhatsApp Business App 和 Cloud API（coexistence）时 Meta 会拒绝此调用。成功后本地状态硬编码为已注销。
