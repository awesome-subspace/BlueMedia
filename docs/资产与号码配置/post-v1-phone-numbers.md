---
title: "手工创建业务号码记录"
excerpt: "手工创建业务号码记录。"
---

`POST /v1/phone-numbers`

手工创建业务号码记录。

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
| `wabaId` | string | 是 | 所属 waba_... |
| `displayNumber` | string | 是 | 展示号码 |
| `verifiedName` | string | 否 | 已验证名称 |
| `coexistenceMode` | string | 否 | 共存模式 |

Content-Type：`application/json`
示例：

```json
{
  "wabaId": "waba_...",
  "metaPhoneNumberId": "<phone_number_id>",
  "displayNumber": "+8613800000000"
}
```

Schema：

```json
{
  "type": "object",
  "properties": {
    "wabaId": {
      "type": "string",
      "description": "string · 必填 — 所属 waba_..."
    },
    "displayNumber": {
      "type": "string",
      "description": "string · 必填 — 展示号码"
    },
    "verifiedName": {
      "type": "string",
      "description": "string · 可选 — 已验证名称"
    },
    "coexistenceMode": {
      "type": "string",
      "description": "string · 可选 — 共存模式"
    }
  },
  "required": [
    "wabaId",
    "displayNumber"
  ],
  "example": {
    "wabaId": "waba_...",
    "metaPhoneNumberId": "<phone_number_id>",
    "displayNumber": "+8613800000000"
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

只在本地创建号码记录，不调用 Meta；号码必须先在 WhatsApp Manager 完成添加与所有权验证，这里只是把已知号码同步到当前账户。`coexistenceMode` 是自由文本记录字段（默认 `none`），当前不校验取值，也不驱动任何 Meta 调用逻辑。
