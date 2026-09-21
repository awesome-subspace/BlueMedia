---
title: "读取号码详情"
description: "读取号码详情。"
---

`GET /v1/phone-numbers/{id}`

读取号码详情。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

:::

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
  "$ref": "#/components/schemas/PhoneNumber"
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

同上，本地快照读取，不实时查询 Meta。
