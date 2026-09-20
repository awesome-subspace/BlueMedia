---
title: "获取免登录的 Flow 预览链接"
excerpt: "获取免登录的 Flow 预览链接（30 天有效）。"
---

`GET /v1/flows/{id}/preview`

获取免登录的 Flow 预览链接（30 天有效）。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

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
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

返回的 `preview_url` **不需要登录**，可以直接发给客户或业务方确认交互，也可以 iframe 嵌进自己的页面；30 天过期。

`?invalidate=true` 会**作废旧链接**并生成新的。默认 `false` —— 否则每次点开预览都会让之前发出去的链接失效。
