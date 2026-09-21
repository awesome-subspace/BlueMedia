---
title: "绑定 Meta Pixel"
description: "绑定或更换该 Business Portfolio 的 Meta Pixel（dataset）。同时把此前因缺 Pixel 而跳过的转化事件重新排队。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--post">POST</span><code class="endpoint-path">/v1/business-portfolios/{id}/dataset</code></div>

绑定或更换该 Business Portfolio 的 Meta Pixel（dataset）。同时把此前因缺 Pixel 而跳过的转化事件重新排队。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`onboarding:write`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 平台内 Business Portfolio ID，`bm_...` |

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `datasetId` | string | 是 | Meta Pixel / dataset id（纯数字） |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "datasetId": {
      "type": "string",
      "description": "string · 必填 — Meta Pixel / dataset id（纯数字）"
    }
  },
  "required": [
    "datasetId"
  ]
}
```

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

正常情况下**不需要调用这个接口**：客户在嵌入式注册（ES v4，登录配置里勾选 Conversions API）时选择的 Pixel 会自动关联到 Business Portfolio。它用于两种情况：客户是在 v4 之前接入的，或者当时没有完成 Pixel 选择。

#### 会重放此前跳过的事件

在没有 Pixel 期间收到的转化事件是**存下来了**的（状态 `skipped`）——webhook 不会重投，事件不可重造，所以宁可先存。绑定成功后它们会被重新排队，响应里的 `requeuedConversionEvents` 是这次重放的条数。只重放 `skipped`：`failed` 的失败原因各不相同（权限、参数），一并重放会把确定失败的事件也捞回来反复重试。

Graph API 上查不到 Business Portfolio 与 Pixel 的绑定关系，因此 BlueMedia 只能依据 ES 会话信息或本接口保存该关联。
