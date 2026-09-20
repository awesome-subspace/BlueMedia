---
title: "上报一次 Embedded Signup 会话事件"
excerpt: "上报一次 Embedded Signup 会话事件（客户放弃在哪一屏、或客户自助报错）。恒 202。"
---

`POST /v1/onboarding/es-events`

上报一次 Embedded Signup 会话事件（客户放弃在哪一屏、或客户自助报错）。恒 202。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`onboarding:write`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `portfolioId` | string | 是 | 这次流程针对的 Business Portfolio，bm_... |
| `event` | string | 是 | ES message 事件的 event 值：FINISH* / CANCEL / ERROR |
| `esVersion` | v2 \| v3 \| v4 | 否 | 发起时用的 ES 版本 |
| `currentStep` | string | 否 | 放弃时所在的屏，如 PHONE_NUMBER_SETUP |
| `errorCode` | string | 否 | 客户在流程里自助报错时 Meta 给的错误码 |
| `errorMessage` | string | 否 | 同上，展示给客户的那句错误文案 |
| `metaSessionId` | string | 否 | Meta 的 session_id——**找 Meta 支持时必须提供** |
| `timestamp` | integer | 否 | Meta 给的 unix 秒（仅报错事件有） |

Content-Type：`application/json`
示例：

```json
{
  "portfolioId": "bm_x",
  "event": "CANCEL",
  "currentStep": "PHONE_NUMBER_SETUP",
  "esVersion": "v4"
}
```

Schema：

```json
{
  "type": "object",
  "properties": {
    "portfolioId": {
      "type": "string",
      "description": "string · 必填 — 这次流程针对的 Business Portfolio，bm_..."
    },
    "event": {
      "type": "string",
      "description": "string · 必填 — ES message 事件的 event 值：FINISH* / CANCEL / ERROR"
    },
    "esVersion": {
      "type": "string",
      "description": "v2 | v3 | v4 · 可选 — 发起时用的 ES 版本"
    },
    "currentStep": {
      "type": "string",
      "description": "string · 可选 — 放弃时所在的屏，如 PHONE_NUMBER_SETUP"
    },
    "errorCode": {
      "type": "string",
      "description": "string · 可选 — 客户在流程里自助报错时 Meta 给的错误码"
    },
    "errorMessage": {
      "type": "string",
      "description": "string · 可选 — 同上，展示给客户的那句错误文案"
    },
    "metaSessionId": {
      "type": "string",
      "description": "string · 可选 — Meta 的 session_id——**找 Meta 支持时必须提供**"
    },
    "timestamp": {
      "type": "string",
      "description": "integer · 可选 — Meta 给的 unix 秒（仅报错事件有）"
    }
  },
  "required": [
    "portfolioId",
    "event"
  ],
  "example": {
    "portfolioId": "bm_x",
    "event": "CANCEL",
    "currentStep": "PHONE_NUMBER_SETUP",
    "esVersion": "v4"
  }
}
```


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `201` | Created |
| `202` | Accepted |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

#### 为什么要有这个接口
Embedded Signup 的会话信息（session info logging，ES v3 起默认开启）**只在浏览器的一次 `message` 事件里出现**，Graph API 上查不到。里面有两样东西丢了就再也拿不回来：客户在哪一屏放弃（唯一的接入漏斗数据），以及客户自助报错时的 `session_id`（找 Meta 支持的凭据）。

#### 它是排查数据，不是业务写入
恒返回 202，不校验业务语义，落库失败也只记日志。前端应当 fire-and-forget：一次上报失败绝不能变成客户屏幕上的报错。请求体是 `.strict()` 的，多传字段会 400——**尤其不要把 `code` 传进来**，那是 30 秒有效的凭证，不进这张表。
