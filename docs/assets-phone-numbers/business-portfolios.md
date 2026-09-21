---
title: "Business Portfolio"
excerpt: "客户资产的最外层容器。正常情况下由客户接入自动落地，这里的手工创建与修改接口用于补录和纠正。"
---

# Business Portfolio

Business Portfolio 是客户资产的最外层容器，WABA 和号码都挂在它下面。正常情况下它由[客户接入](../guides/customer-onboarding.md)流程自动落地，这组接口用于补录、纠正和清理。

| 接口 | 用途 |
| --- | --- |
| [列出 Portfolios](get-v1-business-portfolios.md) | 当前 API Key 授权范围内的 Portfolio。 |
| [手工创建 Portfolio](post-v1-business-portfolios.md) | 补录一条记录（接入流程之外的场景）。 |
| [Portfolio 详情](get-v1-business-portfolios-id.md) | 单个 Portfolio 的详情与归属关系。 |
| [修改 Portfolio](patch-v1-business-portfolios-id.md) | 更新本地字段。 |
| [删除 Portfolio](delete-v1-business-portfolios-id.md) | 删除平台侧记录。 |
| [删除影响预览](get-v1-business-portfolios-id-delete-preview.md) | 删除前先看会连带影响哪些 WABA、号码和消息。 |
| [绑定 Meta Pixel](post-v1-business-portfolios-id-dataset.md) | 手工关联 Pixel，用于补救 v4 之前接入或当时未选 Pixel 的客户。 |

{% hint style="info" %}
Portfolio 的**预算上限**不在这里，它属于账务：见 [Portfolio 预算](../billing-status/allocations.md)。商业验证状态见[读取最近认证记录](../business-verification/get-v1-business-portfolios-portfolioid-certification.md)。
{% endhint %}

删除类操作建议先调对应的删除影响预览——平台侧记录删除会连带子资源，Meta 侧的资产不受影响也无法通过 API 删除。
