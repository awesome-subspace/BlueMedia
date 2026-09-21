# Table of contents

* [概览](README.md)

## 开始使用

* [快速开始](guides/quickstart.md)
* [认证与权限](guides/authentication.md)
* [客户接入](guides/customer-onboarding.md)
* [号码注册与生命周期](guides/phone-numbers.md)
* [发消息与状态追踪](guides/messaging.md)
* [账务与信用额度](guides/billing.md)
* [Webhook 集成](guides/webhook-integration.md)
* [广告归因与转化上报](guides/ctwa-attribution.md)
* [错误码](guides/error-codes.md)

## 接入准备与鉴权

* [验证 API Key](authentication/get-whoami.md)
* [OAuth token 端点](authentication/post-oauth-token.md)

## 消息发送与状态

* [消息](messaging/messages.md)
  * [提交出站消息](messaging/post-v1-messages.md)
  * [列出最近消息](messaging/get-v1-messages.md)
  * [读取消息状态](messaging/get-v1-messages-id.md)
  * [标记已读](messaging/post-v1-messages-read.md)
* [群发 Broadcasts](messaging/broadcasts.md)
  * [创建群发](messaging/post-v1-broadcasts.md)
  * [列出群发活动](messaging/get-v1-broadcasts.md)
  * [活动详情](messaging/get-v1-broadcasts-id.md)
  * [收件人明细](messaging/get-v1-broadcasts-id-recipients.md)
  * [暂停派发](messaging/post-v1-broadcasts-id-pause.md)
  * [恢复活动](messaging/post-v1-broadcasts-id-resume.md)
  * [取消活动](messaging/post-v1-broadcasts-id-cancel.md)
* [转化事件上报](messaging/conversions.md)
  * [上报转化事件](messaging/post-v1-conversions-events.md)
  * [列出转化事件](messaging/get-v1-conversions-events.md)

## WhatsApp 客户接入

* [服务商侧接入操作](onboarding/provider-onboarding.md)
  * [完成接入](onboarding/post-v1-onboarding-embedded-signup.md)
  * [查询最近操作](onboarding/get-v1-onboarding-embedded-signup.md)
  * [操作详情](onboarding/get-v1-onboarding-embedded-signup-operationid.md)
  * [从失败步骤恢复](onboarding/post-v1-onboarding-embedded-signup-operationid-retry.md)
  * [上报 ES 会话事件](onboarding/post-v1-onboarding-es-events.md)
* [邀请管理](onboarding/invitations.md)
  * [生成接入链接](onboarding/post-v1-onboarding-invitations.md)
  * [列出邀请](onboarding/get-v1-onboarding-invitations.md)
  * [撤销邀请](onboarding/delete-v1-onboarding-invitations-id.md)
* [客户侧邀请页（免鉴权）](onboarding/invitation-public.md)
  * [读取邀请信息](onboarding/get-v1-onboarding-invitations-token.md)
  * [提交 Meta 授权结果](onboarding/post-v1-onboarding-invitations-token-complete.md)
  * [重试接入](onboarding/post-v1-onboarding-invitations-token-retry.md)
  * [轮询接入进度](onboarding/get-v1-onboarding-invitations-token-status.md)
  * [上报中断与自助报错](onboarding/post-v1-onboarding-invitations-token-es-events.md)

## 商业验证（PLBV）

* [读取最近认证记录](business-verification/get-v1-business-portfolios-portfolioid-certification.md)
* [刷新 PLBV 认证](business-verification/post-v1-business-portfolios-portfolioid-certification-refresh.md)
* [同步验证状态](business-verification/post-v1-business-portfolios-id-refresh-verification.md)
* [诊断客户 Token Scopes](business-verification/get-v1-business-portfolios-id-token-scopes.md)

## 资产与号码配置

