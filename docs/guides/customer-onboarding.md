---
title: "客户接入"
excerpt: "把客户的 WhatsApp 资产（Business Portfolio / WABA / 号码）接入 BlueMedia 有两条路径：运营人员代客户完成 Embedded Signup，或生成一次性邀请链接让客户在自己的设备上自助完成 Meta 授权。"
---

把客户的 WhatsApp 资产（Business Portfolio / WABA / 号码）接入 BlueMedia 有两条路径：运营人员代客户完成 Embedded Signup，或生成一次性邀请链接让客户在自己的设备上自助完成 Meta 授权。

## 两条路径怎么选

| 路径                                  | 适用场景                                                         | 鉴权                                          |
| ------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------- |
| `POST /v1/onboarding/embedded-signup` | 销售或客服在门户里代客户操作，且已取得客户授权结果               | API Key 或门户会话                            |
| 邀请链接 `/v1/onboarding/invitations` | 客户自己完成 Meta 授权；客户全程不接触任何 API Key 或 App Secret | 创建/管理需凭证；客户侧凭链接里的一次性 token |

> 📘
> **两条路径共用同一套编排。**邀请链接的 complete/retry 内部直接复用 Embedded Signup 的状态机，进度模型、步骤、错误码完全一致，只是入口和凭据不同。

## 编排的五个阶段

一次接入是一条**进度落库、可恢复**的状态机。单条查询返回的 `steps` 数组固定包含以下五步，每步状态为 `pending` / `running` / `completed` / `failed` / `skipped`：

| 步骤 id          | 做什么                                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------------------------- |
| `exchange_token` | 用 Meta OAuth code 换取后续访问该客户 Meta 资源所需的授权凭据，并以 AES-256-GCM 加密保存。                      |
| `subscribe_app`  | 向 Meta 订阅应用，让该 WABA 的消息/状态回调进入平台的 webhook 管道。                                            |
| `register_phone` | 把号码注册到 Cloud API。未请求号码注册时整步标记 `skipped`；注册 PIN 由平台自动生成并加密保存，客户不需要准备。 |
| `sync_resources` | 从 Meta 拉取 WABA/号码的最新详情（显示名、质量评级等）。                                                        |
| `persist_assets` | 把资产与归属关系落库（WABA、号码、跨账户反查索引）。                                                            |

任一步失败即整体中断：`currentStep` 与 `lastError*` 停在失败处，状态变为 `failed`。此时要调 `POST .../embedded-signup/{operationId}/retry` **从断点续跑**，而不是重新 POST 创建接口——那会新建一条全新 operation。retry 的 `code` 参数可选：旧 token 还有效就省略（直接续跑），token 失效才需要客户重新授权拿一个新 code。已完成但当时没注册号码的 operation，也可以用 retry 单独补跑注册步骤。

## 邀请链接

运营人员为指定客户与 Business Portfolio 生成一条一次性链接：

```bash
curl -X POST https://api.bsptest.com/v1/onboarding/invitations \
  -H "Authorization: Bearer <API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{ "portfolioId": "bm_01923abc", "expiresInSeconds": 86400 }'
```

```201 Created
{
  "id": "inv_...",
  "url": "https://portal.bsptest.com/invite/<一次性 token>",
  "expiresAt": "2026-08-19T10:00:00.000Z",
  "tenantId": "tenant_...",
  "portfolioId": "bm_01923abc",
  "status": "pending"
}
```

- **明文链接只在创建响应里出现一次**。token 是 43 字符 base64url（32 字节随机数），库里只存它的 SHA-256；遗失只能重新生成。
- `expiresInSeconds` 默认 1800（30 分钟），可配 300–86400（最长 24 小时），过期以数据库时钟为准。
- 客户打开链接看到的是独立落地页（不在开发者控制台内），完成 Meta Embedded Signup 后由落地页调客户侧接口提交结果。

## 客户侧接口（无需鉴权）

以 `/v1/onboarding/invitations/{token}` 开头的一组接口刻意**不挂 API Key 鉴权**——链接里的 token 本身就是凭据（按来源 IP 限流）。

| 接口                        | 用途                                                                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET .../{token}`           | 落地页初始化：返回客户名、Meta appId/configId 等非机密信息。无效/过期/已撤销统一走"邀请失效"，不泄露具体原因。                                                      |
| `POST .../{token}/complete` | 提交 Meta 授权结果（code + wabaId + phoneNumberId）并触发编排。先原子抢占（pending 且未过期）再执行，双击提交不会产生两套资产。返回 202 只代表受理，须轮询 status。 |
| `POST .../{token}/retry`    | 首次失败后用**新的 code** 续跑同一条 operation。只允许换 code——wabaId/phoneNumberId 在首次提交时已绑定，重试时更换目标资产会被拒绝。                                |
| `GET .../{token}/status`    | 轮询进度。尚未 complete 时返回占位结构（steps 为空）而非报错；已开始后返回与 complete/retry 同源的脱敏步骤视图。                                                    |

失败响应里的 `requiredInput` 字段用来区分客户接下来该做什么：`authorization_code` 表示需要重新走一遍 Meta 授权拿新 code；`null` 表示客户侧无法自行恢复，应联系对接人。**接入成功与信用额度（credit line）分享是两个独立状态**——额度没同步不会把接入报告成失败。
