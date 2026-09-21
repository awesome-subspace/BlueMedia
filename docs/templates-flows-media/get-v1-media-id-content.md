---
title: "由平台代理下载媒体原始字节"
excerpt: "由平台代理下载媒体原始字节。"
---

`GET /v1/media/{id}/content`

由平台代理下载媒体原始字节。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

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

由平台代理下载，调用方无需自己再拿 access token 直连 Meta 的临时 URL；同样受归属校验，且底层用的还是那个 5 分钟有效的 URL，连续调用会各自触发一次新的 URL 解析。
