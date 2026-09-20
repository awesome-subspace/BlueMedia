---
title: "号码删除影响预览"
excerpt: "级联删除影响预览：返回将被删除的消息/会话/媒体等数量。只读。"
---

`GET /v1/phone-numbers/{id}/delete-preview`

级联删除影响预览：返回将被删除的消息/会话/媒体等数量。只读。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string |  |


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

### 200 响应 Schema

```json
{
  "type": "object",
  "description": "将被(或已被)删除的关联对象数量。heldReservations > 0 时级联删除会被拒绝。",
  "additionalProperties": {
    "type": "integer"
  }
}
```

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

纯本地统计，不查询 Meta，只读不产生副作用；heldReservations > 0 表示存在在途消息/信用预留，此时即使带 cascade=true 调用 DELETE 也会被拒绝。
