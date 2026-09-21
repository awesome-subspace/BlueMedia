---
title: "从失败步骤恢复"
excerpt: "从失败步骤恢复；号码注册使用平台自动生成并加密保存的默认 PIN。"
---

`POST /v1/onboarding/embedded-signup/{operationId}/retry`

从失败步骤恢复；号码注册使用平台自动生成并加密保存的默认 PIN。

> 📘 鉴权
>
> 请求头携带 `Authorization: Bearer <API_KEY>`，所需 scope：`onboarding:write`。API Key 的可访问资源由当前授权范围决定。

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `operationId` | path | 是 | string | 接入操作 ID，`onb_...` |

### 请求体
请求体必填。
### 请求体字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `code` | string | 否 | OAuth code 失效时提供 |

Content-Type：`application/json`
Schema：

```json
{
  "type": "object",
  "properties": {
    "code": {
      "type": "string",
      "description": "string · 可选 — OAuth code 失效时提供"
    }
  }
}
```


## 响应

| 状态码 | 说明 |
| --- | --- |
| `201` | Created |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

内部先做一次原子抢占（claim）把 operation 状态切到"处理中"，抢不到（例如已经在跑，或被另一个并发请求抢先）时直接返回当前状态而不会报错或重复触发编排——这让"手指抖动多点了几次重试按钮"变成安全操作而不是并发 bug 的来源。

#### 什么时候带 `code`
- **省略 `code`**：复用第一次授权时保存的加密客户 token 继续跑。适合仅号码注册这一步失败、不需要重新走一遍 Meta OAuth 授权的场景。
- **提供新 `code`**：当旧 token 已失效（过期/被撤销）时，用它重新授权后再续跑。
- 既没有新 `code` 也没有已保存的 token（例如从未成功授权过）：明确报错提示"需要重新授权"，而不是含糊失败。

已经整体 completed 但当时未请求号码注册的 operation，也能通过本接口**单独补跑注册步骤**，不用重走全部流程。
