---
title: "读取最近认证记录"
description: "读取最近认证记录；未提交过返回 404。"
---

`GET /v1/business-portfolios/{portfolioId}/certification`

读取最近认证记录；未提交过返回 404。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `portfolioId` | path | 是 | string | 平台内 Business Portfolio ID，`bm_...` |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

只读本地缓存的最近一次提交记录，**不会**主动查 Meta 的最新状态——要拿到最新状态必须显式调用 `.../certification/refresh`，这个只读接口设计成零外呼开销，适合门户页面频繁刷新展示而不担心触发 Meta 限流。
