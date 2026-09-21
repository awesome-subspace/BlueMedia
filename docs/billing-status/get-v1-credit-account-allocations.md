---
title: "Business Portfolio 预算总览"
description: "Business Portfolio 预算总览：账户余额及各 Portfolio 的上限、已用与剩余。"
---

`GET /v1/credit-account/allocations`

Business Portfolio 预算总览：账户余额及各 Portfolio 的上限、已用与剩余。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`billing:read`。API Key 的可访问资源由当前授权范围决定。

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

#### 账户额度与 Portfolio 预算

钱只有一个池子——当前账户的信用余额。Business Portfolio 预算是这个余额之上的**支出上限**，不是第二个钱包；调整预算不会改变账户余额，也不存在“把钱转回来”的动作。

#### allocatedMinor = null 表示不限额

没有设置过预算的 Portfolio 返回 `allocatedMinor: null`（以及 `remainingMinor: null`），意思是**只受账户余额约束**，不是“额度为 0”。要冻结一个 Portfolio 请显式设为 0。列表中也会包含尚未设置预算的 Portfolio。

#### 允许超分配

各 Portfolio 预算上限之和可以超过账户余额，此时 `overAllocated: true`。这是提示而不是错误，真实消费仍按账户剩余余额先到先得。

`reservedMinor` 是已发出、尚未结算的冻结部分；剩余额度 = `allocatedMinor − spentMinor − reservedMinor`。
