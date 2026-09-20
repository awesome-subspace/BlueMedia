---
title: "Business Portfolio 预算对账"
excerpt: "Business Portfolio 预算对账：spent 计数与账本汇总的差额。"
---

`GET /v1/credit-account/allocations/audit`

Business Portfolio 预算对账：spent 计数与账本汇总的差额。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`billing:read`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

`spentMinor` 是发送路径在 reserve / settle / reverse 三处维护的**增量计数**，账本（`ledger_entries`）是权威口径。若某次更新遗漏，Business Portfolio 的预算统计会产生长期偏差，因此本接口并列返回两个口径：`driftMinor = counterSpentMinor − ledgerSpentMinor`，正常应为 0。

**只读，不自动修**：自动对齐会把「哪条代码路径漏了更新」这个真正的问题一起抹掉。发现非 0 请提工单。
