---
title: "停用端点并保留历史记录"
excerpt: "停用端点并保留历史记录。"
---

`DELETE /v1/webhook-endpoints/{id}`

停用端点并保留历史记录。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 回调端点 ID，`whe_...` |


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

语义是停用（disable），不是物理删除——历史投递记录保留，端点状态变更但行仍存在，方便审计和排障时回看曾经投递到该地址的记录。
