---
title: "账户自助用量/费用视图"
excerpt: "账户自助用量/费用视图：余额 + 消费时间线 + 按分类/类型拆分。窗口内没有扣费时，dailyUsage / byCategory 为空数组，totalSpentMinor 为空对象 {}（它是按币种聚合的映射，不是数组）。"
---

`GET /v1/credit-account/usage`

账户自助用量/费用视图：余额 + 消费时间线 + 按分类/类型拆分。窗口内没有扣费时，dailyUsage / byCategory 为空数组，totalSpentMinor 为空对象 {}（它是按币种聚合的映射，不是数组）。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`billing:read`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `days` | query | 否 | string |  |


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
    "generatedAt",
    "windowDays",
    "balance",
    "dailyUsage",
    "byCategory",
    "byMessageType",
    "totalSpentMinor",
    "totalChargedCount",
    "totalMessages"
  ],
  "properties": {
    "generatedAt": {
      "type": "string",
      "format": "date-time"
    },
    "windowDays": {
      "type": "integer",
      "enum": [
        7,
        30,
        90
      ]
    },
    "balance": {
      "nullable": true,
      "description": "未开通信用账户时为 null",
      "type": "object",
      "properties": {
        "currency": {
          "type": "string"
        },
        "availableMinor": {
          "type": "integer"
        },
        "reservedMinor": {
          "type": "integer"
        }
      }
    },
    "dailyUsage": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "day": {
            "type": "string",
            "description": "UTC 日期 YYYY-MM-DD"
          },
          "currency": {
            "type": "string"
          },
          "spentMinor": {
            "type": "integer"
          },
          "count": {
            "type": "integer"
          }
        }
      }
    },
    "byCategory": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "category": {
            "type": "string",
            "nullable": true,
            "description": "MARKETING/UTILITY/AUTHENTICATION；非模板消息为 null；计费流水找不到对应消息行时为 \"unknown\""
          },
          "currency": {
            "type": "string"
          },
          "spentMinor": {
            "type": "integer"
          },
          "count": {
            "type": "integer"
          }
        }
      }
    },
    "byMessageType": {
      "type": "array",
      "description": "**发送量**口径，不是费用口径：按 messages.created_at 落窗，含未计费、失败、已冲回的消息。",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string"
          },
          "count": {
            "type": "integer"
          }
        }
      }
    },
    "totalSpentMinor": {
      "type": "object",
      "description": "币种 → 最小货币单位合计。无扣费时为 {}。同币种下必然等于 dailyUsage 与 byCategory 各自的 spentMinor 合计。",
      "additionalProperties": {
        "type": "integer"
      }
    },
    "totalChargedCount": {
      "type": "integer",
      "description": "净计费笔数（扣费 +1、冲回 −1），按账本 created_at 落窗，等于 dailyUsage 的 count 合计。与 totalMessages 是两个不同分母，不相等属正常。"
    },
    "totalMessages": {
      "type": "integer",
      "description": "本窗口创建的消息行数（发送量），与 totalChargedCount 口径不同。"
    },
    "byPortfolio": {
      "type": "array",
      "description": "按 Business Portfolio 汇总的净消费，金额从高到低（最多 20 条）。归属取自扣费流水上的 portfolio_id。",
      "items": {
        "type": "object",
        "properties": {
          "portfolioId": {
            "type": "string"
          },
          "portfolioName": {
            "type": "string",
            "description": "Business Portfolio 已删除时返回其 id，不会是空字符串"
          },
          "currency": {
            "type": "string"
          },
          "spentMinor": {
            "type": "integer"
          },
          "count": {
            "type": "integer",
            "description": "净计费笔数"
          }
        }
      }
    },
    "unattributedSpentMinor": {
      "type": "integer",
      "description": "本窗口内**没有 Business Portfolio 归属**的净消费。2026-08 之前的扣费流水没有记录归属，因此 sum(byPortfolio.spentMinor) + unattributedSpentMinor 才等于该币种的总消费。"
    }
  }
}
```

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

#### 两个口径，不要混用

- `dailyUsage` / `byCategory`：**净计费**口径——对账本（ledger_entries）按记账时间聚合，扣费 +1、冲回记 −1。
- `byMessageType` / `totalMessages`：**发送量**口径——对 messages 表按创建时间 `COUNT(*)`，含未计费、失败、已冲回的消息。

因此 `totalChargedCount` 与 `totalMessages` 不相等属**正常**，不要据此认为数据错了。真正成立的不变量是：同币种下 `sum(byCategory.spentMinor) == totalSpentMinor`。

#### 按 Business Portfolio 拆分消费

`byPortfolio` 给出每个 Business Portfolio 的净消费（金额倒序），归属取自扣费流水上的 `portfolio_id`（发送时固定记录，不会事后按号码归属回查，因为号码可以迁移到其它 WABA）。**2026-08 之前的流水没有这一列**，对应金额位于 `unattributedSpentMinor`：`sum(byPortfolio.spentMinor) + unattributedSpentMinor` 才等于该币种总消费，不要把榜单之和当作总数。

它和「Portfolio 预算」里的 `spentMinor` 是**两个口径**：前者是发送路径维护的增量计数（只有设置过预算的 Business Portfolio 才有记录），这里是账本汇总（所有 Business Portfolio）。两者不一致时以账本为准，可用 `GET /v1/credit-account/allocations/audit` 查看差额。
