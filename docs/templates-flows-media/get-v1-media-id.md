---
title: "读取媒体 MIME、大小、哈希和临时 URL"
description: "读取媒体 MIME、大小、哈希和临时 URL。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--get">GET</span><code class="endpoint-path">/v1/media/{id}</code></div>

读取媒体 MIME、大小、哈希和临时 URL。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | Meta 媒体 id |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

只有当前账户上传过的媒体 ID 才能查（本地有归属记录才放行，否则 404，即使 ID 在 Meta 侧真实存在）；返回的下载 URL 是 Meta 生成的临时链接，**5 分钟后失效**，过期需重新调用本接口拿新 URL，不能长期缓存。
