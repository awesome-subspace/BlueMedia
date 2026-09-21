---
title: "WhatsApp 账户（WABA）"
excerpt: "WABA 的本地记录管理、Meta 信用额度的授权与撤销、以及用量分析。撤销额度只改本地，不调用 Meta。"
---

# WhatsApp 账户（WABA）

WABA 挂在 Business Portfolio 下，号码挂在 WABA 下。除记录管理外，这组接口还承载 Meta 信用额度（credit line）的授权与撤销。

| 接口 | 用途 |
| --- | --- |
| [列出 WABA](get-v1-wabas.md) | 当前授权范围内的 WABA。 |
| [手工创建 WABA 记录](post-v1-wabas.md) | 补录一条记录。 |
| [WABA 详情](get-v1-wabas-id.md) | 单个 WABA 的详情。 |
| [修改 WABA](patch-v1-wabas-id.md) | 更新名称、验证状态或审核状态（仅本地字段）。 |
| [删除 WABA](delete-v1-wabas-id.md) | 删除平台侧记录。 |
| [删除影响预览](get-v1-wabas-id-delete-preview.md) | 删除前查看连带影响。 |
| [授权信用额度](post-v1-wabas-id-credit-line-authorize.md) | 把 BlueMedia 额度共享给该 Portfolio 并挂载到此 WABA。幂等。 |
| [取消额度授权](post-v1-wabas-id-credit-line-deauthorize.md) | 撤销本地授权标记。 |
| [用量分析](get-v1-wabas-id-analytics.md) | 该 WABA 的用量统计（需要 `billing:read`）。 |

{% hint style="warning" %}
**额度授权是 Portfolio 级的。** Meta 先把额度共享给客户的 Business Portfolio，再挂载到具体 WABA，因此同一 Portfolio 下的其它 WABA 会共享这项授权。挂载失败时响应仍是 `200`，失败原因在 `waba.error` 里。

**撤销只改本地**：`deauthorize` 之后该 Portfolio 的发送会被 `CREDIT_LINE_NOT_READY` 拦下，但平台不会调用 Meta 撤销——Meta 侧额度线挂到 WABA 后无法单独摘除。
{% endhint %}

额度模型的完整说明见[账务与信用额度](../guides/billing.md)。
