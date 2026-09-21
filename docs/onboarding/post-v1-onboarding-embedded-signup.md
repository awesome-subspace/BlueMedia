---
title: "完成接入"
description: "完成接入，返回 201 和可追踪的操作记录。"
---

`POST /v1/onboarding/embedded-signup`

完成接入，返回 201 和可追踪的操作记录。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`onboarding:write`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `portfolioId` | string | 是 | 平台内 Business Portfolio ID，bm_... |
| `code` | string | 是 | Meta OAuth 一次性授权码 |
| `wabaId` | string | 是 | Meta 返回的 WABA ID |
| `phoneNumberId` | string | 否 | Meta 返回的 Phone Number ID。**可以没有**：ES v3 起客户可以不带号码收尾，号码之后再补 |
| `esVersion` | v2 \| v3 \| v4 | 否 | 本次流程用的 ES 版本，仅用于排查（灰度期两套并存） |
| `sessionInfo` | object | 否 | ES message 事件回传的会话信息原文，含客户选中的资产 id（`dataset_ids` 即 Pixel/dataset） |

Content-Type：`application/json`
示例：

```json
{
  "portfolioId": "bm_x",
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
    "portfolioId": {
      "type": "string",
      "description": "string · 必填 — 平台内 Business Portfolio ID，bm_..."
    },
    "code": {
      "type": "string",
      "description": "string · 必填 — Meta OAuth 一次性授权码"
    },
    "wabaId": {
      "type": "string",
      "description": "string · 必填 — Meta 返回的 WABA ID"
    },
    "phoneNumberId": {
      "type": "string",
      "description": "string · 可选 — Meta 返回的 Phone Number ID。**可以没有**：ES v3 起客户可以不带号码收尾，号码之后再补"
    },
    "esVersion": {
      "type": "string",
      "description": "v2 | v3 | v4 · 可选 — 本次流程用的 ES 版本，仅用于排查（灰度期两套并存）"
    },
    "sessionInfo": {
      "type": "string",
      "description": "object · 可选 — ES message 事件回传的会话信息原文，含客户选中的资产 id（`dataset_ids` 即 Pixel/dataset）"
    }
  },
  "required": [
    "portfolioId",
    "code",
    "wabaId"
  ],
  "example": {
    "portfolioId": "bm_x",
    "code": "<META_OAUTH_CODE>",
    "wabaId": "<META_WABA_ID>",
    "phoneNumberId": "<META_PHONE_NUMBER_ID>"
  }
}
```

## 响应

| 状态码 | 说明 |
| --- | --- |
| `201` | Created |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

#### 编排的五个阶段
- 用 `code` 向 Meta 换取该 Portfolio 的客户 System User token，加密（AES-256-GCM）保存。
- 校验该 token 确实拥有目标 WABA/号码的资产授权。
- 向 Meta 订阅应用（subscribeApp）。
- 若本次请求带了号码注册意图，调用注册（PIN 懒生成并加密保存）。
- 把最终的 WABA/号码详情同步落库。

#### 失败了怎么办
进度落库、可恢复：任一步失败即中断，`currentStep`/`lastError*` 停在失败处，此后必须调用 retry 接口**从断点续跑**——重新 POST 本接口会新建一个全新的 operation，而不是继续旧的。

portfolioId 必须已存在于当前账户下，不存在直接 404，不会隐式创建。
