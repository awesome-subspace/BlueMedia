---
title: "客户侧邀请页（免鉴权）"
excerpt: "以 /v1/onboarding/invitations/{token} 开头的一组接口刻意不挂 API Key 鉴权——链接里的 token 本身就是凭据，按来源 IP 限流。"
---

# 客户侧邀请页（免鉴权）

以 `/v1/onboarding/invitations/{token}` 开头的这组接口刻意**不挂 API Key 鉴权**——链接里的 token 本身就是凭据（按来源 IP 限流）。它们由客户看到的独立落地页调用，不在开发者控制台内。

| 接口 | 用途 |
| --- | --- |
| [读取邀请信息](get-v1-onboarding-invitations-token.md) | 落地页初始化：客户名、Meta appId/configId 等非机密信息。 |
| [提交 Meta 授权结果](post-v1-onboarding-invitations-token-complete.md) | 提交 code + wabaId + phoneNumberId 并触发编排。双击提交不会产生两套资产。 |
| [重试接入](post-v1-onboarding-invitations-token-retry.md) | 首次失败后用新的 code 续跑同一条 operation。 |
| [轮询接入进度](get-v1-onboarding-invitations-token-status.md) | 返回脱敏的步骤视图，不含任何 token、code 或账户信息。 |
| [上报中断与自助报错](post-v1-onboarding-invitations-token-es-events.md) | 客户放弃流程或在页面上报错时的埋点上报。 |

无效、过期、已撤销的邀请统一走「邀请失效」，不泄露具体原因。失败响应里的 `requiredInput` 区分客户下一步该做什么：`authorization_code` 表示需要重新授权拿新 code，`null` 表示客户侧无法自行恢复、应联系对接人。

{% hint style="info" %}
重试时只允许换 `code`——`wabaId` / `phoneNumberId` 在首次提交时已绑定，更换目标资产会被拒绝。
{% endhint %}
