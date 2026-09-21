---
title: "撤销当前账户中尚未使用的邀请"
excerpt: "撤销当前账户中尚未使用的邀请；已完成的邀请不可撤销（返回 409）。"
---

`DELETE /v1/onboarding/invitations/{id}`

撤销当前账户中尚未使用的邀请；已完成的邀请不可撤销（返回 409）。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`onboarding:write`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 邀请记录 ID，`inv_...`（不是链接里的 token） |


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

撤销的实现是一条 `WHERE status='pending'` 的条件更新，抢不到时会精确区分两种失败原因：「id 不存在」返回 404；「id 存在但状态已非 pending」返回 409，且错误信息里会带上当前实际状态（completed/failed/expired/revoked 之一），让客服/运维一眼看出这条链接是"已经被用过了"还是"已经过期了"，而不是笼统地告诉他们"撤销失败"。
