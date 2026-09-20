---
title: "列出 WABA"
excerpt: "列出 WABA，可按 Portfolio 过滤。"
---

`GET /v1/wabas`

列出 WABA，可按 Portfolio 过滤。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `portfolioId` | query | 否 | string |  |


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
    "$ref": "#/components/schemas/Waba"
  }
}
```

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

portfolioId 传空字符串等价于完全不传，都视为"不做过滤"，此时只按当前账户上下文列出全部 WABA，不会因为传了个空字符串就返回空列表——调用方在前端拼参数时如果条件变量恰好是空串，不需要额外判断去删掉这个 query key。
