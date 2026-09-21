---
title: "模板"
excerpt: "模板的创建、审核状态同步与分析。发送模板消息前平台会校验该模板已 APPROVED，参数必须与创建时声明的占位符数量和顺序完全一致。"
---

# 模板

模板消息是超出 24 小时客服窗口时**唯一可用**的消息类型，因此模板的过审状态直接决定能不能发。

| 接口 | 用途 |
| --- | --- |
| [列出模板](get-v1-templates.md) | 模板列表及最新审核状态。 |
| [创建模板](post-v1-templates.md) | 创建并提交 Meta 审核。 |
| [模板详情](get-v1-templates-id.md) | 单个模板的结构与状态。 |
| [编辑模板](patch-v1-templates-id.md) | 修改模板内容，需重新过审。 |
| [删除模板](delete-v1-templates-id.md) | 删除模板。 |
| [同步 Meta 模板](post-v1-templates-sync.md) | 从 Meta 拉取模板及审核状态，修复本地不同步。 |
| [上传模板媒体头](post-v1-templates-media.md) | 上传模板头部所需的媒体素材。 |
| [模板分析](get-v1-templates-analytics.md) | 模板的发送与互动数据。 |
| [开启模板分析](post-v1-templates-analytics-enable.md) | 一次性确认开启该 WABA 的模板分析。 |

{% hint style="info" %}
发送时 `components` 里的 `parameters` 必须与创建模板时声明的占位符**数量和顺序完全一致**，否则 Meta 返回参数不匹配（`TEMPLATE_PARAM_MISMATCH`）。平台在发送前会校验模板已 `APPROVED`。
{% endhint %}

模板相关的失败码（`TEMPLATE_NOT_FOUND` 需先同步、`TEMPLATE_PAUSED` 质量过低被暂停、`TEMPLATE_DISABLED` 已永久停用需新建）见[错误码](../guides/error-codes.md)。这组接口需要 `templates:manage` scope，见[认证与权限](../guides/authentication.md)。
