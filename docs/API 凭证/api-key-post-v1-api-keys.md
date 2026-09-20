---
title: "快速开始"
---
从拿到 API Key 到发出第一条 WhatsApp 消息，共 4 步。

**用 AI 写对接代码？** 每个接口页面包屑右侧有「 **复制给 LLM**」按钮，复制出来的是一份自包含说明：方法与路径、鉴权与所需 scope、参数与请求体字段（含必填标记）、成功响应结构、错误信封约定，以及一条可直接跑的 curl。直接粘给你的 coding agent 即可，不需要让它去抓这个页面。结构与字段说明是英文的；散文描述保持中文原文并标了 `zh`——它们没有经过机器翻译，因为「必填」「不可重试」这类词一旦译歪，生成的代码就是错的。

## Base URL

所有 `/v1/*` 接口的基地址是：

```
https://api.bsptest.com
```

## 1. 获取 API Key

请联系我们公司邮箱 [senpeng.zheng1@bluefocus.com](mailto:senpeng.zheng1@bluefocus.com) 获取 API Key —— `bu` 级 Key（`sk_bu_...`，管这个 BU 的全部资源）或绑定单个 BM 的 `bm` 级 Key（`sk_bm_...`）。

> 🚧 密钥只在创建时明文返回一次
>
> 请立即保存；平台只存哈希，丢失后只能重新签发。

## 2. 验证令牌

用 `Authorization: Bearer <API_KEY>` 调 `GET /whoami`，确认令牌有效并核对返回的 `tenantId`。

<Tabs>
<Tab title="curl">

```bash
curl https://api.bsptest.com/whoami \
  -H "Authorization: Bearer sk_bu_xxx"
```

</Tab>
<Tab title="200 OK">

```json
{
  "tenantId": "tenant_01923abc...",
  "apiKeyLevel": "bu",
  "platformVersion": "1.0.xxx"
}
```

</Tab>
</Tabs>

## 3. 查看本 BU 的号码

发消息前先确认自己名下有哪些已注册的号码：

<Tabs>
<Tab title="curl">

```bash
curl https://api.bsptest.com/v1/phone-numbers \
  -H "Authorization: Bearer sk_bu_xxx"
```

</Tab>
</Tabs>

从返回列表里取一个 `id`（`pn_...` 格式）用在下一步——不要沿用文档里的占位符，那不是真实号码 ID。

## 4. 发出第一条消息

<Tabs>
<Tab title="curl">

```bash
curl -X POST https://api.bsptest.com/v1/messages \
  -H "Authorization: Bearer sk_bu_xxx" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: order-8821-notify" \
  -d '{
    "phoneNumberId": "pn_01923abc",
    "to": "8613800138000",
    "type": "text",
    "text": { "body": "你好，你的订单已发货。" }
  }'
```

</Tab>
</Tabs>

响应 `202 Accepted`，返回消息 id 与初始状态 `accepted`。 **这不代表已送达**——用 `GET /v1/messages/{id}` 或 Webhook 追踪后续状态（见 [发消息与状态追踪](/docs/postgresql-redis-get-ready#messaging)）。

**幂等：** 带上 `Idempotency-Key`（≤200 字符）。同一 BU 下重复使用同一个 key 会返回 _原来那条_ 消息，不会重复发送——重试网络超时的请求时务必带上。

接下来建议阅读 [认证与权限](/docs/postgresql-redis-get-ready#auth) 了解层级与 scope，以及 [Webhook 集成](/docs/postgresql-redis-get-ready#webhooks-guide) 了解如何接收状态回调和用户回复。