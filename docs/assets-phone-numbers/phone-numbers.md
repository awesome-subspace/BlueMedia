---
title: "业务号码记录"
excerpt: "号码在平台侧的本地记录管理。这组读接口返回的是本地快照而非 Meta 实时状态，PATCH 也只改本地字段、不会同步到 Meta。"
---

# 业务号码记录

号码在平台侧的本地记录管理。要区分清楚两类数据来源：

| 接口 | 数据来源 |
| --- | --- |
| `GET /v1/phone-numbers` / `{id}` | **本地快照**（上次同步或 PATCH 写入），不触达 Meta，可能滞后。 |
| `PATCH /v1/phone-numbers/{id}` | 只改**本地字段**，不会同步到 Meta。 |
| [号码注册与验证](phone-registration.md)里的接口 | 实时调用 Meta Graph API。 |

| 接口 | 用途 |
| --- | --- |
| [列出号码](get-v1-phone-numbers.md) | 当前授权范围内的号码。 |
| [手工创建号码记录](post-v1-phone-numbers.md) | 补录一条记录。 |
| [号码详情](get-v1-phone-numbers-id.md) | 单个号码的本地快照。 |
| [修改号码本地字段](patch-v1-phone-numbers-id.md) | 更新名称、质量、消息限制、吞吐或状态。 |
| [删除号码](delete-v1-phone-numbers-id.md) | 删除平台侧记录及其子资源。 |
| [删除影响预览](get-v1-phone-numbers-id-delete-preview.md) | 删除前查看连带影响。 |

{% hint style="warning" %}
`DELETE` 只删除**平台侧**的记录及其子资源（商业资料、路由配置；cascade 时含消息/媒体/会话）。Meta 不允许通过 API 删除号码本身——只能在 WhatsApp Manager 删除，且 30 天内发过收费消息的号码不可删。要让号码在 Cloud API 侧失效但保留历史，用[注销号码](post-v1-phone-numbers-id-deregister.md)。
{% endhint %}

完整生命周期见[号码注册与生命周期](../guides/phone-numbers.md)。
