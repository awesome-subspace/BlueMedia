---
title: "我的售价策略"
description: "我的售价策略（含历史生效记录）。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--get">GET</span><code class="endpoint-path">/v1/pricing/tariff</code></div>

我的售价策略（含历史生效记录）。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。本端点当前**不强制额外 scope**（任意有效 API Key 均可调用）；它读的是本账户自己的计费口径，建议仍用带 `billing:read` 的 Key 调用。API Key 的可访问资源由当前授权范围决定。

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

返回策略类型、币种、生效日与说明；`FIXED` 策略下带合同单价（那是客户合同里的数字，本来就该看得见）。**不含 `markupBps`**。
