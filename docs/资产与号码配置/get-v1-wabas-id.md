---
title: "读取 WABA 详情"
excerpt: "读取 WABA 详情。"
---

`GET /v1/wabas/{id}`

读取 WABA 详情。

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
  "$ref": "#/components/schemas/Waba"
}
```

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

仅按当前账户上下文查询（RLS + 显式过滤双重限制），不存在或不属于当前账户统一返回 404，不透露该 id 是否真实存在于别的账户名下。
