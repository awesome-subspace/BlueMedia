---
title: "Flow"
description: "WhatsApp Flows 的创建、JSON 上传、预览、发布与弃用。Flow 要先发布才能在 interactive 消息里使用。"
---

# Flow

Flow 是在 WhatsApp 会话内呈现的多步交互表单。典型顺序是：创建 → 上传 JSON → 预览 → 发布，之后才能在 `interactive` 类型的消息里引用。

| 接口 | 用途 |
| --- | --- |
| [列出 Flow](get-v1-flows.md) | 读取某个 WABA 的 Flow 列表。 |
| [创建 Flow](post-v1-flows.md) | 新建一个 Flow（名称、分类）。 |
| [Flow 详情](get-v1-flows-id.md) | 校验 WABA 归属后读取详情。 |
| [修改 Flow](patch-v1-flows-id.md) | 修改名称、分类或数据交换端点。 |
| [删除 Flow](delete-v1-flows-id.md) | 删除 Flow。 |
| [上传 Flow JSON](post-v1-flows-id-json.md) | 上传或替换 Flow 的结构定义。 |
| [Flow 资产](get-v1-flows-id-assets.md) | 列出该 Flow 的资产。 |
| [预览链接](get-v1-flows-id-preview.md) | 获取免登录的预览链接，可直接发给业务方确认。 |
| [发布 Flow](post-v1-flows-id-publish.md) | 发布后才能在消息中使用。 |
| [弃用 Flow](post-v1-flows-id-deprecate.md) | 弃用一个已发布的 Flow。 |

:::warning

两个与 Flow 相关的发送失败码：`FLOW_BLOCKED`（Flow 被封禁，需先修正）和 `FLOW_THROTTLED`（最近一小时内已发出 10 条使用该 Flow 的消息）。两者都需要先处理 Flow 本身，重发无用。

:::

这组接口需要 `templates:manage` scope。
