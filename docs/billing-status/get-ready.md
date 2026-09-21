---
title: "PostgreSQL 与 Redis 就绪检查"
description: "PostgreSQL 与 Redis 就绪检查。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--get">GET</span><code class="endpoint-path">/ready</code></div>

PostgreSQL 与 Redis 就绪检查。

:::note[鉴权]

此接口不需要 API Key。

:::

## 请求

Base URL：`https://api.bsptest.com`

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

并发检查 Postgres 和 Redis 两个健康指标，任一异常返回 503；比 /live 更适合做流量准入判断。
