---
title: "提交出站消息"
description: "提交出站消息，返回 202 与 accepted 状态。建议携带业务唯一的 Idempotency-Key（最长 200 字符）；当前授权范围内重复 key 返回同一消息；默认限流 600 条/分钟。"
---

`POST /v1/messages`

提交出站消息，返回 202 与 accepted 状态。建议携带业务唯一的 Idempotency-Key（最长 200 字符）；当前授权范围内重复 key 返回同一消息；默认限流 600 条/分钟。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`messages:send`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `Idempotency-Key` | header | 否 | string · 最长 200 | 业务唯一键，最长 200 字符；当前授权范围内重复 key 返回同一消息，不会重复发送 |

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `phoneNumberId` | string | 是 | 平台内号码 ID，pn_...；从 GET /v1/phone-numbers 获取当前授权范围实际拥有的号码，不要沿用示例里的占位符 |
| `to` | string | 否 | E.164 收件人号码，去掉 +。与 `toUserId` **二者至少给一个** |
| `toUserId` | string | 否 | 收件人 BSUID（Meta 请求体里叫 `recipient`），如 `US.13491208655302741918` |
| `type` | string | 否 | `text` / `template` / `image` / `video` / `audio` / `document` / `sticker` / `interactive` / `location` / `contacts` / `reaction`。**省略时按 `text` 处理**（向后兼容），传其它值返回 `400 VALIDATION_FAILED` |
| `<type>` | object \| object[] | 是 | 与 `type` 同名的内容对象，按 type 条件必填（`contacts` 是数组，其余是对象）。各类型的字段见下方「按 type 的请求体形状」 |

Content-Type：`application/json`
示例：

```json
{
  "phoneNumberId": "<YOUR_PHONE_NUMBER_ID>",
  "to": "8613800138000",
  "type": "text",
  "text": {
    "body": "你好",
    "preview_url": false
  }
}
```

Schema：

```json
{
  "type": "object",
  "properties": {
    "phoneNumberId": {
      "type": "string",
      "description": "string · 必填 — 平台内号码 ID，pn_...；从 GET /v1/phone-numbers 获取当前授权范围实际拥有的号码，不要沿用示例里的占位符"
    },
    "to": {
      "type": "string",
      "description": "string · 可选 — E.164 收件人号码，去掉 +。与 `toUserId` **二者至少给一个**"
    },
    "toUserId": {
      "type": "string",
      "description": "string · 可选 — 收件人 BSUID（Meta 请求体里叫 `recipient`），如 `US.13491208655302741918`"
    },
    "type": {
      "type": "string",
      "description": "string · 必填 — text / template / image / video / audio / document / sticker / interactive"
    },
    "<type>": {
      "type": "string",
      "description": "object · 可选 — 与 type 同名的内容对象；按 type 条件必填"
    }
  },
  "required": [
    "phoneNumberId",
    "type"
  ],
  "example": {
    "phoneNumberId": "<YOUR_PHONE_NUMBER_ID>",
    "to": "8613800138000",
    "type": "text",
    "text": {
      "body": "你好",
      "preview_url": false
    }
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

#### 按 type 的请求体形状

`type` 决定同名内容对象的形状，校验在落库前完成——形状不对返回 `400 VALIDATION_FAILED`，不会进入异步发送队列。

| type | 同名字段 | 必填字段 | 可选字段 |
| --- | --- | --- | --- |
| `text` | `text` (object) | `body` | `preview_url` (boolean) |
| `template` | `template` (object) | `name`、`language.code` | `components` (object[]) |
| `image` | `image` (object) | `id` **或** `link`（**恰好一个**） | `caption` |
| `video` | `video` (object) | `id` **或** `link`（恰好一个） | `caption` |
| `audio` | `audio` (object) | `id` **或** `link`（恰好一个） | — |
| `sticker` | `sticker` (object) | `id` **或** `link`（恰好一个） | — |
| `document` | `document` (object) | `id` **或** `link`（恰好一个） | `caption`、`filename` |
| `interactive` | `interactive` (object) | `type` | 其余字段原样透传给 Meta（`flow` / `button` / `list` / `cta_url` / `location_request_message` / `address_message` 都支持，无需平台改动） |
| `location` | `location` (object) | `latitude`（-90..90）、`longitude`（-180..180）；两者可传数字或字符串 | `name`、`address` |
| `contacts` | `contacts` (**array**，1–257 条) | 每条的 `name.formatted_name` | `addresses`、`emails`、`org`、`phones`、`urls`、`birthday`（`YYYY-MM-DD`） |
| `reaction` | `reaction` (object) | `message_id`（必须是 `wamid.` 开头）、`emoji` | — |

媒体类型的 `id` 与 `link` **必须恰好给一个**，两个都给或都不给都是 `400`（消息为 `provide exactly one of \`id\` or \`link\``）：

- `id` 是先经 `POST /v1/media` 上传拿到的 Meta 媒体 id，适合平台上限 5 MB 以内的素材；
- `link` 是一个 Meta 能公开访问到的 URL，由 Meta 自己去取——**超过 5 MB 的音视频/文档只能走这条路**，因为上传接口硬性限制每个文件 5 MB。

#### 模板消息的参数绑定

`components` 里的 `parameters` 必须与创建模板时声明的占位符数量和顺序**完全一致**，否则 Meta 返回参数不匹配错误。模板类型不受 24 小时客服窗口限制，可随时发送。

#### 24 小时窗口的本地预检

窗口外发自由格式消息（非 template）会在**落库前**本地判定并直接返回 `409 WHATSAPP_24H_WINDOW_EXPIRED`，不会走到 Meta 那一层浪费一次信用预留。但本地判定只挡"确定关闭"的情况：本地认为窗口开着、实际已关闭的消息，仍可能被 Meta 拒绝，那种情况走消息失败码的正常回落流程（见「错误码」页的消息失败码表）。

#### 媒体消息的限制

按类型有独立的大小与格式限制（图片约 5MB、音视频约 16MB、文档约 100MB），超限由 **Meta 在投递阶段**拒绝，本端点不做预检——超限消息会先拿到 202 accepted，之后才通过状态回调失败。

注意这与**上传**通道的限制是两件事：`POST /v1/media` 对每个文件硬性限制 5 MB，在到达 Meta 之前就返回 `400`。所以更大的素材必须用 `link` 引用，而不是先上传再引用 `id`。

#### 收件人可以是手机号，也可以是 BSUID

`to`（手机号）与 `toUserId`（BSUID）**至少给一个**，都给时**以手机号为准**（与 Meta 的优先级一致）。

BSUID 是 Meta 从 2026 年 4 月起在每条入站消息里下发的用户标识（形如 `US.13491208655302741918`，按业务组合唯一），可以从 `GET /v1/conversations` 的 `contactUserId` 取到。**它是某些会话唯一可用的收件人标识** —— 用户启用 WhatsApp 用户名后，除非你与他 30 天内互动过，Meta 不会再下发手机号。

两条限制：

- **one-tap / zero-tap / copy-code 认证模板不能发给 BSUID**（Meta 要求这几种必须用手机号）。平台在发送前本地拒掉并说明原因，而不是让你拿到一个含糊的 `131062` —— 这类模板通常是登录验证码，失败意味着用户登不进去。
- BSUID **按 Business Portfolio 唯一**：拿 A 客户的 BSUID 用 B 客户的号码发送会失败。
