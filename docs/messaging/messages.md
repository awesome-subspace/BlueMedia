---
title: "消息"
excerpt: "提交出站消息、查询消息状态、标记入站消息已读。POST /v1/messages 的 202 只代表平台已受理，真实状态要靠轮询消息详情或状态类 Webhook。"
---

# 消息

提交出站消息、查询消息状态、标记入站消息已读。

`POST /v1/messages` 返回的 `202 Accepted` 只代表**平台已受理**，既不代表已送达，也不代表已提交给 Meta。要拿到真实结果，只有两条路：轮询 `GET /v1/messages/{id}`，或接收状态类 Webhook。

| 接口 | 用途 |
| --- | --- |
| [提交出站消息](post-v1-messages.md) | 发送 11 种类型的消息（文本、模板、媒体、interactive 等）。建议带 `Idempotency-Key`。 |
| [列出最近消息](get-v1-messages.md) | 读取当前账户最近 50 条消息的概要。 |
| [读取消息状态](get-v1-messages-id.md) | 单条消息的最终状态、`wamid` 与失败原因。 |
| [标记已读](post-v1-messages-read.md) | 把一条入站消息标记为已读，可选附带「正在输入」指示器。不计费、不占发送配额。 |

{% hint style="info" %}
`POST /v1/messages/read` 与收件箱的 `POST /v1/conversations/{id}/read` 是两件独立的事：前者直连 Meta 回执，后者只清平台本地未读数，互不联动。
{% endhint %}

状态机、24 小时客服窗口、媒体引用方式（`id` 与 `link` 必须恰好给一个）和计费时点，见[发消息与状态追踪](../guides/messaging.md)。失败码表见[错误码](../guides/error-codes.md)。
