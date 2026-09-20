---
title: "生成客户接入链接"
excerpt: "为指定客户和 Business Portfolio 生成一次性接入链接。明文 URL 只在本响应里返回一次（库内只存哈希），请立即发给客户。"
---

`POST /v1/onboarding/invitations`

为指定客户和 Business Portfolio 生成一次性接入链接。明文 URL 只在本响应里返回一次（库内只存哈希），请立即发给客户。

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
| `tenantId` | string | 否 | 内部归属字段；客户调用时省略 |
| `portfolioId` | string | 是 | 必须属于目标账户，bm_... |
| `expiresInSeconds` | number | 否 | 300 至 86400，默认 1800 |

Content-Type：`application/json`
示例：

```json
{
  "tenantId": "tenant_x",
  "portfolioId": "bm_x",
  "expiresInSeconds": 1800
}
```

Schema：

```json
{
  "type": "object",
  "properties": {
    "tenantId": {
      "type": "string",
      "description": "string · 可选 — 内部归属字段；客户调用时省略"
    },
    "portfolioId": {
      "type": "string",
      "description": "string · 必填 — 必须属于目标账户，bm_..."
    },
    "expiresInSeconds": {
      "type": "string",
      "description": "number · 可选 — 300 至 86400，默认 1800"
    }
  },
  "required": [
    "portfolioId"
  ],
  "example": {
    "tenantId": "tenant_x",
    "portfolioId": "bm_x",
    "expiresInSeconds": 1800
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

`portfolioId` 必须位于当前授权范围内，否则返回 404。Token 本身是 32 字节随机数的 base64url 编码（43 字符），库内只存其 SHA-256 哈希，明文只在本次创建响应出现一次，遗失只能重新生成——这与 API Key 的存储方式是同一套安全模型。创建人字段仅用于事后审计，不影响客户侧流程。
