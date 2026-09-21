---
title: "常见问题"
description: "接入过程中最常被问到的十几个问题，每条都指向对应的接口页或指南。"
---

按出现频率排列。每条都只是结论，展开的原理在链接的页面里。

## 消息

### 拿到 `202 Accepted` 是不是就发出去了？

不是。`202` 只代表**平台已受理**，既不代表已送达，也不代表已提交给 Meta。要拿真实结果只有两条路：轮询 [`GET /v1/messages/{id}`](../messaging/get-v1-messages-id.md)，或接收状态类 Webhook。见[发消息与状态追踪](../guides/messaging.md)。

### 为什么状态里没有 `delivered`，直接变成 `read`？

用户当时正停在聊天界面时，Meta 会省略 `delivered` 回调。**不要假设状态会逐级齐全出现**，也不要把缺失的 `delivered` 当成异常。

### 消息报 `TEMPLATE_NOT_FOUND`，可模板在后台明明是通过的

本地模板与 Meta 不同步。先调[同步 Meta 模板](../templates-flows-media/post-v1-templates-sync.md)，再确认名称与语言都对得上。

### 超过 24 小时窗口了，还能发什么？

只能发**已审核通过的模板消息**。平台会在落库前本地预判，确定超窗的自由格式消息直接返回 `409 WHATSAPP_24H_WINDOW_EXPIRED`，不会浪费一次信用预留。

### 发 5 MB 以上的视频报 400

上传接口对单文件有 **5 MB 硬限制**。大于 5 MB 的音视频和文档只能改用 `link` 方式，给一个 Meta 能公开访问的 URL 让它自取。见[媒体](../templates-flows-media/media.md)。

## 账务

### 余额接口返回 404，是不是接口坏了？

不是。**账户尚未开通额度时返回 404，而不是全零余额**——要用状态码区分「没开通」和「余额为零」。需要开通请联系 BlueMedia 支持人员。

### `totalChargedCount` 和 `totalMessages` 对不上

**这是正常的**，两者分母不同：前者是净计费（按账本聚合，扣费 +1、冲回 −1），后者是发送量（按消息表计数，含未计费、失败、已冲回）。真正成立的不变量是同币种下 `sum(byCategory.spentMinor) == totalSpentMinor`。

### `allocatedMinor` 设成 0 是不是等于不限额？

**恰好相反。**`null` 是不限额（只受账户余额约束），`0` 是冻结（一分钱都不能花）。见 [Portfolio 预算](../billing-status/allocations.md)。

### 发送报 402，该调预算还是该充值？

看错误码：`BM_BUDGET_EXCEEDED` 是该 Business Portfolio 的预算用完了，调整它的预算上限即可；`INSUFFICIENT_FUNDS` 是账户总余额不足，需要联系我们补额度。

### 投递失败的消息会退钱吗？

会，自动的。平台在 Meta 受理时结算，之后状态回调确认 `failed` 的会自动冲回（幂等，不会重复冲）。不需要手动处理。

## 号码与资产

### 改了显示名称，为什么 WhatsApp 里还是旧的？

审核通过后**必须重新调一次 `register`**，新名称才真正同步到 WhatsApp 服务端。审核通过前重复 register 或重复提交都没有效果。

### 号码删不掉

`DELETE` 只删**平台侧**记录及其子资源。Meta 不允许通过 API 删除号码本身——只能在 WhatsApp Manager 删除，且 30 天内发过收费消息的号码不可删。只想让号码在 Cloud API 侧失效但保留历史，用[注销号码](../assets-phone-numbers/post-v1-phone-numbers-id-deregister.md)。

### 撤销了额度授权，为什么 Meta 侧还挂着？

`deauthorize` **只改本地**：之后该 Portfolio 的发送会被 `CREDIT_LINE_NOT_READY` 拦下，但平台不会调用 Meta 撤销——Meta 侧额度线挂到 WABA 后无法单独摘除。

### 额度已经挂载了，还是报 `CREDIT_LINE_NOT_READY`

检查共享给该 Business Portfolio 的**分配额是否为 0**。需要在 Meta Business Suite 的「账单和付款 → 信用额度」中分配额度，**API 无法设置**。

### 调试接入时号码被封了 72 小时

Meta 侧规则：**72 小时内最多 10 次** register/deregister，超限返回 `133016` 并封禁该号码 72 小时的注册能力。调试时不要拿同一个号码反复注册。见[限流与配额](rate-limits.md)。

## 接入

### 接入失败了，重新调创建接口行不行？

不行，那会新建一条全新 operation。要调 `retry` **从断点续跑同一条**。`code` 参数可选：旧凭据还有效就省略，失效才需要客户重新授权拿新 code。

### 邀请链接丢了能找回吗？

不能。明文链接**只在创建响应里出现一次**，库里只存 token 的 SHA-256，遗失只能重新生成。

### 接入成功了但额度没同步，算失败吗？

不算。**接入成功与信用额度分享是两个独立状态**，额度没同步不会把接入报告成失败。

## Webhook

### 轮换 secret 之后验签全失败

`rotate-secret` **立即生效、没有重叠期**。安全做法是低峰期轮换，或先 `DELETE`（软停用）→ 轮换 → 存好新值 → `POST .../enable`。

### 端点会收到别的客户的事件吗？

绑定了 `projectId` 的端点**永远不会**收到别的 Portfolio 的事件；事件归属解析不出来时也不会投给它（宁可漏投，不会投错对象）。不传 `projectId` 才是账户级端点。

### 收到同一个事件两次

正常。投递是**至少一次**语义，请按 `X-Delivery-Id`（默认方案）或 `Webhook-Id`（连接协议）去重。见[幂等与重试](idempotency.md)。

### 收到了 `probe` 事件是怎么回事？

Meta 回调了一个解析不出任何已知事件的请求体时的兜底分类（连通性探测，或尚未识别的新 payload 形状），`value` 里是原始请求体。它**不是**控制台「测试」按钮——那个发的是 `webhook.verification`。

## 转化上报

### 转化事件状态是 `skipped`

该 Business Portfolio 还没绑定 Pixel。事件没丢，[绑定 Meta Pixel](../assets-phone-numbers/post-v1-business-portfolios-id-dataset.md) 之后会自动重新排队，响应里的 `requeuedConversionEvents` 是这次重放的条数。注意只重放 `skipped`，不重放 `failed`。
