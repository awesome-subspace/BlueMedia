---
title: "取消额度授权"
description: "取消该 WABA 所属 Business Portfolio 的 BlueMedia 信用额度授权，之后发送模板消息会被 CREDIT_LINE_NOT_READY 拦下。**只更新 BlueMedia 状态，不调用 Meta 撤销**：Meta 的撤销按客户 business 生效，会连带影响该客户全部已共享 WABA，且额度线挂到 WABA 后无法单独摘除。影响范围是整个 Business Portfolio。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--post">POST</span><code class="endpoint-path">/v1/wabas/{id}/credit-line/deauthorize</code></div>

取消该 WABA 所属 Business Portfolio 的 BlueMedia 信用额度授权，之后发送模板消息会被 CREDIT_LINE_NOT_READY 拦下。**只更新 BlueMedia 状态，不调用 Meta 撤销**：Meta 的撤销按客户 business 生效，会连带影响该客户全部已共享 WABA，且额度线挂到 WABA 后无法单独摘除。影响范围是整个 Business Portfolio。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`onboarding:write`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 平台内 WABA ID，`waba_...` |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

#### 撤销后的本地行为

- 立即拦截该 Business Portfolio 下**所有** WABA（包括已是 `attached` 状态的）继续发送模板消息的请求。
- 清空之前排好的"下一次自动重试挂载"时间点，避免后台 scheduler 在授权已撤销后还把这个 WABA 捡回去重试。

#### 为什么是纯本地操作

整个过程**不向 Meta 发出任何调用**（原因见上方说明：Meta 侧无法单独摘除单个 WABA 的额度线）。因此如果之后重新调用 authorize，也不会走"Meta 侧其实已经共享过了"这类幂等短路逻辑——重新授权的判断只依据本地状态，与 Meta 此刻真实的共享情况完全脱钩。
