---
title: "列出 Portfolios"
excerpt: "列出当前 API Key 可访问的 Business Portfolios。"
---

`GET /v1/business-portfolios`

列出当前 API Key 可访问的 Business Portfolios。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

### 200 响应 Schema

```json
{
  "type": "array",
  "items": {
    "$ref": "#/components/schemas/BusinessPortfolio"
  }
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

只返回当前 API Key 授权范围内的 Business Portfolio。调用方不能通过查询参数扩大可见范围；无权访问或不存在的资源不会通过本接口泄露。
