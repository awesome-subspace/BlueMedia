---
title: "OAuth token 端点"
excerpt: "OAuth token 端点：支持 authorization_code 与 refresh_token。"
---

`POST /oauth/token`

OAuth token 端点：支持 authorization_code 与 refresh_token。

> 📘 鉴权
>
> 此接口不需要 API Key。

## 请求

Base URL：`https://api.bsptest.com`

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `grant_type` | string | 是 | `authorization_code` 或 `refresh_token` |
| `client_id` | string | 是 |  |
| `client_secret` | string | 是 | 客户端认证方式就是它——所以本端点**不挂 API Key 鉴权** |
| `code` | string | 否 | grant_type=authorization_code 时必填 |
| `redirect_uri` | string | 否 | grant_type=authorization_code 时必填，且必须与签发时**逐字一致**（RFC 6749 §4.1.3） |
| `code_verifier` | string | 否 | 授权时带了 code_challenge 就**必须**带它，否则 400——允许省略等于让截获 code 的人一句不传就绕过整个 PKCE |
| `refresh_token` | string | 否 | grant_type=refresh_token 时必填 |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "grant_type": {
      "type": "string",
      "description": "string · 必填 — `authorization_code` 或 `refresh_token`"
    },
    "client_id": {
      "type": "string",
      "description": "string · 必填 — "
    },
    "client_secret": {
      "type": "string",
      "description": "string · 必填 — 客户端认证方式就是它——所以本端点**不挂 API Key 鉴权**"
    },
    "code": {
      "type": "string",
      "description": "string · 可选 — grant_type=authorization_code 时必填"
    },
    "redirect_uri": {
      "type": "string",
      "description": "string · 可选 — grant_type=authorization_code 时必填，且必须与签发时**逐字一致**（RFC 6749 §4.1.3）"
    },
    "code_verifier": {
      "type": "string",
      "description": "string · 可选 — 授权时带了 code_challenge 就**必须**带它，否则 400——允许省略等于让截获 code 的人一句不传就绕过整个 PKCE"
    },
    "refresh_token": {
      "type": "string",
      "description": "string · 可选 — grant_type=refresh_token 时必填"
    }
  },
  "required": [
    "grant_type",
    "client_id",
    "client_secret"
  ]
}
```


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

### 200 响应 Schema

```json
{
  "$ref": "#/components/schemas/OAuthTokenResponse"
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

#### 响应

`access_token`、`refresh_token`、`token_type: Bearer`、`expires_in`（秒）、`scope`、`account_id`、`project_id`、`connection_id`。

#### 有效期与轮换

access token **1 小时**，refresh token **30 天**。每次 refresh 都**轮换**：旧的一对立即撤销，签发全新一对。这不是为了省事——refresh token 泄露后，轮换让泄露者与真客户端只有一个能继续用，另一个的下次 refresh 失败即是异常信号；而「续期同一行」会让泄露副本永久可用且没有任何迹象。

#### 失败语义

authorization code 的「不存在 / 已用过 / 已过期」返回**同一句文案**，刻意不区分——区分开来这个端点就成了 code 状态的探测器。code 的消费用一条条件 UPDATE 完成（`WHERE used_at IS NULL AND expires_at > now()`，数据库时钟判定），而不是先查再写：两个并发请求会同时通过查询各换到一份 token，而授权码重放正是 OAuth 最经典的攻击。

#### 用 access token 调业务接口

`Authorization: Bearer oat_...`，与 API Key 使用相同的请求头。Access token 的可访问范围固定为授权时选择的 Business Portfolio，不能通过请求参数扩大，也不能访问其它客户资产。
