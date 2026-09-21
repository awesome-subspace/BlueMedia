---
title: "发布 Flow"
excerpt: "发布 Flow。**不可逆**：发布后不能修改或删除。"
---

`POST /v1/flows/{id}/publish`

发布 Flow。**不可逆**：发布后不能修改或删除。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`templates:manage`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | Meta 侧的 Flow id |

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `wabaId` | string | 是 | 归属校验用 |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "wabaId": {
      "type": "string",
      "description": "string · 必填 — 归属校验用"
    }
  },
  "required": [
    "wabaId"
  ]
}
```


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

发布前 Meta 会校验 Flow JSON 与发布检查项。发布之后这个 Flow 只能 `deprecate`（下线），不能改、不能删 —— 需要改就新建一个。
