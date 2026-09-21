---
title: "一次性确认开启该 WABA 的模板分析"
excerpt: "一次性确认开启该 WABA 的模板分析。**开了不能关**。"
---

`POST /v1/templates/analytics/enable`

一次性确认开启该 WABA 的模板分析。**开了不能关**。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`templates:manage`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `wabaId` | string | 是 | 内部 WABA id（waba_...） |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "wabaId": {
      "type": "string",
      "description": "string · 必填 — 内部 WABA id（waba_...）"
    }
  },
  "required": [
    "wabaId"
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
  "$ref": "#/components/schemas/TemplateInsightsEnabled"
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

单独一个接口、而不是在读接口里顺手开：按 Meta 的说明，确认开启等于授权 Meta 收集并匿名化你与客户的聊天数据、并对模板里的链接做点击跟踪，而且**一旦开启无法关闭**。这种决定必须有人明确按下去。

开启后 Meta 才开始为这个 WABA 采集模板分析数据 —— 也就是说**开启之前的历史数据不会有**。
