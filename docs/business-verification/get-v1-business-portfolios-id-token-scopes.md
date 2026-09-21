---
title: "诊断客户 Token Scopes"
excerpt: "诊断该 portfolio 的客户 Embedded Signup token 被 Meta 授予了哪些 scope（经 debug_token）。用于判断 analytics/WABA 状态的权限报错是 token 缺 whatsapp_business_management 还是平台 App 缺 Advanced Access。不回显 token 本身。"
---

`GET /v1/business-portfolios/{id}/token-scopes`

诊断该 portfolio 的客户 Embedded Signup token 被 Meta 授予了哪些 scope（经 debug_token）。用于判断 analytics/WABA 状态的权限报错是 token 缺 whatsapp_business_management 还是平台 App 缺 Advanced Access。不回显 token 本身。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`onboarding:read`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 平台内 Business Portfolio ID，`bm_...` |


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

依赖平台自身的 App ID + App Secret 配置齐全才能调用 Meta `debug_token` 接口；未配置时该诊断能力本身失效，会返回 500，而不是"该 token 没有任何 scope"的空结果，两者语义完全不同，混淆会导致误判成客户授权问题。响应除了顶层 `scopes` 数组外还回显 `granularScopes`（含每条权限具体绑定的 `targetIds`），原因是像 `whatsapp_business_management` 这类权限在 Meta 侧可能被限定到具体的 WABA/business id 范围内——只看顶层 scope 列表会漏判"这个 token 确实有这项权限，但没有覆盖到你正在操作的这个具体资产"这种更隐蔽的报错情形。
