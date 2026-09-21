---
title: "列出当前授权范围内的转化事件及上报状态"
description: "列出当前授权范围内的转化事件及上报状态。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--get">GET</span><code class="endpoint-path">/v1/conversions/events</code></div>

列出当前授权范围内的转化事件及上报状态。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`messages:read`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `limit` | query | 否 | integer 1..200 | 默认 50。超出范围**夹取**而不是报错；无法解析为数字时按 50 处理 |
| `status` | query | 否 | `pending` \| `sending` \| `sent` \| `failed` \| `skipped` | 按上报状态过滤。空串等于不过滤 |
| `portfolioId` | query | 否 | string | 只看指定 Business Portfolio，`bm_...`。空串等于不过滤 |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

`status` 的含义：`pending` 待上报（含退避重试中）、`sending` 本轮正在上报、`sent` 已被 Meta 接受、`failed` 不可重试的失败（`lastError` 是原因）、`skipped` 落库时该 Business Portfolio 还没绑定 Pixel。

`source` 区分事件来源：`api` 是本接口报的，`automatic_events` 是 Meta 用 NLP 从广告对话里自动识别出来的（需要客户在接入时勾选「自动识别订单和线索」）。
