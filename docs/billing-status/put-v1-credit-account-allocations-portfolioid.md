---
title: "设置某个 Business Portfolio 的预算上限"
description: "设置某个 Business Portfolio 的预算上限。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--put">PUT</span><code class="endpoint-path">/v1/credit-account/allocations/{portfolioId}</code></div>

设置某个 Business Portfolio 的预算上限。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`billing:read`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `portfolioId` | path | 是 | string | 平台内 Business Portfolio ID，`bm_...` |

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `allocatedMinor` | integer >= 0 | 是 | 该 Business Portfolio 的预算上限，最小货币单位。0 = 冻结 |
| `note` | string(200) | 否 | 备注（给人看的，例如「双十一活动预算」） |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "allocatedMinor": {
      "type": "string",
      "description": "integer >= 0 · 必填 — 该 Business Portfolio 的预算上限，最小货币单位。0 = 冻结"
    },
    "note": {
      "type": "string",
      "description": "string(200) · 可选 — 备注（给人看的，例如「双十一活动预算」）"
    }
  },
  "required": [
    "allocatedMinor"
  ]
}
```

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

幂等：同样的入参重复调用结果一致（这是一个「设为」而不是「增加」的接口）。

#### 只能调整当前授权范围内的 Portfolio

`portfolioId` 必须位于当前 API Key 的授权范围内，否则返回 404。请求体不接受 `tenantId` 或币种字段；账户尚未开通额度时返回 409。

#### 设成低于已用是允许的

上限可以低于 `spentMinor + reservedMinor`，此时剩余为 0，该 Portfolio 会立即停止发送新消息——这正是“马上停掉它”的用法。要恢复“不限额”请使用 DELETE，不要设置一个很大的数。

额度用完后发送会以 `402 BM_BUDGET_EXCEEDED` 失败（单条消息则记为该失败码），群发在创建时就会按总成本试算拒绝，不会发一半停下。
