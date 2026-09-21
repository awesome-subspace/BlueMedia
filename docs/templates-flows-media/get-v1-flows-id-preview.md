---
title: "获取免登录的 Flow 预览链接"
description: "获取免登录的 Flow 预览链接（30 天有效）。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--get">GET</span><code class="endpoint-path">/v1/flows/{id}/preview</code></div>

获取免登录的 Flow 预览链接（30 天有效）。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | Meta 侧的 Flow id |
| `wabaId` | query | 是 | string | 平台内 WABA ID，`waba_...`。**必填** |
| `invalidate` | query | 否 | `true` | 只有字面量 `true` 生效：作废旧的预览链接并生成新的。默认不作废 |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

返回的 `preview_url` **不需要登录**，可以直接发给客户或业务方确认交互，也可以 iframe 嵌进自己的页面；30 天过期。

`?invalidate=true` 会**作废旧链接**并生成新的。默认 `false` —— 否则每次点开预览都会让之前发出去的链接失效。
