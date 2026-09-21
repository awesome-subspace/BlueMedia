---
title: "总览页计数看板"
description: "总览页计数看板：platform 返回全量账户/资产计数；tenant 返回当前授权范围计数(号码计数需 phone_numbers:read，否则省略该字段)。"
---

`GET /v1/overview/counts`

总览页计数看板：platform 返回全量账户/资产计数；tenant 返回当前授权范围计数(号码计数需 phone_numbers:read，否则省略该字段)。

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

不是拿列表接口的返回长度算出来的，是每张资产表单独 COUNT(*) 的专用只读模型，避免总览页要把全量列表拉回来只读长度。tenant 视角会镜像各列表接口自己的可见性规则，保证这个数字永远和列表页实际展示的一致。
