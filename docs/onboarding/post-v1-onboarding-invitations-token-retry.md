---
title: "首次授权失败后"
description: "【客户侧，无需鉴权】首次授权失败后，用新的 Meta code 继续**同一条** operation（不会新建接入任务）。只接受 code：wabaId/phoneNumberId 已记在 operation 上，重试时不允许更换目标资产。仅 failed 且链接未过期的邀请可重试；已完成的返回 409。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--post">POST</span><code class="endpoint-path">/v1/onboarding/invitations/{token}/retry</code></div>

【客户侧，无需鉴权】首次授权失败后，用新的 Meta code 继续**同一条** operation（不会新建接入任务）。只接受 code：wabaId/phoneNumberId 已记在 operation 上，重试时不允许更换目标资产。仅 failed 且链接未过期的邀请可重试；已完成的返回 409。

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
| `code` | string | 是 | 新的 Meta OAuth 一次性授权码 |

Content-Type：`application/json`
示例：

```json
{
  "code": "<FRESH_META_OAUTH_CODE>"
}
```

Schema：

```json
{
  "type": "object",
  "properties": {
    "code": {
      "type": "string",
      "description": "string · 必填 — 新的 Meta OAuth 一次性授权码"
    }
  },
  "required": [
    "code"
  ],
  "example": {
    "code": "<FRESH_META_OAUTH_CODE>"
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

#### 抢占失败时的诊断
抢占条件比 complete 更严格：要求邀请状态恰好是 `failed`、链接未过期、且已经绑定过 operationId。抢不到时不会笼统报错，而是先诊断具体原因再给出对应提示：
- `completed` → "无需重试"
- `pending`（从未成功提交过）→ "尚未提交过，请先完成授权"
- `running`（正在处理中）→ "正在处理中，请稍候"，并标注 `retryable:true` 供落地页轮询
- `failed` 但链接已过期 → 等价于"邀请已失效"

#### 续跑语义
底层复用 retryEmbeddedSignup **从上次失败的那一步续跑**，已经成功执行过的订阅/号码注册步骤不会重复执行。如果这次重试又抛错，邀请会被放回 `failed`（而不是像 complete 失败时那样放回 pending）——刻意保持"已经提交过一次"的语义，保证下一次仍然走本接口而不是误落回首次提交的 complete。
