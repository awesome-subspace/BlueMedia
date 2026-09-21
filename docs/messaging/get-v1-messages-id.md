---
title: "读取最终状态、wamid 和失败原因"
description: "读取最终状态、wamid 和失败原因。"
---

`GET /v1/messages/{id}`

读取最终状态、wamid 和失败原因。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 平台内消息 ID，`msg_...` |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

状态流转：`accepted` → `sending` → `submitted` → `sent` → `delivered` → `read`，任一环节都可能转 `failed`。**`submitted` 只代表 Meta 收下了请求并返回 wamid，不等于已发出**；`sent` 是独立的状态回调，`delivered` 才是到达设备。

失败时，来自 Meta 的 `error.code` 就是 Meta 数字码（可直接对照官方错误码表）；只有账户余额不足、Business Portfolio 预算不足、本地 131049 冷却或重试耗尽等本地判定，才使用我方错误码。`error.message` 是 Meta 原文，不改写；`error.meta` 是整段原生信封（`details` / `userMsg` / `type` / `fbtrace_id`，最后一个是提交 Meta Direct Support 工单时需要的凭据）。`retryable` / `customerAction` / `stage` 是 BlueMedia 的判断而非 Meta 字段（submit 表示尚未投递就被拒，delivery 表示 Meta 已受理后才失败）；同一个失败状态背后可能是性质完全不同的失败，不能只看状态判断是否应该重试。
