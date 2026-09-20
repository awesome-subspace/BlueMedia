---
title: "列出当前账户的群发活动"
excerpt: "列出当前账户的群发活动，含派发进度与投递结果计数。"
---

`GET /v1/broadcasts`

列出当前账户的群发活动，含派发进度与投递结果计数。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`messages:read`。API Key 的可访问资源由当前授权范围决定。

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

limit 默认 50、上限 200。每条含 `dispatch`（派发进度）与 `delivery`（投递结果）两组计数，含义不同，见 GET /v1/broadcasts/{id}。
