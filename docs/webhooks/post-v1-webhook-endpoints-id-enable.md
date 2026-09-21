---
title: "重新启用被停用的端点"
description: "重新启用被停用（DELETE）的端点。"
---

<div class="endpoint"><span class="endpoint-method endpoint-method--post">POST</span><code class="endpoint-path">/v1/webhook-endpoints/{id}/enable</code></div>

重新启用被停用（DELETE）的端点。

:::note[鉴权]

请求头携带 `Authorization: Bearer <API_KEY>`。API Key 的可访问资源由当前授权范围决定。

:::

## 请求

Base URL：`https://api.bsptest.com`

### 参数

| 名称 | 位置 | 必填 | 类型/约束 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | 是 | string | 回调端点 ID，`whe_...` |

## 响应

| 状态码 | 说明 |
| --- | --- |
| `201` | Created |
| `4xx` | 客户端错误 |

通用错误信封及处理建议见[错误码](../guides/error-codes.md)。

## 补充说明

#### 为什么需要它
`DELETE {id}` 是**软停用**，而 `PATCH {id}` 只接受 url / events / metadata —— 在本接口存在之前，停用是一道**单向门**：投递永久停止，唯一出路是删掉重建，代价是换掉 endpoint id、丢失历史投递记录、集成方那边还要改配置。而 `rotate-secret` 的文档本身就建议「先停用再轮换」，照着做的人会把自己的端点变成砖。

#### 恢复到哪个状态由平台决定，不接受调用方指定
已经验证过的端点（`verifiedAt` 非空）恢复为 `active` —— 它证明过自己控制那个地址，停用不会让这件事失效。**没验证过、且走连接协议的端点恢复为 `pending`**，必须重新过一次所有权验证：否则「创建一个指向别人服务器的端点 → 停用 → 启用」就是一条三次调用绕过验证的路，把一个防滥用机制变成装饰。沿用旧路径直建的端点（先于验证流程存在、创建即 active）恢复为 `active`，因为它没有可走的验证流程，给它 `pending` 等于让它永远发不出去。

对已经是 active / pending 的端点调用是**幂等**的：回到它本该在的状态，并清掉 `disabledAt`。不返回 secret。
