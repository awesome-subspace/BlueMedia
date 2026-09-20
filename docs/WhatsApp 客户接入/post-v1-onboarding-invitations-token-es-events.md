---
title: "客户在邀请页上放弃流程或自助报错时的上报"
excerpt: "【客户侧，无需鉴权】客户在邀请页上放弃流程或自助报错时的上报。恒 202。"
---

`POST /v1/onboarding/invitations/{token}/es-events`

【客户侧，无需鉴权】客户在邀请页上放弃流程或自助报错时的上报。恒 202。

> 📘 鉴权
>
> 此接口不需要 API Key。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `token` | path | 是 | string |  |

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `event` | string | 是 | FINISH* / CANCEL / ERROR |
| `currentStep` | string | 否 | 放弃时所在的屏 |
| `errorCode` | string | 否 | Meta 错误码 |
| `errorMessage` | string | 否 | Meta 错误文案 |
| `metaSessionId` | string | 否 | Meta session_id |
| `timestamp` | integer | 否 | unix 秒 |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "event": {
      "type": "string",
      "description": "string · 必填 — FINISH* / CANCEL / ERROR"
    },
    "currentStep": {
      "type": "string",
      "description": "string · 可选 — 放弃时所在的屏"
    },
    "errorCode": {
      "type": "string",
      "description": "string · 可选 — Meta 错误码"
    },
    "errorMessage": {
      "type": "string",
      "description": "string · 可选 — Meta 错误文案"
    },
    "metaSessionId": {
      "type": "string",
      "description": "string · 可选 — Meta session_id"
    },
    "timestamp": {
      "type": "string",
      "description": "integer · 可选 — unix 秒"
    }
  },
  "required": [
    "event"
  ]
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

归属（账户 / Portfolio）只从链接里的 token 解析，body 无法指定，与 `/complete` 同一条规矩。**token 无效时也返回 202**：这是排查数据，报错只会让这个接口变成一个「该 token 是否存在」的探测器。与其他客户侧接口一样按来源 IP 限流。
