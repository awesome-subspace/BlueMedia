---
title: "刷新 PLBV 认证"
description: "主动查询并同步该客户最新的 PLBV submission。"
---

`POST /v1/business-portfolios/{portfolioId}/certification/refresh`

主动查询并同步该客户最新的 PLBV submission。

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

服务会使用已配置的 Meta 授权查询该客户名下最新的 PLBV submission，按客户 Meta Business ID 过滤，并按更新时间取最新一条保存。若标准验证已经通过，或者客户尚未完成 Embedded Signup 且本地也没有任何 Meta 侧历史记录，会直接返回 `not_applicable`，并分别标注原因 `standard_verification_complete` 或 `embedded_signup_required`。
