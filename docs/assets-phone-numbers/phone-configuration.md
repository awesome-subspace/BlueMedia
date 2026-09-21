---
title: "商业资料与消息路由"
excerpt: "号码的商业资料与消息路由配置。两组都是纯平台侧持久化：不调用 Meta 的 Business Profile API，需自行保证与 Meta 端实际资料一致。"
---

# 商业资料与消息路由

号码级的两组配置，写接口都是覆盖式写入。

| 接口 | 用途 |
| --- | --- |
| [读取商业资料](get-v1-phone-numbers-id-business-profile.md) | 号码当前的商业资料（简介、描述、地址、邮箱、网站、行业、头像）。 |
| [覆盖商业资料](put-v1-phone-numbers-id-business-profile.md) | 新增或覆盖商业资料。 |
| [读取消息路由配置](get-v1-phone-numbers-id-messaging-config.md) | 号码当前的入站/状态端点、默认国家与吞吐限制。 |
| [覆盖消息路由配置](put-v1-phone-numbers-id-messaging-config.md) | 新增或覆盖路由配置。 |

{% hint style="warning" %}
**两组都是纯平台侧持久化，不会同步到 Meta。**

- 商业资料不调用 Meta 的 Business Profile API，头像/简介/网站等字段需自行保证与 Meta 端实际资料一致。
- 路由配置与 Meta 完全无关，不产生任何 Cloud API 调用；`throughputLimit` 是本地限流数值，不等于 Meta 侧的吞吐等级字段。
{% endhint %}

这两组配置属于号码的子资源，[删除号码](delete-v1-phone-numbers-id.md)时会一并删除。号码在 Meta 侧的真实状态请查[号码注册与验证](phone-registration.md)。
