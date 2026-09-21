---
title: "用 6 位 PIN 注册号码"
excerpt: "用 6 位 PIN 注册号码。"
---

`POST /v1/phone-numbers/{id}/register`

用 6 位 PIN 注册号码。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`phone_numbers:manage`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 平台内号码 ID，`pn_...` |

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `pin` | string | 是 | 6 位数字 |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "pin": {
      "type": "string",
      "description": "string · 必填 — 6 位数字"
    }
  },
  "required": [
    "pin"
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

`pin` 是双重语义：既是"首次注册时设置的两步验证 PIN"，也是"号码已开启两步验证时的现有 PIN"，Meta 不区分这两种情况。

#### 前置条件
本接口**不检查**是否已完成 request-code/verify-code：
- 已在 WhatsApp Manager 验证过所有权的号码 → 可直接注册。
- 未验证所有权的号码直接 register → 会被 Meta 拒绝（先走 request-code/verify-code）。

#### 限流
72 小时内最多 10 次注册请求（Meta 侧规则），超限会封禁该号码 72 小时的注册能力。成功后本地状态被硬编码为已连接，不解析 Meta 返回体做校验。
