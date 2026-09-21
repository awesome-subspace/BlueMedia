---
title: "我的价目表"
description: "我的价目表：各 market / 类别的单价（已按售价策略换算）。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--get">GET</span><code class="endpoint-path">/v1/pricing/rates</code></div>

我的价目表：各 market / 类别的单价（已按售价策略换算）。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。本端点当前**不强制额外 scope**（任意有效 API Key 均可调用）；它读的是本账户自己的计费口径，建议仍用带 `billing:read` 的 Key 调用。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `currency` | query | 否 | string（ISO 4217） | 默认 `USD`，大小写不敏感。该币种没有已发布的价目表时返回 `effectiveFrom: null` 与空列表，不是 404 |
| `portfolioId` | query | 否 | string | 按该 Business Portfolio 的合同价计算，`bm_...`。**绑定到单个 Portfolio 的 API Key 会被强制收窄到自己绑定的那个**，传别的值不生效 |
| `market` | query | 否 | string | 按 market 过滤。同时接受价目表里的 market 名（`&` 与 `and` 两种写法）和国家名（如 `Ukraine`）。**认不出时返回 `400 VALIDATION_FAILED`**，`details.knownMarkets` 给出合法取值——不会静默忽略这个筛选条件 |
| `category` | query | 否 | string | 按类别过滤（`MARKETING` / `UTILITY` / `AUTHENTICATION` / `SERVICE`） |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

按当前生效的费率表版本与授权账户的售价策略算出**客户单价**。`currency` 缺省 USD；该币种还没有已发布版本时返回 `effectiveFrom: null` 与空列表，而不是 400。

#### 三样东西刻意不在返回里

`providerCost`（我们的成本）、`markupBps`（加价率）、以及命中的**档位**。前两个是成本信息；档位是成本侧概念，且它会因为**别的 partner** 发的量而变化（Meta 文档 Example 4），透出去会让人以为自己的单价随用量下降 —— 而默认策略 `META_LIST` 恰恰不透传折扣。

`portfolioId` 只能指定当前 API Key 授权范围内的 Business Portfolio；传入其它值不会扩大查询范围。

`market` 同样接受国家名与 Meta 文档的 `and` 写法（见 `price-quote`）。认不出时返回 **400**，不是静默忽略该筛选条件 —— 静默忽略会让你以为自己看到的是「这个 market 的价」，其实是所有 market 的。