* [Business Portfolio](assets-phone-numbers/business-portfolios.md)
  * [列出 Portfolios](assets-phone-numbers/get-v1-business-portfolios.md)
  * [手工创建 Portfolio](assets-phone-numbers/post-v1-business-portfolios.md)
  * [Portfolio 详情](assets-phone-numbers/get-v1-business-portfolios-id.md)
  * [修改 Portfolio](assets-phone-numbers/patch-v1-business-portfolios-id.md)
  * [删除 Portfolio](assets-phone-numbers/delete-v1-business-portfolios-id.md)
  * [删除影响预览](assets-phone-numbers/get-v1-business-portfolios-id-delete-preview.md)
  * [绑定 Meta Pixel](assets-phone-numbers/post-v1-business-portfolios-id-dataset.md)
* [WhatsApp 账户（WABA）](assets-phone-numbers/wabas.md)
  * [列出 WABA](assets-phone-numbers/get-v1-wabas.md)
  * [手工创建 WABA 记录](assets-phone-numbers/post-v1-wabas.md)
  * [WABA 详情](assets-phone-numbers/get-v1-wabas-id.md)
  * [修改 WABA](assets-phone-numbers/patch-v1-wabas-id.md)
  * [删除 WABA](assets-phone-numbers/delete-v1-wabas-id.md)
  * [删除影响预览](assets-phone-numbers/get-v1-wabas-id-delete-preview.md)
  * [授权信用额度](assets-phone-numbers/post-v1-wabas-id-credit-line-authorize.md)
  * [取消额度授权](assets-phone-numbers/post-v1-wabas-id-credit-line-deauthorize.md)
  * [用量分析](assets-phone-numbers/get-v1-wabas-id-analytics.md)
* [业务号码记录](assets-phone-numbers/phone-numbers.md)
  * [列出号码](assets-phone-numbers/get-v1-phone-numbers.md)
  * [手工创建号码记录](assets-phone-numbers/post-v1-phone-numbers.md)
  * [号码详情](assets-phone-numbers/get-v1-phone-numbers-id.md)
  * [修改号码本地字段](assets-phone-numbers/patch-v1-phone-numbers-id.md)
  * [删除号码](assets-phone-numbers/delete-v1-phone-numbers-id.md)
  * [删除影响预览](assets-phone-numbers/get-v1-phone-numbers-id-delete-preview.md)
* [号码注册与验证](assets-phone-numbers/phone-registration.md)
  * [查询注册状态](assets-phone-numbers/get-v1-phone-numbers-id-registration-status.md)
  * [拉取 Meta 侧状态](assets-phone-numbers/post-v1-phone-numbers-id-refresh.md)
  * [请求验证码](assets-phone-numbers/post-v1-phone-numbers-id-request-code.md)
  * [提交验证码](assets-phone-numbers/post-v1-phone-numbers-id-verify-code.md)
  * [注册号码](assets-phone-numbers/post-v1-phone-numbers-id-register.md)
  * [注销号码](assets-phone-numbers/post-v1-phone-numbers-id-deregister.md)
  * [设置两步验证 PIN](assets-phone-numbers/post-v1-phone-numbers-id-two-step-pin.md)
  * [修改显示名称](assets-phone-numbers/post-v1-phone-numbers-id-display-name.md)
* [商业资料与消息路由](assets-phone-numbers/phone-configuration.md)
  * [读取商业资料](assets-phone-numbers/get-v1-phone-numbers-id-business-profile.md)
  * [覆盖商业资料](assets-phone-numbers/put-v1-phone-numbers-id-business-profile.md)
  * [读取消息路由配置](assets-phone-numbers/get-v1-phone-numbers-id-messaging-config.md)
  * [覆盖消息路由配置](assets-phone-numbers/put-v1-phone-numbers-id-messaging-config.md)

## 模板、Flow 与媒体

