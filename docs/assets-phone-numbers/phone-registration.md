---
title: "号码注册与验证"
description: "代理 Meta 的号码所有权验证、Cloud API 注册、两步验证 PIN 与显示名称审核。72 小时内最多 10 次 register/deregister。"
---

# 号码注册与验证

这组接口实时调用 Meta Graph API，代理号码的所有权验证、Cloud API 注册与生命周期操作。

对一个尚未验证所有权的号码，完整顺序是 `request-code` → `verify-code` → `register`。**已在 WhatsApp Manager 验证过的号码跳过前两步**，直接 register 即可。

| 接口 | 用途 |
| --- | --- |
| [查询注册状态](get-v1-phone-numbers-id-registration-status.md) | 实时读取 Meta 侧注册状态、名称审核、质量评级、两步验证状态。 |
| [拉取 Meta 侧状态](post-v1-phone-numbers-id-refresh.md) | 把 Meta 的最新详情同步进本地快照。 |
| [请求验证码](post-v1-phone-numbers-id-request-code.md) | 请求 SMS 或 VOICE 验证码（默认 `en_US`）。号码已验证过再调会被 Meta 拒绝。 |
| [提交验证码](post-v1-phone-numbers-id-verify-code.md) | 提交 6 位验证码完成所有权验证。约 10 分钟有效、一次性。 |
| [注册号码](post-v1-phone-numbers-id-register.md) | 用 6 位 PIN 注册到 Cloud API。 |
| [注销号码](post-v1-phone-numbers-id-deregister.md) | 仅使号码在 Cloud API 侧失效，号码与消息历史保留，之后可重新注册。 |
| [设置两步验证 PIN](post-v1-phone-numbers-id-two-step-pin.md) | 设置或轮换 PIN。忘记旧 PIN 时直接设新值覆盖即可。 |
| [修改显示名称](post-v1-phone-numbers-id-display-name.md) | 提交新名称进入 Meta 审核，不会立即生效。 |

:::warning

**72 小时内最多 10 次 register/deregister 请求**（Meta 侧规则）。超限后 Meta 返回错误码 133016，并封禁该号码 72 小时的注册能力。调试接入流程时不要拿同一个号码反复注册。

:::

两个容易踩的点：`register` 的 `pin` 有双重语义（首次注册是「设置 PIN」，已开启两步验证时是「现有 PIN」，Meta 不区分）；显示名称审核通过后**必须重新调一次 register**，新名称才真正同步到 WhatsApp 服务端。详见[号码注册与生命周期](../guides/phone-numbers.md)。
