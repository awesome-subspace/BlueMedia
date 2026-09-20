---
title: "读取 WABA 的 Flow 列表"
excerpt: "读取 WABA 的 Flow 列表；wabaId 必填。"
---

`GET /v1/flows`

读取 WABA 的 Flow 列表；wabaId 必填。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `wabaId` | query | 是 | string |  |


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

平台不做 Flow 的本地存储，这里读的是 Meta 侧该 WABA 下的 Flow 列表；wabaId 必须是该账户名下的 WABA，否则 404。发送 Flow 消息走 POST /v1/messages 的 type=interactive + action.flow，这里查到的 id 直接作为该字段的引用。
