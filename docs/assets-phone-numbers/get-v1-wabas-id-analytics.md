---
title: "查询 WABA 用量分析"
description: "直接查询该 WABA 在 Meta 侧的用量/费用分析，作为本地账本用量视图的交叉核对。messaging 与 pricing 两个字段各自独立请求、独立汇报成败：响应为 { messaging: {ok, data|error}, pricing: {ok, data|error} }，任一字段被 Meta 拒绝时另一字段仍返回数据，错误里带 Meta 原始 code/subcode。注意 pricing 的 COST 对共享 Solution Partner 信用额度的 WABA 不会返回。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--get">GET</span><code class="endpoint-path">/v1/wabas/{id}/analytics</code></div>

直接查询该 WABA 在 Meta 侧的用量/费用分析，作为本地账本用量视图的交叉核对。messaging 与 pricing 两个字段各自独立请求、独立汇报成败：响应为 { messaging: {ok, data|error}, pricing: {ok, data|error} }，任一字段被 Meta 拒绝时另一字段仍返回数据，错误里带 Meta 原始 code/subcode。注意 pricing 的 COST 对共享 Solution Partner 信用额度的 WABA 不会返回。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`billing:read`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 平台内 WABA ID，`waba_...` |
| `start` | query | 是 | unix timestamp | 统计区间起点（秒）。**必填**，无法解析为数字时返回 `400 VALIDATION_FAILED` |
| `end` | query | 是 | unix timestamp | 统计区间终点（秒）。**必填**，无法解析为数字时返回 `400 VALIDATION_FAILED` |
| `granularity` | query | 否 | `HALF_HOUR` \| `DAY` \| `MONTH` | 默认 `DAY`；传其它值不会报错，一律按 `DAY` 处理 |
| `phoneNumbers` | query | 否 | string | 逗号分隔的 **Meta 号码 id**（纯数字，每段 1–32 位），按号码过滤。含非数字字符时返回 `400 VALIDATION_FAILED` |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

#### 参数校验

- `start`/`end`：必须能解析成有限数字的 unix 时间戳，解析失败直接 400。
- `granularity`：只严格接受 `HALF_HOUR`/`MONTH` 两个非默认取值，传其它任何值（包括缺省）都**静默落回 `DAY`**——接口不会帮你纠正拼写提醒，调用方需自行确认。
- `phoneNumbers`：严格校验为纯数字（每段号码 id 最多 32 位）。这些值会被直接拼进发往 Meta Graph API 的字段过滤表达式（形如 `.phone_numbers(id1,id2)`），未经净化的输入理论上可借助 `)`、`.` 突破过滤器边界改写整个表达式——这条校验不是可选的健壮性检查，而是防注入闸门。

#### Meta 授权状态

服务会自动选择已保存且可用的 Meta 授权信息。若该 Business Portfolio 尚未完成 Meta 授权或授权已经失效，返回 **409 而不是 404**——问题不在于“这个 WABA 不存在”，而在于当前无法代表客户向 Meta 查询数据。
