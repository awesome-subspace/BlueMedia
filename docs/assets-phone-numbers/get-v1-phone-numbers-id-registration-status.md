---
title: "查询 Meta 注册、名称、质量和两步验证状态"
description: "查询 Meta 注册、名称、质量和两步验证状态。"
---

`GET /v1/phone-numbers/{id}/registration-status`

查询 Meta 注册、名称、质量和两步验证状态。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`phone_numbers:read`。API Key 的可访问资源由当前授权范围决定。

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

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

实时调用 Meta Graph API 读取该号码字段。若该号码所属 Business Portfolio 尚未完成 Meta 授权或授权已经失效，返回 409。
