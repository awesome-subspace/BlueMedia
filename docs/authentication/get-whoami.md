---
title: "验证 API Key"
description: "验证 API Key，并返回当前账户标识与 API 服务版本。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--get">GET</span><code class="endpoint-path">/whoami</code></div>

验证 API Key，并返回当前账户标识与 API 服务版本。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

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
  "type": "object",
  "additionalProperties": true,
  "required": [
    "tenantId",
    "platformVersion"
  ],
  "properties": {
    "tenantId": {
      "type": "string",
      "description": "当前 API Key 对应的账户标识"
    },
    "platformVersion": {
      "type": "string",
      "description": "处理本次请求的 API 进程版本"
    }
  }
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

这是无副作用的凭证校验接口。`tenantId` 用于确认当前 API Key 对应的账户，`platformVersion` 仅表示当前 API 进程版本。响应可能包含额外诊断字段；客户集成不应依赖这些字段判断权限。
