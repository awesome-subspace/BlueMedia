---
title: "读取当前账户的账本流水"
description: "读取当前账户的账本流水，按时间倒序；不接受账户归属参数。窗口内没有流水时 items 为空数组。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--get">GET</span><code class="endpoint-path">/v1/credit-account/ledger</code></div>

读取当前账户的账本流水，按时间倒序；不接受账户归属参数。窗口内没有流水时 items 为空数组。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`billing:read`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `days` | query | 否 | `7` \| `30` \| `90` | 统计窗口，默认 30。其它值一律按 30 处理 |
| `limit` | query | 否 | integer 1..200 | 返回条数，默认 50。超出范围夹取 |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

### 200 响应 Schema

```json
{
  "type": "object",
  "required": [
    "windowDays",
    "items"
  ],
  "properties": {
    "windowDays": {
      "type": "integer",
      "enum": [
        7,
        30,
        90
      ]
    },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "eventType": {
            "type": "string",
            "description": "message.charge / message.charge_reversed / credit_line.configured …"
          },
          "direction": {
            "type": "string",
            "enum": [
              "debit",
              "credit"
            ]
          },
          "amountMinor": {
            "type": "integer",
            "description": "取整到分的兼容值；对账用 amountMicros"
          },
          "amountMicros": {
            "type": "integer",
            "description": "权威金额，micros（百万分之一货币单位）"
          },
          "currency": {
            "type": "string"
          },
          "referenceType": {
            "type": "string",
            "nullable": true
          },
          "referenceId": {
            "type": "string",
            "nullable": true,
            "description": "referenceType=message 时为消息 id"
          },
          "idempotencyKey": {
            "type": "string",
            "nullable": true
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          }
        }
      }
    }
  }
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

查询范围固定来自当前 API Key，调用方不能通过参数读取其它账户的流水。

#### `amountMicros` 是权威金额

金额同时给两列：`amountMicros`（micros，百万分之一货币单位）与 `amountMinor`（取整到分）。**对账用 micros** —— 一条模板消息真实价 $0.0008~$0.0732，按分记不下来，`amountMinor` 是它各自的 ceil 值，所以两者差一分钱是预期的，不是算错。

低价档按分看偏差很大：Brazil utility 真实 $0.0068，`amountMinor` 是 1（$0.01，+47%）；Egypt utility 真实 $0.0036 同样是 1（+178%）。**合计尤其要看 micros**：先按分行取整再求和，误差会逐行累积。
