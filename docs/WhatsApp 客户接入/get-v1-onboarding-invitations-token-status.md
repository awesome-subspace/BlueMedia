---
title: "轮询接入进度"
excerpt: "【客户侧，无需鉴权】轮询接入进度。仅返回脱敏步骤与错误，不含任何 Token、code 或账户信息。"
---

`GET /v1/onboarding/invitations/{token}/status`

【客户侧，无需鉴权】轮询接入进度。仅返回脱敏步骤与错误，不含任何 Token、code 或账户信息。

> 📘 鉴权
>
> 此接口不需要 API Key。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `token` | path | 是 | string |  |


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

若邀请尚未成功调用过 complete（还没绑定 operationId），会返回一个占位结构（currentStep 为 null、steps 为空数组、result 为 null），而不是报错，落地页据此展示"等待客户提交"的初始态。一旦绑定了 operation，本接口会直接转发该 operation 的脱敏步骤/错误视图，与 complete/retry 两个接口的响应共享同一份底层数据源，因此三者对"同一次接入现在进展到哪一步"的描述永远一致，不会出现轮询结果和提交结果自相矛盾的情况。另外，接入本身成功与信用额度（credit line）分享成功是两个完全独立的状态位——额度还没同步不会让本接口把整个接入进度报告成失败，避免误导客户以为接入没做完。
