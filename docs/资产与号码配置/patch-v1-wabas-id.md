---
title: "修改名称、验证状态或审核状态"
excerpt: "修改名称、验证状态或审核状态。"
---

`PATCH /v1/wabas/{id}`

修改名称、验证状态或审核状态。

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
  "$ref": "#/components/schemas/Waba"
}
```

通用错误信封及处理建议见[错误码](/docs/error-codes)。

## 补充说明

`verificationStatus`/`accountReviewStatus` 这两个字段在正常流程里应该由 `refresh-verification`（Portfolio 侧接口）或 Meta 推来的 webhook 自动同步写入，本接口允许直接手动改写，本质上是给运维一个绕开自动流程手动纠正数据的口子——调用本接口不会触发任何对 Meta 的调用，也不做任何跟真实 Meta 状态的一致性校验，写进去就是什么，用错了会造成本地记录和 Meta 实际状态不一致。
