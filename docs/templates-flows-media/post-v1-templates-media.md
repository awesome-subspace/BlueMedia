---
title: "上传模板媒体头素材"
excerpt: "上传模板媒体头素材（multipart），返回填进 components 的 `handle`。"
---

`POST /v1/templates/media`

上传模板媒体头素材（multipart），返回填进 components 的 `handle`。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`templates:manage`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `wabaId` | query | 是 | string | 平台内 WABA ID，`waba_...`。**必填**，缺失或空串返回 `400 VALIDATION_FAILED` |

### 请求体
请求体必填。单个 `file` 部分，**每个文件上限 5 MB**（一次请求最多 3 个文件）；超限返回 `400 VALIDATION_FAILED`。
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

#### 建带图片/视频/文档头的模板必须先来这里
Meta 规定模板的媒体头**只能**用 asset handle 声明，而 handle 只能从 Resumable Upload API 换取。先 `POST /v1/templates/media?wabaId=waba_...`（multipart，一个 `file` 部分）拿到 `handle`，再把它填进模板组件：

```json
{ "type": "HEADER", "format": "IMAGE", "example": { "header_handle": ["<handle>"] } }
```

#### 它和 `POST /v1/media` 不是一回事
`POST /v1/media` 产出的是**发消息**用的 media id；本接口产出的是**建模板**用的 handle。两者不能互换（把 media id 填进 `header_handle` 会被 Meta 拒）。

#### 支持的类型与时效
仅 `image/jpeg`、`image/jpg`、`image/png`、`video/mp4`、`application/pdf`（Meta 的白名单，本地先挡并把允许列表告诉你）。**handle 约 4 天后过期**（响应里的 `expiresAt` 就是它），拿到就尽快建模板，不要当素材库存着。
