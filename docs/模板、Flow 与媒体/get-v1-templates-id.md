---
title: "读取模板详情"
excerpt: "读取模板详情。"
---

`GET /v1/templates/{id}`

读取模板详情。

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
| `4xx` | 客户端错误 |

### 200 响应 Schema

```json
{
  "$ref": "#/components/schemas/MessageTemplate"
}
```

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

纯读本地行，不外呼 Meta；用于发送前确认 status=APPROVED，POST /v1/messages 用同名同语言的模板发送前也会做这个校验，未过审会被拒。
