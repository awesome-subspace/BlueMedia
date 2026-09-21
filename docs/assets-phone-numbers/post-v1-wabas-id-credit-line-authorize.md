---
title: "授权 BlueMedia 信用额度并挂载到该 WABA"
description: "授权 BlueMedia 信用额度并挂载到该 WABA。Meta 会先向客户的 Business Portfolio 共享额度，再挂载到指定 WABA，因此同一 Portfolio 下的其它 WABA 会共享授权。重复调用不会重复授权或重复挂载；挂载失败仍返回 200，原因见 waba.error。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--post">POST</span><code class="endpoint-path">/v1/wabas/{id}/credit-line/authorize</code></div>

授权 BlueMedia 信用额度并挂载到该 WABA。Meta 会先向客户的 Business Portfolio 共享额度，再挂载到指定 WABA，因此同一 Portfolio 下的其它 WABA 会共享授权。重复调用不会重复授权或重复挂载；挂载失败仍返回 200，原因见 waba.error。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`onboarding:write`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 平台内 WABA ID，`waba_...` |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `200` | OK |
| `4xx` | 客户端错误 |

### 200 响应 Schema

```json
{
  "type": "object",
  "properties": {
    "portfolio": {
      "type": "object",
      "description": "Business Portfolio 的额度授权状态",
      "properties": {
        "portfolioId": {
          "type": "string"
        },
        "status": {
          "type": "string",
          "description": "not_authorized | authorized | revoked"
        },
        "allocationConfigId": {
          "type": "string",
          "nullable": true
        },
        "authorizedBy": {
          "type": "string",
          "nullable": true,
          "description": "门户账号 id；API Key 调用为 null"
        },
        "authorizedAt": {
          "type": "string",
          "nullable": true,
          "format": "date-time"
        }
      }
    },
    "waba": {
      "type": "object",
      "description": "WABA 级挂载结果",
      "properties": {
        "wabaId": {
          "type": "string"
        },
        "metaWabaId": {
          "type": "string"
        },
        "status": {
          "type": "string",
          "description": "attached | attached_no_budget | failed | attaching | pending | not_authorized | revoked"
        },
        "currency": {
          "type": "string"
        },
        "allocationConfigId": {
          "type": "string",
          "nullable": true
        },
        "calledMeta": {
          "type": "boolean",
          "description": "false 表示幂等短路或未抢到并发锁"
        },
        "error": {
          "type": "object",
          "nullable": true,
          "description": "挂载失败原因；retryable=false 表示不会自动重试（如该 WABA 未共享给我们）"
        }
      }
    }
  }
}
```

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

#### `attached_no_budget`：挂上了，但没给钱

共享接口（`whatsapp_credit_sharing_and_attach`）**不带金额参数**，分配额要由有 **Finance editor** 角色的人在 Meta Business Suite 的「账单和付款 → 信用额度」里另外划——API 改不了（写 amount 会被 Meta 以 `#49101 receiving business is not a child business manager` 挡回）。
分配额为 0 时这个状态**看起来完全正常**：`request_status: APPROVED`、WABA 的 `primary_funding_id` 与接收凭证一致，号码、模板、WABA、Business Portfolio 和 App 的 `health_status` 全是 `AVAILABLE`；而每条模板消息都会被 Meta 受理（**返回 wamid**）后在扣费阶段以 `131042` 判失败。所以挂载后会读取分配额，为 0 就记成 `attached_no_budget`，具体指引在 `error` 里。
这个状态**不阻止发送**（「0 = 没预算」是从实测案例推出来的语义，不是 Meta 文档写明的；万一别的配置里 0 表示不限额，拦下去会把能正常发的客户弄停）。人划完额度后每 5 分钟自动重查一次，也可以直接再调本接口立即重查。

#### 挂载失败分两类

- **不可重试**：典型场景是"该 WABA 尚未共享给 BSP 系统用户"（对应 Meta 错误码约 200/1752257）或币种参数不合法。这类失败下 `error.retryable=false`，平台**不会**安排下一次自动重试，后台 scheduler 也不会再捡起来试——必须人工介入排查共享关系或参数后重新调用本接口。
- **可重试**：网络抖动、Meta 侧 5xx、限流等。按指数退避自动处理——初始等待 30 秒、随失败次数倍增、上限封顶 1 小时，并带确定性抖动（基于 WABA id 计算的固定偏移，而非随机数）避免同一批一起失败的 WABA 在同一时刻集中醒来造成瞬时压力。这类失败**不需要**客户端手动重复调用。

#### 审计

调用方需要 `onboarding:write` scope。门户会话操作时 `authorizedBy` 记录门户账号 id；纯 API Key 调用记为 null，仅用于事后审计"谁批准了这笔额度授权"。
