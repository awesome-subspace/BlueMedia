---
title: "快速开始"
excerpt: "从拿到 API Key 到发出第一条 WhatsApp 消息，共 4 步。"
---

从拿到 API Key 到发出第一条 WhatsApp 消息，共 4 步。

## Base URL

所有 `/v1/*` 接口的基地址是：

```
https://api.bsptest.com
```

## 1\. 获取 API Key

请联系我们公司邮箱 [senpeng.zheng1@bluefocus.com](mailto:senpeng.zheng1@bluefocus.com) 获取 API Key。Key 的授权范围由 BlueMedia 配置，调用方不需要选择或理解内部权限层级。

> 🚧
> **密钥只在创建时明文返回一次。**请立即保存；平台只存哈希，丢失后只能重新签发。

## 2\. 验证令牌

用 `Authorization: Bearer <API_KEY>` 调 `GET /whoami`，确认令牌有效并核对返回的 `tenantId`。

```bash
curl https://api.bsptest.com/whoami \
  -H "Authorization: Bearer <API_KEY>"
```

```json
{
  "tenantId": "tenant_01923abc...",
  "platformVersion": "1.0.302"
}
```

`platformVersion` 是当前处理这次请求的 API 进程版本，排查「某个修复上线了没有」时用得上。响应可能还包含其它诊断字段，**不要**据此做权限判断。

## 3\. 查看可用号码

发消息前先确认自己名下有哪些已注册的号码：

```bash
curl https://api.bsptest.com/v1/phone-numbers \
  -H "Authorization: Bearer <API_KEY>"
```

从返回列表里取一个 `id`（`pn_...` 格式）用在下一步——不要沿用文档里的占位符，那不是真实号码 ID。

## 4\. 发出第一条消息

```bash
curl -X POST https://api.bsptest.com/v1/messages \
  -H "Authorization: Bearer <API_KEY>" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: order-8821-notify" \
  -d '{
    "phoneNumberId": "pn_01923abc",
    "to": "8613800138000",
    "type": "text",
    "text": { "body": "你好，你的订单已发货。" }
  }'
```

响应 `202 Accepted`，返回消息 id 与初始状态 `accepted`。**这不代表已送达**——用 `GET /v1/messages/{id}` 或 Webhook 追踪后续状态（见[发消息与状态追踪](messaging.md)）。

> 📘
> **幂等：**带上 `Idempotency-Key`（≤200 字符）。在当前授权范围内重复使用同一个 key 会返回*原来那条*消息，不会重复发送——重试网络超时的请求时务必带上。

接下来建议阅读[认证与权限](authentication.md)了解授权范围与 scope，以及[Webhook 集成](webhook-integration.md)了解如何接收状态回调和用户回复。
