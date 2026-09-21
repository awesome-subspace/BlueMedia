---
title: "触发所有权验证"
description: "触发所有权验证（两阶段协议的第二阶段）。"
---

`POST /v1/webhook-endpoints/{id}/verify`

触发所有权验证（两阶段协议的第二阶段）。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 回调端点 ID，`whe_...` |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `201` | Created |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

#### 为什么要分两阶段
创建响应里才返回 secret，而调用方要拿到响应之后才能把它存起来。如果平台在创建时就立刻发验证挑战，接收端手上还没有 secret 可用于验签，挑战必然失败、端点永远卡在 `pending`。所以顺序固定为：创建（拿到 secret）→ 自己保存好 → 调本接口。

#### 挑战的形状
平台**同步**向该端点 POST 一条 `webhook.verification` 事件，`data.challenge` 是一次性随机值，并**按正常投递规则签名** —— 这正是验证的意义：能验通这一条，就能验通后续所有真实事件。接收方需返回 2xx，且响应 JSON 里回显同一个 `challenge`（顶层或 `data.challenge` 都接受）。

#### 结果
成功 → 状态转 `active`，开始投递。失败 → **保持 `pending`**（不会变成 disabled），原因记在 `metadata.last_verification_error`，修好接收端后可以再调一次。挑战超时 5s，响应体只读前 4 KB。
