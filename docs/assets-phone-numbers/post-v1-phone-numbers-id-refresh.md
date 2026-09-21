---
title: "拉取 Meta 侧号码状态"
excerpt: "拉取 Meta 侧号码状态并落库。"
---

`POST /v1/phone-numbers/{id}/refresh`

拉取 Meta 侧号码状态并落库。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`phone_numbers:manage`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 平台内号码 ID，`pn_...` |


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

### 200 响应 Schema

```json
{
  "$ref": "#/components/schemas/PhoneNumber"
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

和 `GET :id/registration-status` 读的是同一批 Meta 字段，区别在于**这个会写库**：把 nameStatus / qualityRating / verifiedName / messagingLimitTier / throughputLevel 更新到号码行上，之后 `GET /v1/phone-numbers` 和门户列表就能看到。接入完成后平台会自动刷一次，这个接口是手动补一次的入口。

#### 为什么需要它
`nameStatus` 不是 APPROVED 时，Meta 不允许该号码发送消息（会得到 #131037 / #2388103）。不落库的话这个号码在门户上和正常号码看起来一模一样（已连接、质量 GREEN），只能等真正发送被拒才发现，而那时额度预留、扣费、冲正已经走完一整圈。

#### 只覆盖 Meta 权威字段
- Meta 没返回的字段**不写**，不会把已有的正确值擦成 null（Meta 只返回请求到的字段）。
- 不动 wabaId 等本地归属信息。
- 归在 `phone_numbers:manage` 而不是 `:read`，因为它写库。
