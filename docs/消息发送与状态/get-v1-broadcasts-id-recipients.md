---
title: "收件人明细"
excerpt: "收件人明细。status 过滤用来直接拉「哪些人失败了」。"
---

`GET /v1/broadcasts/{id}/recipients`

收件人明细。status 过滤用来直接拉「哪些人失败了」。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`messages:read`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string |  |
| `status` | query | 否 | string |  |
| `limit` | query | 否 | string |  |


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

status 取值同 dispatch 计数的键（pending / dispatching / queued / failed / skipped / canceled）。limit 默认 200、夹在 1–1000。每行的 `messageId` 指向 messages，投递状态与失败码从 GET /v1/messages/{id} 读——本表不重复维护投递状态。
