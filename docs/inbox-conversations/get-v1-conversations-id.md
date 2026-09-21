---
title: "单个会话线程"
excerpt: "单个会话线程：会话信息 + 最近的入站/出站合并消息。"
---

`GET /v1/conversations/{id}`

单个会话线程：会话信息 + 最近的入站/出站合并消息。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`messages:read`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 会话 ID，`conv_...` |
| `limit` | query | 否 | integer 1..200 | 返回的消息条数，默认 50。超出范围夹取；无法解析时忽略 |


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

返回的合并消息列表是把入站（webhook 落库）和出站（发送时落库）两张来源在同一线程里按时间合并展示；limit 同样夹在 1–200，超出该会话所属账户的记录返回 404（而不是 403），避免暴露资源是否存在。出站消息携带 `status`/`errorCode`/`errorMessage`，失败的出站消息额外带与 `GET /v1/messages/{id}` 同一份的 `stage` 和结构化 `error`（策略码、metaCode、retryable、customerAction），入站消息的这几个字段恒为 null。
