---
title: "收件箱列表"
description: "收件箱列表，按最新活动排序；before(ISO 时间)做游标分页。"
---

`GET /v1/conversations`

收件箱列表，按最新活动排序；before(ISO 时间)做游标分页。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`messages:read`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `limit` | query | 否 | integer 1..200 | 默认 50。超出范围**夹取**而不是报错；无法解析为数字时忽略 |
| `before` | query | 否 | ISO 8601 date-time | keyset 游标：只返回活动时间早于它的会话，取上一页最后一行的时间。无法解析时忽略（等于不传） |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

limit 会被夹到 1–200 之间（超出范围静默纠正，不报错）；before 是游标而非 offset，按最新活动时间倒序翻页，用于避免翻页过程中新消息导致的错位。
