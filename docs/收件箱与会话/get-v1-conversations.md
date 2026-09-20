---
title: "收件箱列表"
excerpt: "收件箱列表，按最新活动排序；before(ISO 时间)做游标分页。"
---

`GET /v1/conversations`

收件箱列表，按最新活动排序；before(ISO 时间)做游标分页。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`messages:read`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `limit` | query | 否 | string |  |
| `before` | query | 否 | string |  |


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

limit 会被夹到 1–200 之间（超出范围静默纠正，不报错）；before 是游标而非 offset，按最新活动时间倒序翻页，用于避免翻页过程中新消息导致的错位。
