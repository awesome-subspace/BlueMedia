---
title: "同步验证状态"
excerpt: "同步 Business Portfolio 的标准验证状态与 PLBV 认证状态。"
---

`POST /v1/business-portfolios/{id}/refresh-verification`

同步 Business Portfolio 的标准验证状态与 PLBV 认证状态。

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
| `201` | Created |
| `202` | Accepted |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

服务会使用已保存的 Meta 授权查询标准 `verification_status`；如果 Meta 没有返回该字段，会改查 WABA 的 `business_verification_status` 作为替代信号。两者都拿不到时返回 `unknown`/`unavailable`，不会因此中断。若标准验证已通过，响应附带 `certificationStatus: not_applicable`；否则继续刷新 PLBV 状态并一并返回，避免页面短暂显示不一致的数据。
