---
title: "同步 Meta 模板"
description: "把该 WABA 在 Meta 侧已有的模板导入/刷新到本地。"
---

`POST /v1/templates/sync`

把该 WABA 在 Meta 侧已有的模板导入/刷新到本地。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`templates:manage`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `wabaId` | string | 是 | 平台内 WABA ID |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "wabaId": {
      "type": "string",
      "description": "string · 必填 — 平台内 WABA ID"
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

### 200 响应 Schema

```json
{
  "$ref": "#/components/schemas/TemplateSyncResult"
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

接入（Embedded Signup）只建 WABA 和号码，不碰模板；而发送路径要求本地必须有模板行，所以客户自己在 WhatsApp Manager 里建好、Meta 侧已 APPROVED 的模板，在导入之前经本平台一条都发不出去（会得到 404 template not found for this phone number's WABA）。接入完成后平台会自动同步一次，这个接口是手动补一次的入口。

#### 幂等与覆盖范围
- 按 (wabaId, name, language) 定位：已存在的**更新**，不存在的**插入**。
- 更新只覆盖 Meta 是权威的字段：status / category / components / rejected_reason / metaTemplateId；不动 name、language。
- **不会删除**本地多出来的模板行。删除是破坏性的，而 Meta 的列表是分页的——只拿到一部分时「本地多出来」是正常现象，照着删就是数据丢失。

#### 分页
只取 Meta 返回的第一页（limit 200）。响应里的 `truncated=true` 表示 Meta 还有下一页、本次没取完，此时应再调一次或去 WhatsApp Manager 核对——这个字段如实回报而不是静默截断，否则调用方会以为已经同步完整。

#### 不向 Meta 提交任何东西
纯读 + 落库，不占用 Meta 的模板审核额度，可以安全重复调用。
