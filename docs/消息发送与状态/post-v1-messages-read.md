---
title: "标记一条入站消息为已读"
excerpt: "标记一条入站消息为已读(可选附带输入中指示器)；实时生效、不计费，不是发送。"
---

`POST /v1/messages/read`

标记一条入站消息为已读(可选附带输入中指示器)；实时生效、不计费，不是发送。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`messages:send`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `phoneNumberId` | string | 是 | 平台内号码 ID，pn_... |
| `messageId` | string | 是 | 入站消息的 wamid.* |
| `typing` | boolean | 否 | true 时附带「对方正在输入」指示器 |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "phoneNumberId": {
      "type": "string",
      "description": "string · 必填 — 平台内号码 ID，pn_..."
    },
    "messageId": {
      "type": "string",
      "description": "string · 必填 — 入站消息的 wamid.*"
    },
    "typing": {
      "type": "string",
      "description": "boolean · 可选 — true 时附带「对方正在输入」指示器"
    }
  },
  "required": [
    "phoneNumberId",
    "messageId"
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

直连 Meta 实时接口，不经过 Transactional Outbox、不占用发送配额/限流；typing=true 时附带的输入中指示器只在很短时间内（约 25 秒或下一条消息之前）生效，且只有窗口内、messageId 对应的原始入站消息仍有效（Meta 建议 30 天内标记）才会成功。
