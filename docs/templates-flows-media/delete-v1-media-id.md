---
title: "删除 Meta 媒体及本地归属"
description: "删除 Meta 媒体及本地归属。"
---

`DELETE /v1/media/{id}`

删除 Meta 媒体及本地归属。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`media:write`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | Meta 媒体 id |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

删除顺序是先删 Meta 侧媒体，成功后才删本地归属记录；Meta 调用失败则本地记录保留，媒体仍可继续 GET。
