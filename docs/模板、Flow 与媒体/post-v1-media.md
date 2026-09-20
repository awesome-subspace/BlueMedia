---
title: "上传一个 multipart 文件到 Meta"
excerpt: "上传一个 multipart 文件到 Meta，返回媒体 ID。"
---

`POST /v1/media`

上传一个 multipart 文件到 Meta，返回媒体 ID。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`media:write`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `phoneNumberId` | query | 是 | string |  |

### 请求体
请求体必填。
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
| `200` | OK |
| `201` | Created |
| `202` | Accepted |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

phoneNumberId 必须是平台内号码 ID（pn_...）且归属当前账户，服务端据此解析出 Meta 侧号码 ID 再转发上传；媒体本身不落库到平台（只记录文件名/类型/归属号码，不存字节），Meta 侧媒体 ID 通常几天后失效，不建议长期依赖同一个 ID。大小/格式限制按消息类型分（图片约 5MB，音视频约 16MB，文档约 100MB），具体以发送该媒体消息类型时 Meta 的校验为准，平台不做提前拦截。