* [模板](templates-flows-media/templates.md)
  * [列出模板](templates-flows-media/get-v1-templates.md)
  * [创建模板](templates-flows-media/post-v1-templates.md)
  * [模板详情](templates-flows-media/get-v1-templates-id.md)
  * [编辑模板](templates-flows-media/patch-v1-templates-id.md)
  * [删除模板](templates-flows-media/delete-v1-templates-id.md)
  * [同步 Meta 模板](templates-flows-media/post-v1-templates-sync.md)
  * [上传模板媒体头](templates-flows-media/post-v1-templates-media.md)
  * [模板分析](templates-flows-media/get-v1-templates-analytics.md)
  * [开启模板分析](templates-flows-media/post-v1-templates-analytics-enable.md)
* [Flow](templates-flows-media/flows.md)
  * [列出 Flow](templates-flows-media/get-v1-flows.md)
  * [创建 Flow](templates-flows-media/post-v1-flows.md)
  * [Flow 详情](templates-flows-media/get-v1-flows-id.md)
  * [修改 Flow](templates-flows-media/patch-v1-flows-id.md)
  * [删除 Flow](templates-flows-media/delete-v1-flows-id.md)
  * [上传 Flow JSON](templates-flows-media/post-v1-flows-id-json.md)
  * [Flow 资产](templates-flows-media/get-v1-flows-id-assets.md)
  * [预览链接](templates-flows-media/get-v1-flows-id-preview.md)
  * [发布 Flow](templates-flows-media/post-v1-flows-id-publish.md)
  * [弃用 Flow](templates-flows-media/post-v1-flows-id-deprecate.md)
* [媒体](templates-flows-media/media.md)
  * [上传媒体](templates-flows-media/post-v1-media.md)
  * [媒体详情](templates-flows-media/get-v1-media-id.md)
  * [代理下载](templates-flows-media/get-v1-media-id-content.md)
  * [删除媒体](templates-flows-media/delete-v1-media-id.md)

## 收件箱与会话

* [收件箱列表](inbox-conversations/get-v1-conversations.md)
* [单个会话线程](inbox-conversations/get-v1-conversations-id.md)
* [清零未读计数](inbox-conversations/post-v1-conversations-id-read.md)

## Webhook 集成

* [列出端点](webhooks/get-v1-webhook-endpoints.md)
* [创建账户回调端点](webhooks/post-v1-webhook-endpoints.md)
* [读取单个端点](webhooks/get-v1-webhook-endpoints-id.md)
* [局部更新端点](webhooks/patch-v1-webhook-endpoints-id.md)
* [停用端点并保留历史记录](webhooks/delete-v1-webhook-endpoints-id.md)
* [轮换签名密钥](webhooks/post-v1-webhook-endpoints-id-rotate-secret.md)
* [重新启用被停用的端点](webhooks/post-v1-webhook-endpoints-id-enable.md)
* [触发所有权验证](webhooks/post-v1-webhook-endpoints-id-verify.md)
* [发一条测试事件](webhooks/post-v1-webhook-endpoints-id-test.md)

## 概览统计

* [总览页计数看板](overview/get-v1-overview-counts.md)

## 账务与服务状态

* [信用账户与用量](billing-status/credit-account.md)
  * [账户余额](billing-status/get-v1-credit-account.md)
  * [用量与费用](billing-status/get-v1-credit-account-usage.md)
  * [账本流水](billing-status/get-v1-credit-account-ledger.md)
* [Portfolio 预算](billing-status/allocations.md)
  * [预算总览](billing-status/get-v1-credit-account-allocations.md)
  * [设置预算上限](billing-status/put-v1-credit-account-allocations-portfolioid.md)
  * [取消预算上限](billing-status/delete-v1-credit-account-allocations-portfolioid.md)
  * [预算对账](billing-status/get-v1-credit-account-allocations-audit.md)
* [价目与售价](billing-status/pricing.md)
  * [我的价目表](billing-status/get-v1-pricing-rates.md)
  * [我的售价策略](billing-status/get-v1-pricing-tariff.md)
* [服务状态探针](billing-status/health.md)
  * [进程存活检查](billing-status/get-live.md)
  * [就绪检查](billing-status/get-ready.md)
