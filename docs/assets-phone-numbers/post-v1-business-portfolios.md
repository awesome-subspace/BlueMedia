---
title: "手工创建 Portfolio"
description: "手工创建 Portfolio；推荐使用 Embedded Signup。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--post">POST</span><code class="endpoint-path">/v1/business-portfolios</code></div>

手工创建 Portfolio；推荐使用 Embedded Signup。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

## 响应

| 状态码 | 说明 |
| --- | --- |
| `201` | Created |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

属于手工兜底路径，正常客户接入流程应该走 Embedded Signup（会自动建出 Portfolio 并挂上 WABA），这个接口主要给运维处理特殊/历史数据用；`metaBmId`（对应 Meta 那边真实的 Business Manager ID）可以先留空，后续再通过 PATCH 补上，但一旦补上就会触发 PATCH 里描述的那些校验联动。
