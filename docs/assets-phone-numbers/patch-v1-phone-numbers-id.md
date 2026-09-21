---
title: "更新名称、质量、消息限制、吞吐或状态"
description: "更新名称、质量、消息限制、吞吐或状态。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--patch">PATCH</span><code class="endpoint-path">/v1/phone-numbers/{id}</code></div>

更新名称、质量、消息限制、吞吐或状态。

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

只更新本地字段，不会调用 Meta，也不会触发 Meta 侧的显示名审核或注册流程；若要真正修改 Meta 上的显示名或状态，需走 display-name、register 等生命周期接口。
