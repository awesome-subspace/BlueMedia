---
title: "删除模板"
excerpt: "删除模板，返回 204。"
---

`DELETE /v1/templates/{id}`

删除模板，返回 204。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`templates:manage`。API Key 的可访问资源由当前授权范围决定。

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
| `204` | No Content |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

删除会先外呼 Meta 按名称删除模板（Meta 语义是按名称删除该 WABA 下所有语言版本），成功后才删本地行；Meta 调用失败则整个操作失败，不会留下本地行已删但 Meta 侧仍存在（或反之）的不一致态。
