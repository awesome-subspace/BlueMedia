---
title: "列出当前账户最近 50 条消息"
excerpt: "列出当前账户最近 50 条消息，支持 keyset 翻页与状态、时间筛选。"
---

`GET /v1/messages`

列出当前账户最近 50 条消息，支持 keyset 翻页与状态、时间筛选。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `limit` | query | 否 | integer 1..200 | 默认 50。超出范围**夹取**而不是报错 |
| `before` | query | 否 | ISO 8601 date-time | keyset 游标：只返回 `createdAt` 早于它的消息，取上一页最后一行的 `createdAt` |
| `status` | query | 否 | string | 按消息状态精确匹配（`accepted` / `sending` / `submitted` / `sent` / `delivered` / `read` / `failed`）。拼错的值不会报错，只会得到空列表 |
| `from` | query | 否 | ISO 8601 date-time | `createdAt >= from`（闭区间下界） |
| `to` | query | 否 | ISO 8601 date-time | `createdAt <= to`（闭区间上界） |


## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

#### 分页是 keyset，不是 offset

`limit`（默认 50，夹在 1–200）+ `before`（上一页最后一行的 `createdAt`，ISO 字符串）。与 `GET /v1/conversations` 同一套：按 `created_at desc` 翻页，**翻页过程中新到的消息不会把后面的行往后挤**（offset 会）。`(tenant_id, created_at desc)` 上有索引，而 `OFFSET n` 仍要扫完前 n 行再丢掉，越翻越慢。

**响应仍是裸数组，没有 `total`。** 给这张表加 `COUNT(*)` 与 `GET /v1/webhook-endpoints` 不给投递计数是同一个理由：消息量线性增长，那个计数会越来越慢。判断"到底了"的方式是**这一页不满 `limit`**。

#### 筛选

`status` 精确匹配（`accepted`/`sending`/`submitted`/`sent`/`delivered`/`read`/`failed`）；`from`/`to` 是 `createdAt` 的闭区间，ISO 字符串。

**无法解析的值一律忽略而不是 400**，与 `GET /v1/billing-console/ledger` 的 `from`/`to` 一致：调用方多半是看板上的一个控件，一个半输入状态（`2026-0`）不该让整页 400；忽略的语义是"这一侧不设边界"，与不传相同。拼错的 `status` 会得到空列表 —— 而空列表在界面上是看得见的。

#### 不传任何参数

默认返回当前账户最近 50 条消息。新增筛选参数都是可选项，不传时保持原有返回行为。
