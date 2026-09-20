---
title: "删除 Flow"
excerpt: "删除 Flow。**仅 DRAFT 可删**；已发布的请用 deprecate。"
---

`DELETE /v1/flows/{id}`

删除 Flow。**仅 DRAFT 可删**；已发布的请用 deprecate。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`templates:manage`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string |  |
| `wabaId` | query | 是 | string |  |


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `204` | No Content |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](/docs/error-codes)。
