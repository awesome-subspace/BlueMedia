---
title: "上传一个 multipart 文件到 Meta"
description: "上传一个 multipart 文件到 Meta，返回媒体 ID。"
---

`POST /v1/media`

上传一个 multipart 文件到 Meta，返回媒体 ID。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`media:write`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `phoneNumberId` | query | 是 | string | 平台内号码 ID，`pn_...`。**必填**，缺失或空串返回 `400 VALIDATION_FAILED`；还要通过该 API Key 的号码授权检查 |

### 请求体
请求体必填。单个 `file` 部分，**每个文件上限 5 MB**（一次请求最多 3 个文件）；超限返回 `400 VALIDATION_FAILED`，消息为 `invalid multipart upload (max 5MB)`。
Content-Type：`multipart/form-data`
Schema：

```json
{
  "type": "object",
  "properties": {
    "file": {
      "type": "string",
      "format": "binary"
    }
  },
  "required": [
    "file"
  ]
}
```

## 响应

| 状态码 | 说明 |
| --- | --- |
| `201` | Created |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

phoneNumberId 必须是平台内号码 ID（pn_...）且归属当前账户，服务端据此解析出 Meta 侧号码 ID 再转发上传；媒体本身不落库到平台（只记录文件名/类型/归属号码，不存字节），Meta 侧媒体 ID 通常几天后失效，不建议长期依赖同一个 ID。

#### 上传大小由平台先拦一道，不是全部交给 Meta

**本接口对每个文件硬性限制 5 MB**，超过的请求在到达 Meta 之前就被拒（`400 VALIDATION_FAILED`）。所以 Meta 按类型给出的更宽松上限（音视频约 16MB、文档约 100MB）**在这条上传通道上拿不到**——需要更大的素材时，请改用消息里的 `link` 方式引用一个可公开访问的 URL，由 Meta 自己去取。

格式白名单与按类型的细则仍以 Meta 在**发送该媒体消息时**的校验为准，平台在这一层不做格式预检。
