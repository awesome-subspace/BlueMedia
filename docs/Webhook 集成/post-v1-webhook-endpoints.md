---
title: "创建账户回调端点"
excerpt: "创建账户回调端点。回调携带 X-Webhook-Signature-256: sha256=...；使用端点 secret 对原始请求体做 HMAC-SHA256，secret 只返回一次。"
---

`POST /v1/webhook-endpoints`

创建账户回调端点。回调携带 X-Webhook-Signature-256: sha256=...；使用端点 secret 对原始请求体做 HMAC-SHA256，secret 只返回一次。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `url` | URL | 是 | 接收回调的 HTTPS 地址 |
| `events` | message \| status \| change \| probe \| * | 否 | 订阅事件 |
| `secret` | string | 否 | 至少 16 字符；省略时平台生成 |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "description": "URL · 必填 — 接收回调的 HTTPS 地址"
    },
    "events": {
      "type": "string",
      "description": "message | status | change | probe | * · 可选 — 订阅事件"
    },
    "secret": {
      "type": "string",
      "description": "string · 可选 — 至少 16 字符；省略时平台生成"
    }
  },
  "required": [
    "url"
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

若省略 secret，平台自动生成；生成值只在这一次创建响应里返回，服务端此后只保存密文/哈希，无法再明文取回，遗失只能重新创建端点。events 省略等于订阅 message/status/change/probe 全部四类，不是"不订阅"。
