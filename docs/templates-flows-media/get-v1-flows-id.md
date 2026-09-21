---
title: "校验 WABA 归属后读取 Flow 详情"
excerpt: "校验 WABA 归属后读取 Flow 详情。"
---

`GET /v1/flows/{id}`

校验 WABA 归属后读取 Flow 详情。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | Meta 侧的 Flow id |
| `wabaId` | query | 是 | string | 平台内 WABA ID，`waba_...`。**必填**——Flow 不存在于平台库内，归属校验只能靠它 |


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

先按 wabaId 拉一次该 WABA 下的 Flow id 列表核对归属，再单独查详情；如果 id 存在但不属于传入的 wabaId，返回 404 而不是把别的 WABA 的 Flow 详情泄露出去。
