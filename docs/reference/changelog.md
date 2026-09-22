---
title: "API 更新日志"
description: "集中记录 API 契约、行为、错误码和文档入口的变更，并提供机器可读版本。"
---

本页集中记录对调用方有影响的 API 契约与文档变更。机器可读版本：[`/changelog.json`](https://docs.bsptest.com/changelog.json)。

:::note

每条变更使用 `Added`、`Changed`、`Deprecated`、`Removed`、`Fixed` 或 `Breaking` 分类；涉及弃用时必须给出 sunset 日期和迁移方式。当前历史记录从 2026-09-22 开始补齐，更早的 API 变更未完整追溯。

:::

## 2026-09-22

### Added

- 发布 OpenAPI 3.1 下载入口：[`/openapi.yaml`](https://docs.bsptest.com/openapi.yaml) 与 [`/openapi.json`](https://docs.bsptest.com/openapi.json)。
- 发布 `llms.txt`、完整 Markdown 语料以及每页独立 Markdown，供 Coding Agent 直接读取。
- 发布 8 类 Webhook 事件的独立 JSON Schema，并在 OpenAPI `webhooks` 中建立统一入口。
- 为 `POST /v1/messages`、`GET /v1/messages`、`GET /v1/messages/{id}` 补充正式成功响应 Schema 和逐状态错误响应。

### Fixed

- 修复消息请求文档中 `type` 是否必填互相矛盾的问题：省略仅作为 text 的向后兼容，新代码应显式传值。
- 修复 `<type>` 内容被错误描述为字符串的问题；消息请求现在使用 `oneOf` + `discriminator`，并表达收件人和媒体引用的组合约束。

### Changed

- 消息列表的 OpenAPI 查询参数现在声明准确类型、范围、日期格式和 status 枚举。服务端“非法值被忽略/返回空列表”的既有行为没有改变。

## 2026-09-21

**文档站从 GitBook 迁移到 Docusaurus。**

- 导航改为三级结构：业务域 → 资源组 → 接口。折叠状态下侧边栏条目从 122 条降到 46 条。
- 侧边栏接口条目加上 HTTP 方法徽标（GET / POST / PUT / PATCH / DELETE）。
- 新增 18 个资源组索引页，每页给出该组的适用场景、接口一览和易错点。
- 新增本「参考」板块：[术语表](glossary.md)、[限流与配额](rate-limits.md)、[幂等与重试](idempotency.md)、[常见问题](faq.md)。
- 指南中加入流程图：消息状态机、接入编排五步、计费预留/结算/冲回、号码注册顺序、Webhook 所有权验证。
- 接入站内全文搜索（中英文）。
- 修复 7 处代码块语言标注错误导致的高亮失效。

:::warning

迁移后**接口页的 URL 多了一段**资源组路径，例如：

```text title="URL 变化"
旧  /xiao-xi-fa-song-yu-zhuang-tai/post-v1-messages
新  /docs/messaging/messages/post-v1-messages
```

旧链接会 404。如果你的内部文档或工单模板里引用了旧地址，需要更新。

:::

## 2026-09-20

**按业务域重组接口导航。**

- 121 个接口页从平铺改为按业务域分组。
- 精简过长的导航条目名（如「读取最终状态、wamid 和失败原因」→「读取消息状态」）。
