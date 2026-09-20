---
title: "我的价目表"
excerpt: "我的价目表：各 market / 类别的单价（已按售价策略换算）。"
---

`GET /v1/pricing/rates`

我的价目表：各 market / 类别的单价（已按售价策略换算）。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`billing:read`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `currency` | query | 否 | string |  |
| `portfolioId` | query | 否 | string |  |
| `market` | query | 否 | string |  |
| `category` | query | 否 | string |  |


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

按当前生效的费率表版本与授权账户的售价策略算出**客户单价**。`currency` 缺省 USD；该币种还没有已发布版本时返回 `effectiveFrom: null` 与空列表，而不是 400。

#### 三样东西刻意不在返回里

`providerCost`（我们的成本）、`markupBps`（加价率）、以及命中的**档位**。前两个是成本信息；档位是成本侧概念，且它会因为**别的 partner** 发的量而变化（Meta 文档 Example 4），透出去会让人以为自己的单价随用量下降 —— 而默认策略 `META_LIST` 恰恰不透传折扣。

`portfolioId` 只能指定当前 API Key 授权范围内的 Business Portfolio；传入其它值不会扩大查询范围。

`market` 同样接受国家名与 Meta 文档的 `and` 写法（见 `price-quote`）。认不出时返回 **400**，不是静默忽略该筛选条件 —— 静默忽略会让你以为自己看到的是「这个 market 的价」，其实是所有 market 的。
