---
title: "读取 Portfolio 详情"
excerpt: "读取 Portfolio 详情。"
---

`GET /v1/business-portfolios/{id}`

读取 Portfolio 详情。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

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

### 200 响应 Schema

```json
{
  "$ref": "#/components/schemas/BusinessPortfolio"
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

没有跨账户查看能力，只按当前凭证的 tenant 上下文查询（由 RLS 强制），查不到统一返回 404，不区分"这个 id 根本不存在"和"这个 id 存在但属于别的账户"两种情况，避免通过错误码差异探测出别人是否拥有某个资源 id。
