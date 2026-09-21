---
title: "Portfolio 删除影响预览"
description: "级联删除影响预览：返回将被删除的 WABA/号码/消息等数量。只读。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--get">GET</span><code class="endpoint-path">/v1/business-portfolios/{id}/delete-preview</code></div>

级联删除影响预览：返回将被删除的 WABA/号码/消息等数量。只读。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

:::

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
  "type": "object",
  "description": "将被(或已被)删除的关联对象数量。heldReservations > 0 时级联删除会被拒绝。",
  "additionalProperties": {
    "type": "integer"
  }
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

纯只读统计，调用本身不会触发任何实际删除操作；返回体里的 `heldReservations`（在途信用预留笔数）如果大于 0，意味着即便随后调用 DELETE 并带上 cascade=true，也会被拒绝——把这个数字提前展示出来，可以让操作者在真正点删除之前就知道"现在还不能删，得等这些在途消息落定"，而不是删除请求发出去才被拒绝。
