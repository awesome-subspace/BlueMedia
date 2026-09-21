---
title: "恢复一个暂停的活动"
excerpt: "恢复一个暂停的活动，从剩下的收件人继续。"
---

`POST /v1/broadcasts/{id}/resume`

恢复一个暂停的活动，从剩下的收件人继续。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`messages:send`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 群发活动 ID，`bc_...` |


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

只对 paused 有效。恢复会清掉 pauseReason；已经 failed 的收件人不会被重发（要重发请对这批号码新建一个活动）。
