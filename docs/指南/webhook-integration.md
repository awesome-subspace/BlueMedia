---
title: "Webhook 集成"
excerpt: "创建一个回调端点，接收用户消息、状态更新和号码/模板等资产变更，无需轮询。"
---

创建一个回调端点，接收用户消息、状态更新和号码/模板等资产变更，无需轮询。

## 创建端点

```bash
curl -X POST https://api.bsptest.com/v1/webhook-endpoints \
  -H "Authorization: Bearer <API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{ "url": "https://your-server.example.com/whatsapp-webhook", "events": ["message", "status"] }'
```

`events` 可选，取值 `message` / `status` / `change` / `probe` / `*`（不填等于订阅全部）；`secret` 可选，不填时平台生成一个。**secret 只在创建响应里返回一次**，用来验证签名——请立即保存，平台之后不会再明文展示。

## 验证签名

每次回调都带 `X-Webhook-Signature-256: sha256=<hex>`，是对**原始请求体字节**用端点 secret 做 HMAC-SHA256 的结果。收到回调后必须先验证，再解析 JSON——用同样的算法自己算一遍，和 header 比对：

```Node.js
const crypto = require('node:crypto');

function verify(rawBody, signatureHeader, secret) {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(rawBody)      // 必须是原始字节，不能是解析后再 JSON.stringify 的结果
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
}
```

其余请求头：`X-Webhook-Event`（本次事件类型，见下）、`X-Delivery-Id`（这次投递的唯一 id，用于对账/去重）。

## 事件类型

| kind      | 触发时机                                                                           |
| --------- | ---------------------------------------------------------------------------------- |
| `message` | 用户发来一条新消息（含图片/文档/位置等各类型）。                                   |
| `status`  | 你发出的消息状态变化：`sent` / `delivered` / `read` / `failed`。                   |
| `change`  | 其它资产变更（号码、模板审核结果等），不属于上面两类的统一归到这里。               |
| `probe`   | 控制台「测试」按钮触发的探测事件，用于验证端点可达和签名正确，不代表真实业务数据。 |

## 投递与重试

你的端点返回 `2xx` 视为投递成功。`5xx` 或 `429` 视为临时故障，会按指数退避重试，最多累计 5 次尝试（首次 + 4 次重试，间隔从约 2 秒开始倍增）；其它 `4xx`（如签名校验失败后你主动拒绝）视为终态失败，**不会**重试——请确保你的端点对瞬时故障返回 5xx 而不是 4xx。单次请求超时 10 秒。

`GET /v1/webhook-endpoints` 返回每个端点**最近一次**投递的结果（`lastDelivery`：状态/响应码/尝试次数/最近错误/时间），从未投递过为 `null`。这里刻意不提供「已投递/失败/待投递」的计数——那类聚合会随消息量增长变慢，「最近一次成功了吗」才是真正需要的信号。

## Payload 结构

回调体是 `{ kind, ...上下文字段, message / status / value }` 的形态，字段随 `kind` 变化：

```status 事件示例
{
  "kind": "status",
  "wabaId": "waba_...",
  "phoneNumberId": "pn_...",
  "status": {
    "id": "wamid.HBg...",
    "status": "delivered",
    "timestamp": "1735000000",
    "recipient_id": "8613800138000"
  }
}
```
