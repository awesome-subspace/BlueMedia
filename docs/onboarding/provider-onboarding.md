---
title: "服务商侧接入操作"
description: "运营人员代客户完成 Embedded Signup，并跟踪这条可恢复的五步编排。失败后用 retry 从断点续跑，不要重新创建 operation。"
---

# 服务商侧接入操作

销售或客服在门户里代客户操作、且已取得客户的 Meta 授权结果时走这条路径。需要 API Key 或门户会话。

一次接入是一条**进度落库、可恢复**的状态机，固定五步：`exchange_token` → `subscribe_app` → `register_phone` → `sync_resources` → `persist_assets`。

| 接口 | 用途 |
| --- | --- |
| [完成接入](post-v1-onboarding-embedded-signup.md) | 提交 code + wabaId + phoneNumberId，触发编排。返回 202 只代表受理。 |
| [查询最近操作](get-v1-onboarding-embedded-signup.md) | 列出近期接入操作及其状态。 |
| [操作详情](get-v1-onboarding-embedded-signup-operationid.md) | 单条操作的五步进度、错误与已落地资产。 |
| [从失败步骤恢复](post-v1-onboarding-embedded-signup-operationid-retry.md) | 从断点续跑。`code` 可选：旧凭据还有效就省略。 |
| [上报 ES 会话事件](post-v1-onboarding-es-events.md) | 回报 Embedded Signup 弹窗内的会话事件，用于排查客户卡在哪一步。 |

:::warning

失败后要调 retry **续跑同一条 operation**，而不是重新 POST 创建接口——那会新建一条全新 operation。已完成但当时没注册号码的 operation，也可以用 retry 单独补跑注册步骤。

:::

两条接入路径怎么选、五个步骤各做什么，见[客户接入](../guides/customer-onboarding.md)。
