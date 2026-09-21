---
title: "媒体"
description: "上传媒体拿 Meta 媒体 id、读取元信息、代理下载与删除。上传接口对每个文件硬性限制 5 MB，超过只能改用 link 方式发送。"
---

# 媒体

发送媒体消息有两种引用方式，**必须恰好给一个**：`id`（先上传到 Meta）或 `link`（Meta 自己去取的公开 URL）。

| 接口 | 用途 |
| --- | --- |
| [上传媒体](post-v1-media.md) | 上传一个 multipart 文件到 Meta，拿到媒体 id。需带 `phoneNumberId`。 |
| [媒体详情](get-v1-media-id.md) | 读取 MIME、大小、哈希和临时下载 URL。 |
| [代理下载](get-v1-media-id-content.md) | 由平台代理下载原始字节。 |
| [删除媒体](delete-v1-media-id.md) | 删除 Meta 媒体及本地归属记录。 |

:::warning

**上传接口对每个文件硬性限制 5 MB**，超过直接返回 `400`。大于 5 MB 的音视频和文档只能走 `link` 方式，由 Meta 自己去取。

:::

两个时效问题：Meta 的媒体 id 通常**几天后失效**，不要把同一个 id 当长期素材库用；媒体详情里的临时下载 URL **5 分钟过期**，需要长期保存请走代理下载。

按类型的大小/格式限制（图片约 5 MB、音视频约 16 MB、文档约 100 MB）由 **Meta 在投递阶段**校验，发送接口不预检——超限消息会先拿到 `202`，之后才通过状态回调变成 `failed`。上传/删除需要 `media:write` scope，详见[发消息与状态追踪](../guides/messaging.md)。
