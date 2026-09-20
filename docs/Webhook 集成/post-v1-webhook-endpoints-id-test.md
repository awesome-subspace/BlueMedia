---
title: "发一条测试事件"
excerpt: "发一条测试事件（与 verify 同一机制）。"
---

`POST /v1/webhook-endpoints/{id}/test`

发一条测试事件（与 verify 同一机制）。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string |  |


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `201` | Created |
| `202` | Accepted |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

刻意复用 `webhook.verification` 挑战而不是另造一种「测试事件」：测试真正要回答的就是「这个地址能不能收、能不能验签」，而挑战本来就在验证这件事。另开一条路径的代价是「测试通过但真实投递失败」（或反之）这种最难排查的状态。因此本接口与 `/verify` 行为一致，也会推进状态。
