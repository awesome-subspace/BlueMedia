---
title: "上报一条转化事件"
description: "上报一条转化事件（Conversions API for business messaging）。返回 202 表示已排队，**不代表已发给 Meta**。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--post">POST</span><code class="endpoint-path">/v1/conversions/events</code></div>

上报一条转化事件（Conversions API for business messaging）。返回 202 表示已排队，**不代表已发给 Meta**。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`messages:send`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `portfolioId` | string | 是 | 事件所属的 Business Portfolio，bm_...（Pixel 绑在它上面） |
| `ctwaClid` | string | 是 | 广告点击 id。取自 `GET /v1/conversations/{id}` 的 `ctwaClid` |
| `eventName` | string | 是 | Meta 标准事件名：Purchase / LeadSubmitted / AddToCart / InitiateCheckout |
| `value` | number | 否 | **主单位**金额（与 Meta 的 custom_data.value 一致）。必须与 currency 同时给 |
| `currency` | string | 否 | ISO 4217，三位 |
| `timestamp` | integer | 否 | unix 秒，事件**真实发生**时间。省略取当前时间 |
| `idempotencyKey` | string | 否 | 幂等键。省略时按「点击 + 事件名 + 秒级时间」自动生成 |

Content-Type：`application/json`
示例：

```json
{
  "portfolioId": "bm_x",
  "ctwaClid": "<CTWA_CLID>",
  "eventName": "Purchase",
  "value": 250,
  "currency": "USD"
}
```

Schema：

```json
{
  "type": "object",
  "properties": {
    "portfolioId": {
      "type": "string",
      "description": "string · 必填 — 事件所属的 Business Portfolio，bm_...（Pixel 绑在它上面）"
    },
    "ctwaClid": {
      "type": "string",
      "description": "string · 必填 — 广告点击 id。取自 `GET /v1/conversations/{id}` 的 `ctwaClid`"
    },
    "eventName": {
      "type": "string",
      "description": "string · 必填 — Meta 标准事件名：Purchase / LeadSubmitted / AddToCart / InitiateCheckout"
    },
    "value": {
      "type": "string",
      "description": "number · 可选 — **主单位**金额（与 Meta 的 custom_data.value 一致）。必须与 currency 同时给"
    },
    "currency": {
      "type": "string",
      "description": "string · 可选 — ISO 4217，三位"
    },
    "timestamp": {
      "type": "string",
      "description": "integer · 可选 — unix 秒，事件**真实发生**时间。省略取当前时间"
    },
    "idempotencyKey": {
      "type": "string",
      "description": "string · 可选 — 幂等键。省略时按「点击 + 事件名 + 秒级时间」自动生成"
    }
  },
  "required": [
    "portfolioId",
    "ctwaClid",
    "eventName"
  ],
  "example": {
    "portfolioId": "bm_x",
    "ctwaClid": "<CTWA_CLID>",
    "eventName": "Purchase",
    "value": 250,
    "currency": "USD"
  }
}
```

## 响应

| 状态码 | 说明 |
| --- | --- |
| `202` | Accepted |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

#### 为什么是 202，不是「已上报」

事件先落库、由调度器异步发给 Meta。两个原因：一是另一条来源（`automatic_events` webhook）是在 webhook 中继的**事务里**捕获的，在事务里做 Graph 往返会持住整批事件的行锁，而事务回滚后我们已经报过一个从未落库的转化；二是上报会失败（客户还没绑 Pixel、token 过期、Meta 5xx），而事件不可重造。用 `GET /v1/conversions/events` 看每条的 `status`。

#### datasetBound=false 意味着什么

当前 Business Portfolio 还没有 Pixel（dataset）——事件已经**保存**，但状态是 `skipped`，不会发出。Pixel 是客户在嵌入式注册（ES v4，登录配置里勾选 Conversions API）时选择的，Graph API 上查不到这个绑定关系。补绑之后这些事件可以重放。

#### 金额单位

请求里的 `value` 是**主单位**（250 = 250 元/美元），与 Meta 的 `custom_data.value` 一致；平台内部按 minor units 存（与账本同一表示法，避免浮点误差），只在发给 Meta 的出口换算一次。

#### 没有 ctwaClid 的对话无法上报

`ctwa_clid` 只在用户**点击 Click-to-WhatsApp 广告**进来的那条消息里出现（WhatsApp Status 广告位不带它）。普通对话没有可归因的点击，Meta 不接受。
