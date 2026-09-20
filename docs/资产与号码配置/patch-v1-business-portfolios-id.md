---
title: "修改 Portfolio"
excerpt: "修改 Business Portfolio 名称或 Meta Business Manager ID。"
---

`PATCH /v1/business-portfolios/{id}`

修改 Business Portfolio 名称或 Meta Business Manager ID。

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
  "$ref": "#/components/schemas/BusinessPortfolio"
}
```

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

修改 `metaBmId`（客户在 Meta 的 Business Manager ID）是敏感操作：一旦该 Business Portfolio 已挂载任何 WABA，就禁止改绑并返回 409，需要先删除这些 WABA。若旧值非空但尚未挂载 WABA，改绑会清空现有验证状态（恢复为 `unknown` / `unavailable`）并删除相关子对象，因为验证结果绑定到具体的 Meta Business Manager；更换后旧验证结果不再有效。
