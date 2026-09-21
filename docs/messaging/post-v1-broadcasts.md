---
title: "创建群发"
description: "创建群发（批量模板发送）。返回 202 —— 响应返回时一条都还没发出去：真正的发送由平台按节流速度逐条推进。"
---

`POST /v1/broadcasts`

创建群发（批量模板发送）。返回 202 —— 响应返回时一条都还没发出去：真正的发送由平台按节流速度逐条推进。

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
| `name` | string | 是 | 活动名，给人看的，如「双十一预热」 |
| `phoneNumberId` | string | 是 | 发送号码，pn_... |
| `template` | object | 是 | { name, language: { code }, components? }；一个活动只发一个模板 |
| `recipients` | array | 是 | [{ to, variables? }]，最多 20000 条；variables 覆盖 template.components |
| `scheduledAt` | ISO 8601 | 否 | 到点才开始派发；省略即立刻开始 |
| `dryRun` | boolean | 否 | true 只校验与试算，不落库 |

Content-Type：`application/json`
示例：

```json
{
  "name": "双十一预热",
  "phoneNumberId": "<YOUR_PHONE_NUMBER_ID>",
  "template": {
    "name": "promo_v1",
    "language": {
      "code": "zh_CN"
    }
  },
  "recipients": [
    {
      "to": "8613800138000"
    },
    {
      "to": "8613800138001",
      "variables": [
        {
          "type": "body",
          "parameters": [
            {
              "type": "text",
              "text": "张三"
            }
          ]
        }
      ]
    }
  ]
}
```

Schema：

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "string · 必填 — 活动名，给人看的，如「双十一预热」"
    },
    "phoneNumberId": {
      "type": "string",
      "description": "string · 必填 — 发送号码，pn_..."
    },
    "template": {
      "type": "string",
      "description": "object · 必填 — { name, language: { code }, components? }；一个活动只发一个模板"
    },
    "recipients": {
      "type": "string",
      "description": "array · 必填 — [{ to, variables? }]，最多 20000 条；variables 覆盖 template.components"
    },
    "scheduledAt": {
      "type": "string",
      "description": "ISO 8601 · 可选 — 到点才开始派发；省略即立刻开始"
    },
    "dryRun": {
      "type": "string",
      "description": "boolean · 可选 — true 只校验与试算，不落库"
    }
  },
  "required": [
    "name",
    "phoneNumberId",
    "template",
    "recipients"
  ],
  "example": {
    "name": "双十一预热",
    "phoneNumberId": "<YOUR_PHONE_NUMBER_ID>",
    "template": {
      "name": "promo_v1",
      "language": {
        "code": "zh_CN"
      }
    },
    "recipients": [
      {
        "to": "8613800138000"
      },
      {
        "to": "8613800138001",
        "variables": [
          {
            "type": "body",
            "parameters": [
              {
                "type": "text",
                "text": "张三"
              }
            ]
          }
        ]
      }
    ]
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

#### 它和自己循环调 POST /v1/messages 的区别
节流、去重、中途停机恢复和费用预检都在平台这一侧。Cloud API 每个号码默认 80 msg/s（升级后 1000，与 WhatsApp Business app 共存的号码只有 20），超了返回 130429；平台按「每轮条数 × 每秒一轮」控速，默认约 50 msg/s。

#### 创建时会做的四件事
- **模板只校验一次**：未审核 / 该号码所属 WABA 下不存在 → 直接 404/409，而不是变成几万条失败收件人。
- **号码去重**：`+86 133…`、`86133…`、带空格与连字符的写法视为同一个人，只发一次。响应里 `submitted` / `accepted` / `duplicates` 分别是提交数、落库数、被去掉的重复数。
- **无效号码逐条给原因**：`invalid` 数组里是 `{ to, reason }`（empty / not_a_number / length_out_of_range）。只判断「明显不是号码」——国家码是否存在、号码是否注册过 WhatsApp 只有 Meta 知道，平台不猜。
- **费用预检**：预估 = 去重后人数 × 单条预估额度。余额不够整场活动时直接返回 402 并带上 `requiredMinor` / `availableMinor`，而不是发到一半停下。

#### warnings 要看
`warnings` 不阻断创建，但每一条都会真实影响投递结果：
- 人数超过该号码所属 **Business Portfolio** 的消息限额（新组合只有 250 个唯一用户/24h，且被组合下所有号码共用），超出部分会被 Meta 拒绝；
- 本地不知道限额档位（没同步过）——先调 POST /v1/phone-numbers/{id}/refresh；
- MARKETING 模板发给 +1 号码：WhatsApp 不向美国号码投递营销模板（加拿大同为 +1，本地无法区分，所以平台只提示、不擅自丢弃）；
- MARKETING 模板受**人均频次上限**约束，超限的收件人以 131049 失败，且 24 小时内不得重试（平台不会自动重试这类失败）；
- 号码质量评分为 YELLOW/RED 时做大批量营销发送，会进一步拉低评分并可能触发限额下调。

#### 幂等
每个收件人对应的消息使用固定幂等键 `bcast:<recipientId>`，所以派发进程重启不会给同一个人重复发。活动本身没有幂等键：重复 POST 会创建两个活动。
