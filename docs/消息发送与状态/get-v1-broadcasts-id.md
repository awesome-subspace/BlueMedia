---
title: "单个活动"
excerpt: "单个活动：状态、预估费用、派发进度与投递结果。"
---

`GET /v1/broadcasts/{id}`

单个活动：状态、预估费用、派发进度与投递结果。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`messages:read`。API Key 的可访问资源由当前授权范围决定。

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
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

#### dispatch 与 delivery 是两个不同的口径
`dispatch` 是**派发**进度（pending / dispatching / queued / failed / skipped / canceled）——「有没有把这条消息交出去」。`delivery` 是**投递**结果，按 messages.status 聚合（accepted / sending / sent / delivered / read / failed）——「WhatsApp 那边怎么样了」。

`dispatch.failed` 是派发本身失败（比如号码被停用），`delivery.failed` 是 Meta 拒绝或投递失败，两者不相等也不该相加。

#### status = completed 不代表都送到了
completed 只表示「所有收件人都已交给发送链路」。投递结果是异步回来的，要看 `delivery` 计数；失败的消息会按既有规则自动冲正扣费。
