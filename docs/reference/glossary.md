---
title: "术语表"
description: "BlueMedia API 与 WhatsApp Business Platform 中反复出现的概念、ID 前缀和字段含义。"
---

按字母与拼音混排，只收在本文档里会遇到的术语。ID 前缀一栏可以用来快速判断一个陌生的 id 属于哪类资源。

## 资产与身份

| 术语 | ID 前缀 | 含义 |
| --- | --- | --- |
| API Key | — | 服务端集成的唯一凭证，绑定到一个客户 Business Portfolio。明文只在签发时出现一次，平台只存哈希。详见[认证与权限](../guides/authentication.md)。 |
| scope | — | API Key 上的细粒度权限，如 `messages:send`。某接口是否检查 scope 写在该接口页的「鉴权」提示里；取值是 `*` 或为空的 Key 通过所有检查。 |
| tenantId | `tenant_` | 账户标识。调 [`GET /whoami`](../authentication/get-whoami.md) 可以确认当前 Key 属于哪个账户。 |
| Business Portfolio | `bm_` | 客户资产的最外层容器，WABA 和号码都挂在它下面。文档里对客户统一用这个说法。 |
| WABA | `waba_` | WhatsApp Business Account，挂在 Business Portfolio 下，是号码和模板的归属单位。 |
| 业务号码 | `pn_` | 平台内的号码记录。注意读接口返回的是**本地快照**，Meta 侧实时状态要查[注册状态](../assets-phone-numbers/get-v1-phone-numbers-id-registration-status.md)。 |
| platformVersion | — | 处理本次请求的 API 进程版本，排查「某个修复上线了没有」时用。**不要**据此做权限判断。 |

## 消息

| 术语 | ID 前缀 | 含义 |
| --- | --- | --- |
| wamid | `wamid.` | Meta 侧的消息标识，在 Meta 受理消息后返回。 |
| Idempotency-Key | — | 调用方自己生成的请求去重键，≤200 字符。详见[幂等与重试](idempotency.md)。 |
| 24 小时客服窗口 | — | 距客户上一次主动发消息起 24 小时内可发自由格式内容；超窗后只能发已过审模板。 |
| 模板 | — | 需 Meta 审核的消息模板。超出 24 小时窗口时唯一可用的消息类型。 |
| Flow | — | 会话内的多步交互表单，要先发布才能在 `interactive` 消息里引用。 |
| 媒体 id | — | `POST /v1/media` 上传后由 Meta 返回。通常**几天后失效**，不要当长期素材库。 |
| CTWA | — | Click to WhatsApp，「点击进入 WhatsApp」广告。其带来的首条消息里含广告点击 id。 |
| Pixel / dataset | — | Meta 侧的转化数据集。未绑定时收到的转化事件以 `skipped` 存下，绑定后自动重放。 |

## 账务

| 术语 | 含义 |
| --- | --- |
| minor units | 最小货币单位的整数。文档里所有金额字段（`*Minor`）都是这个口径，不是浮点元。 |
| 信用账户 | 账户级的单一钱包，含币种、可用余额、预留余额。未开通额度时余额接口返回 **404** 而非全零。 |
| 预留 / 结算 / 冲回 | 提交消息时锁定 `reserved`；Meta 返回 wamid 时转为实际扣费；状态回调 `failed` 时自动冲回。 |
| 预算上限 | `allocatedMinor`：`null` 是**不限额**，`0` 是**冻结**，两者含义相反。 |
| credit line | Meta 侧的信用额度共享。先共享给 Business Portfolio，再挂载到具体 WABA，因此同 Portfolio 下的其它 WABA 会共享该授权。 |
| 净计费 vs 发送量 | `totalChargedCount` 按账本聚合（扣费 +1、冲回 −1）；`totalMessages` 按消息表计数（含未计费与失败）。**两者不相等是正常的。** |

## 接入与 Webhook

| 术语 | ID 前缀 | 含义 |
| --- | --- | --- |
| Embedded Signup（ES） | — | Meta 提供的客户授权弹窗流程。平台把它编排成一条可恢复的五步状态机。 |
| operationId | — | 一次接入编排的标识。失败后要用 `retry` **续跑同一条**，而不是重新创建。 |
| 邀请 token | — | 邀请链接里的一次性凭据，43 字符 base64url，库里只存 SHA-256。明文只在创建响应出现一次。 |
| PLBV | — | Meta 的商业验证（Business Verification）状态。 |
| 端点 | `whe_` | Webhook 接收端点。`DELETE` 是软停用，历史保留。 |
| 连接协议 | — | 带 `connectionId` 创建的端点所用的新签名方案（`Webhook-Signature: v1,<hex>`，时间戳参与签名），端点以 `pending` 起步。 |
| X-Delivery-Id / Webhook-Id | `wd_` / `evt_` | 投递或事件的唯一 id，用于接收方幂等去重。投递是**至少一次**语义。 |
| probe 事件 | — | Meta 回调了解析不出已知事件的请求体时的兜底分类，**不是**控制台「测试」按钮（那个发 `webhook.verification`）。 |
