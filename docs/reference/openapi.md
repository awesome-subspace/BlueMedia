---
title: "OpenAPI 与 Agent 接入"
description: "下载 OpenAPI 3.1、Webhook JSON Schema 和纯 Markdown 文档，供 SDK、IDE 与 Coding Agent 直接消费。"
---

本页是自动化工具的入口。网页说明业务语义；机器应优先读取 OpenAPI 和 JSON Schema，不要从示例反推类型。

## 下载

| 资源 | 地址 | 用途 |
| --- | --- | --- |
| OpenAPI 3.1（YAML） | [`/openapi.yaml`](https://docs.bsptest.com/openapi.yaml) | 代码生成、IDE、Agent 和契约校验的首选入口 |
| OpenAPI 3.1（JSON） | [`/openapi.json`](https://docs.bsptest.com/openapi.json) | 适合程序直接加载 |
| Agent 导航 | [`/llms.txt`](https://docs.bsptest.com/llms.txt) | 快速定位关键指南与接口 |
| 完整 Markdown | [`/llms-full.txt`](https://docs.bsptest.com/llms-full.txt) | 离线检索或放入较大上下文 |
| 单页 Markdown | 页面右上角“查看 Markdown” | 只加载当前页面，减少上下文占用 |

API Base URL：`https://api.bsptest.com`。

## 契约优先级

当不同材料看起来不一致时，按以下顺序判断：

1. OpenAPI / Webhook JSON Schema：字段类型、必填关系、枚举和响应结构。
2. 对应接口页：异步行为、幂等、状态机、计费和恢复方式。
3. 示例代码：仅用于快速上手，不应被当作完整 Schema。

`POST /v1/messages` 已使用 `oneOf` 和 `discriminator` 描述各消息类型；媒体的 `id` / `link` 互斥、`to` / `toUserId` 至少一个等关系也写入 Schema。`type` 可以省略并按 `text` 处理，但新接入建议始终显式传值。

## Webhook Schema

Webhook 按事件类型提供独立 JSON Schema：

- [`message`](https://docs.bsptest.com/schemas/webhooks/message.schema.json)
- [`status`](https://docs.bsptest.com/schemas/webhooks/status.schema.json)
- [`change`](https://docs.bsptest.com/schemas/webhooks/change.schema.json)
- [`probe`](https://docs.bsptest.com/schemas/webhooks/probe.schema.json)
- [`job.completed`](https://docs.bsptest.com/schemas/webhooks/job-completed.schema.json)
- [`job.failed`](https://docs.bsptest.com/schemas/webhooks/job-failed.schema.json)
- [`usage.updated`](https://docs.bsptest.com/schemas/webhooks/usage-updated.schema.json)
- [`webhook.verification`](https://docs.bsptest.com/schemas/webhooks/webhook-verification.schema.json)

接收端仍需先按[Webhook 集成](../guides/webhook-integration.md)验证原始请求体签名，再做 Schema 校验和事件分派。

## 更新机制

公开规范从 API 服务的 `/portal/openapi.json` 同步，文档仓只补充对外机器契约中尚缺的精确 Schema。维护者更新后运行：

```bash
npm run openapi:sync
npm run build
```

构建会同时生成 `llms.txt`、完整 Markdown 语料和每个页面的独立 Markdown 文件；文档校验会阻止缺少关键消息 Schema、Webhook Schema 或下载入口的版本发布。
