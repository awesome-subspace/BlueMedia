---
title: "邀请管理"
excerpt: "为指定客户与 Business Portfolio 生成一次性接入链接，客户全程不接触任何 API Key。明文链接只在创建响应里出现一次。"
---

# 邀请管理

生成一次性邀请链接，让客户在自己的设备上完成 Meta 授权。客户全程不接触任何 API Key 或 App Secret。这组接口供服务商侧调用，需要凭证。

| 接口 | 用途 |
| --- | --- |
| [生成接入链接](post-v1-onboarding-invitations.md) | 为某个 Business Portfolio 创建邀请，返回一次性链接。 |
| [列出邀请](get-v1-onboarding-invitations.md) | 当前账户已发出的邀请及其状态。 |
| [撤销邀请](delete-v1-onboarding-invitations-id.md) | 作废一条尚未使用的邀请。 |

{% hint style="warning" %}
**明文链接只在创建响应里出现一次。** token 是 43 字符 base64url，库里只存它的 SHA-256；遗失只能重新生成。`expiresInSeconds` 默认 1800 秒，可配 300–86400。
{% endhint %}

客户打开链接后调用的是[客户侧邀请页接口](invitation-public.md)（免鉴权）。整体流程见[客户接入](../guides/customer-onboarding.md)。
