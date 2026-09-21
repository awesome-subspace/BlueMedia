---
title: "读取号码当前商业资料"
excerpt: "读取号码当前商业资料；从未填写过返回 `null`。"
---

`GET /v1/phone-numbers/{id}/business-profile`

读取号码当前商业资料；从未填写过返回 `null`。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 平台内号码 ID，`pn_...` |


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

### 200 响应 Schema

```json
{
  "allOf": [
    {
      "$ref": "#/components/schemas/BusinessProfile"
    }
  ],
  "nullable": true
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

`PUT` 的对应读接口。在它存在之前这里只有写没有读，编辑界面打不出现状，操作的人是在一张空表上凭记忆填。两个 `PUT` 都会过滤掉未传的字段（只送 `description` 不会清掉 `about` 与 `address`），所以不会误伤，但填错要等到客户看见资料不对才暴露。

从未填写过返回 `null`，不是 `{}` 也不是 404 ——「这个号码没有资料」和「这个号码不属于你」是两件事，后者才是 404。纯读本地记录，不调用 Meta 的 Business Profile API。
