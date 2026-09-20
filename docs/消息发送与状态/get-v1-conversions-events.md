---
title: "列出当前授权范围内的转化事件及上报状态"
excerpt: "列出当前授权范围内的转化事件及上报状态。"
---

`GET /v1/conversions/events`

列出当前授权范围内的转化事件及上报状态。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`messages:read`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

查询参数：`limit`（默认 50，最大 200）、`status`、`portfolioId`（只看指定 Business Portfolio）。

`status` 的含义：`pending` 待上报（含退避重试中）、`sending` 本轮正在上报、`sent` 已被 Meta 接受、`failed` 不可重试的失败（`lastError` 是原因）、`skipped` 落库时该 Business Portfolio 还没绑定 Pixel。

`source` 区分事件来源：`api` 是本接口报的，`automatic_events` 是 Meta 用 NLP 从广告对话里自动识别出来的（需要客户在接入时勾选「自动识别订单和线索」）。
