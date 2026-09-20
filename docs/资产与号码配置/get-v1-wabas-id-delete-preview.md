---
title: "WABA 删除影响预览"
excerpt: "级联删除影响预览：返回将被删除的号码/模板/消息等数量。只读。"
---

`GET /v1/wabas/{id}/delete-preview`

级联删除影响预览：返回将被删除的号码/模板/消息等数量。只读。

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

纯只读统计，不产生任何副作用；`heldReservations` 大于 0 表示这个 WABA 下当前存在在途消息（信用已被预留但尚未结算），之后如果真的调用带 cascade 的删除会被拒绝，这里提前给出数字方便操作者判断是否需要先等这些消息状态落定。
