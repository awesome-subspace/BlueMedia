---
title: "创建账户回调端点"
description: "创建账户回调端点。回调携带 X-Webhook-Signature-256: sha256=...；使用端点 secret 对原始请求体做 HMAC-SHA256，secret 只返回一次。"
---

`POST /v1/webhook-endpoints`

创建账户回调端点。回调携带 X-Webhook-Signature-256: sha256=...；使用端点 secret 对原始请求体做 HMAC-SHA256，secret 只返回一次。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `url` | URL | 是 | 接收回调的 HTTPS 地址。生产必须是 https，且不能指向内网/回环/云元数据地址；不通过返回 `400 VALIDATION_FAILED` |
| `events` | string[] | 否 | 订阅事件。每项取值：`message`、`status`、`change`、`probe`、`job.completed`、`job.failed`、`usage.updated`、`webhook.verification`、`*`。取值之外返回 `400`；不支持 `job.*` 这类前缀通配 |
| `secret` | string | 否 | 签名密钥，自己指定时**至少 16 字符**；省略时平台生成一个 `whsec_` 开头的值 |
| `projectId` | string | 否 | 只接收该 Business Portfolio（`bm_...`）的事件。省略即账户级端点，接收本账户全部 Portfolio 的事件 |
| `connectionId` | string | 否 | 走**连接协议**：换用 `Webhook-Signature: v1,<hex>` 方案，且端点以 `pending` 起步、必须先通过 `POST {id}/verify` 才投递。写在 `metadata.connection_id` 里等价 |
| `metadata` | object | 否 | 任意 JSON，平台原样保存并在读取端点时返回 |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "description": "URL · 必填 — 接收回调的 HTTPS 地址"
    },
    "events": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "message",
          "status",
          "change",
          "probe",
          "job.completed",
          "job.failed",
          "usage.updated",
          "webhook.verification",
          "*"
        ]
      },
      "description": "可选 — 订阅事件；省略时按 [\"*\"] 保存"
    },
    "secret": {
      "type": "string",
      "minLength": 16,
      "description": "string · 可选 — 至少 16 字符；省略时平台生成"
    },
    "projectId": {
      "type": "string",
      "description": "string · 可选 — 只接收该 Business Portfolio（bm_...）的事件"
    },
    "connectionId": {
      "type": "string",
      "description": "string · 可选 — 走连接协议：新签名方案 + pending 起步 + 需验证"
    },
    "metadata": {
      "type": "object",
      "additionalProperties": true,
      "description": "object · 可选 — 任意 JSON，原样保存"
    }
  },
  "required": [
    "url"
  ],
  "additionalProperties": false
}
```

## 响应

| 状态码 | 说明 |
| --- | --- |
| `201` | Created |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

若省略 secret，平台自动生成；生成值只在这一次创建响应里返回，服务端此后只保存密文/哈希，无法再明文取回，遗失只能重新创建端点（或用 `POST {id}/rotate-secret` 换一个新的）。

`events` 省略等于按 `["*"]` 保存，即**订阅全部类型（含日后新增的）**，不是"不订阅"，也不只是四类 Meta 入站事件——平台事件（`job.completed` / `job.failed` / `usage.updated` / `webhook.verification`）同样会投递过来。

#### 创建后是否立即投递，取决于有没有 connectionId

不带 `connectionId`（也没有 `metadata.connection_id`）时端点直接是 `active`，**创建完就开始投递**。带上它则以 `pending` 起步，必须先调 `POST /v1/webhook-endpoints/{id}/verify` 完成所有权验证才会转 `active`；在此之前不会收到任何事件。

请求体是严格模式：写了上表之外的字段返回 `400 VALIDATION_FAILED`，不会被静默忽略。

完整的签名验证、事件类型与重试节奏见[Webhook 集成](../guides/webhook-integration.md)。
