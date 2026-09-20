---
title: "列出端点"
excerpt: "列出端点；不返回 secret。每个端点带 `lastDelivery`（该端点最近一次投递的 status / responseStatus / attempts / lastError / createdAt），从未投递过为 `null`。刻意不提供 delivered/failed 计数：那是随消息量线性变慢的 COUNT 聚合。"
---

`GET /v1/webhook-endpoints`

列出端点；不返回 secret。每个端点带 `lastDelivery`（该端点最近一次投递的 status / responseStatus / attempts / lastError / createdAt），从未投递过为 `null`。刻意不提供 delivered/failed 计数：那是随消息量线性变慢的 COUNT 聚合。

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

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

每个端点的 lastDelivery 由一条 LEFT JOIN LATERAL 查询取得，而不是逐端点查询或 DISTINCT ON，依赖迁移新增的 (endpoint_id, created_at DESC) 索引才能保持常数级开销。
