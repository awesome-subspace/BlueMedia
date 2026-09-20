---
title: "我的售价策略"
excerpt: "我的售价策略（含历史生效记录）。"
---

`GET /v1/pricing/tariff`

我的售价策略（含历史生效记录）。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`billing:read`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

返回策略类型、币种、生效日与说明；`FIXED` 策略下带合同单价（那是客户合同里的数字，本来就该看得见）。**不含 `markupBps`**。
