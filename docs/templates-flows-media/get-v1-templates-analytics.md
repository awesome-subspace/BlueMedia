---
title: "模板分析"
description: "模板分析：已发送 / 送达 / 已读 / 按钮点击。"
---

`GET /v1/templates/analytics`

模板分析：已发送 / 送达 / 已读 / 按钮点击。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`templates:manage`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

### 200 响应 Schema

```json
{
  "$ref": "#/components/schemas/TemplateAnalyticsResult"
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

查询参数：`wabaId`、`templateIds`（**本地**模板 id，逗号分隔）、`start`/`end`（unix 秒）、`metricTypes`（可选，默认 `SENT,DELIVERED,READ,CLICKED`）。

#### 必须先确认开启

先对该 WABA 调一次 `POST /v1/templates/analytics/enable`，否则 Meta 直接报错。那是 Meta 的一次性确认，**开了不能关**。

#### 响应里的 warnings 要读

这个接口有几条 Meta 侧的硬限制，我们不静默吞掉而是如实写进 `warnings`：

- **一次最多 10 个模板**，超了只取前 10 个；
- **已读与按钮点击只保留 7 天**，跨度更长时前面那段这两项会是 0（不是 bug）；
- **`COST` 对共享平台额度的 WABA 永远不返回**（Meta 的限制，而我们的客户都是这种）。花费请看 `GET /v1/credit-account/usage` —— 那才是平台对你的权威口径；
- 传入当前授权范围之外的模板 id，或还没同步过 Meta id 的模板，会被忽略并在 `warnings` 里点名。

按钮点击数据只对 `MARKETING` / `UTILITY` 类模板提供；欧盟与日本的 WABA 不支持（均为 Meta 的限制）。
