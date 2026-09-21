---
title: "读取币种、可用余额和预留余额"
description: "读取币种、可用余额和预留余额；未配置返回 404。"
---

`GET /v1/credit-account`

读取币种、可用余额和预留余额；未配置返回 404。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

账户尚未由平台配置过额度时返回 404，不是返回全零余额——调用方要用状态码区分"没开通"和"余额为零"。
