---
title: "提交 Meta 授权结果"
description: "【客户侧，无需鉴权】提交 Meta 授权结果并触发接入编排。账户与 Portfolio 只取自邀请记录，body 无法覆盖；多传字段会被拒绝。返回 202 不代表接入成功，须读 status。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--post">POST</span><code class="endpoint-path">/v1/onboarding/invitations/{token}/complete</code></div>

【客户侧，无需鉴权】提交 Meta 授权结果并触发接入编排。账户与 Portfolio 只取自邀请记录，body 无法覆盖；多传字段会被拒绝。返回 202 不代表接入成功，须读 status。

:::note[鉴权]

此接口不需要 API Key。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `token` | path | 是 | string | 邀请链接里的一次性 token |

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `code` | string | 是 | Meta OAuth 一次性授权码 |
| `wabaId` | string | 是 | Meta 返回的 WABA ID（纯数字） |
| `phoneNumberId` | string | 否 | Meta 返回的 Phone Number ID（纯数字）。可以没有——ES v3 起客户可以只接入 WABA |
| `esVersion` | v2 \| v3 \| v4 | 否 | 本次流程用的 ES 版本 |
| `sessionInfo` | object | 否 | ES 会话信息原文 |

Content-Type：`application/json`
示例：

```json
{
  "code": "<META_OAUTH_CODE>",
  "wabaId": "<META_WABA_ID>",
  "phoneNumberId": "<META_PHONE_NUMBER_ID>"
}
```

Schema：

```json
{
  "type": "object",
  "properties": {
    "code": {
      "type": "string",
      "description": "string · 必填 — Meta OAuth 一次性授权码"
    },
    "wabaId": {
      "type": "string",
      "description": "string · 必填 — Meta 返回的 WABA ID（纯数字）"
    },
    "phoneNumberId": {
      "type": "string",
      "description": "string · 可选 — Meta 返回的 Phone Number ID（纯数字）。可以没有——ES v3 起客户可以只接入 WABA"
    },
    "esVersion": {
      "type": "string",
      "description": "v2 | v3 | v4 · 可选 — 本次流程用的 ES 版本"
    },
    "sessionInfo": {
      "type": "string",
      "description": "object · 可选 — ES 会话信息原文"
    }
  },
  "required": [
    "code",
    "wabaId"
  ],
  "example": {
    "code": "<META_OAUTH_CODE>",
    "wabaId": "<META_WABA_ID>",
    "phoneNumberId": "<META_PHONE_NUMBER_ID>"
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

#### 并发安全
抢占顺序是先做一次原子的 `WHERE status='pending' AND expires_at>now()` 条件更新，抢到之后才开始跑编排——即使客户在落地页上手抖双击提交按钮，也不会在 Meta 侧并发建出两套订阅/资产。如果编排在真正建出 operation 记录之前就抛错（例如目标 Portfolio 在生成链接之后被平台方删除了），邀请会被自动放回 `pending` 以便客户重新提交，而不会永久卡死在"处理中"这个死态。

#### 响应是脱敏投影
只含 status/currentStep/steps/requiredInput/error，**不回** operation id 本身。其中 `requiredInput` 专门用来让落地页立即区分当前失败属于哪一类：
- 需要客户**重新走一遍 Meta 授权**（换一个新 code 重试）
- 客户端解决不了，**需要联系对接人**介入

不必等下一轮 `/status` 轮询才能改判提示文案。
