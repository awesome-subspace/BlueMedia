---
title: "错误码"
excerpt: "HTTP 错误码、消息投递失败码及处理建议。"
---

## 错误码

| code | httpStatus | retryable | 说明 |
| --- | --- | --- | --- |
| UNAUTHENTICATED | 401 | 否 | 缺少或无效 Bearer 令牌 |
| FORBIDDEN | 403 | 否 | 请求被拒绝 |
| TENANT_FORBIDDEN | 403 | 否 | 账户、角色或 scope 不足 |
| VALIDATION_FAILED | 400 / 409 | 否 | 参数或状态冲突 |
| NOT_FOUND | 404 | 否 | 资源不存在或不属于当前账户 |
| IDEMPOTENCY_CONFLICT | 409 | 否 | 同一 Idempotency-Key 被用于不同的请求内容 |
| INSUFFICIENT_FUNDS | 402 | 否 | 信用账户可用余额不足，需充值或调整额度 |
| BM_BUDGET_EXCEEDED | 402 | 否 | 账户余额充足，但该消息所属 Business Portfolio 的预算已用完；请调整该 Portfolio 的预算上限。`details` 给出 portfolioId / remainingMinor |
| WHATSAPP_24H_WINDOW_EXPIRED | 409 | 否 | 距客户上次回复已超过 24 小时，此时只能发模板消息；`details.customerAction` 给出下一步 |
| RATE_LIMITED | 429 | 是 | 退避后重试 |
| PRICE_IMPORT_INVALID | 400 / 409 | 否 | 费率表 CSV 校验不通过，或当前状态不允许这次操作（例如发布一个已发布的导入）。`details.issues` 逐条带**行号**；存在 high 级 warning 时 `details.warnings` 给出需要确认的清单 |
| PRICING_UNAVAILABLE | 409 | 否 | 按 market + 类别查不到费率（或该币种当天没有已发布版本）。**不会退化成按 0 计费** —— 缺价格是故障，要有人去补价格表 |
| ENGAGEMENT_COOLDOWN | 429 | 否 | 该收件人最近从这个号码触发了 Meta 人均互动上限（131049），本地在 24h 冷却期内直接拒绝再发模板 —— 24h 内重试会延长 Meta 的封禁（且不限营销）。请等待或更换收件人，**不要**当作可退避重试 |
| MARKETING_OPT_OUT | 403 | 否 | 该收件人已在 WhatsApp 里关闭接收本商家的营销消息（`user_preferences` webhook 的 `stop`）。**没有期限**，只有用户自己重新打开才解除 —— 请把该号码从营销名单中移除。硬发的话 Meta 会受理然后在投递阶段判 131050，白占一次预留并在号码质量评级上留一条 failed |
| UPSTREAM_META_ERROR | 502 | 视响应而定 | Meta 返回了错误。**`message` 就是 Meta 自己那句原文,我们不改写**;`upstream` 里是整段原生信封:`code`（Meta 数字码，按官方建议用它做错误处理）、`details`（`error_data.details`，官方建议的另一个依据）、`userTitle` / `userMsg`（Meta 常把「怎么修」只写在这里）、`type`、`traceId`（`fbtrace_id`，开 Direct Support 工单唯一能带的凭据）、`subcode`（官方标注 v16.0+ 不再返回，**不要**据此写逻辑） |
| INTERNAL | 500 | 通常是 | 记录请求信息后重试或告警 |

## 消息失败码（`GET /v1/messages/{id}` 的 `error.code`）

与上面的 HTTP 错误码是**两套东西**：这里的码描述一条已被受理的消息为什么最终没送达，通过消息详情和状态 webhook 返回，不是 HTTP 响应的 `error.code`。

**失败来自 Meta 时，`error.code` 就是下表「Meta 码」那一列的数字**（可直接对 Meta 官方错误码表），`error.message` 是 Meta 原文，`error.meta` 是整段原生信封（含 `details` 与 `fbtrace_id`）。只有本地判定的失败（账户余额不足、Business Portfolio 预算不足、本地 131049 冷却、重试耗尽）没有 Meta 数字码，`error.code` 才是下表左列那种我方码。下表的「说明」是我们写的分类说明，不是 Meta 的原文。

`retryable` / `customerAction` / `stage` 是**平台的判断**而非 Meta 给的字段：`retryable: false` 的码重试会得到一模一样的结果，`customerAction` 指出该谁去修（`fix_template_params` 是调用方五秒能改好的，`contact_platform_admin` 是我们的事）。

| 我方码 | Meta 码 | 阶段 | 可重试 | customerAction | 说明 |
| --- | --- | --- | --- | --- | --- |
| BM_BUDGET_EXCEEDED | — | 提交 | 否 | raise_bm_budget | 该 Business Portfolio 的预算已用完，请调高其预算上限后重试。 |
| CREDIT_LINE_NOT_READY | 131042 | 投递 | 否 | authorize_credit_line | 该 WABA 的付款方式或 BlueMedia 信用额度不可用。若额度已挂载，请检查共享给该 Business Portfolio 的**分配额是否为 0**——需要在 Meta Business Suite 的「账单和付款 → 信用额度」中分配额度（API 无法设置）。 |
| DISPLAY_NAME_NOT_APPROVED | 131037, 2388103 | 提交 | 否 | approve_display_name | 该 555 测试号的显示名未通过审核，需在 Meta 后台修改并等待审核通过。 |
| FLOW_BLOCKED | 132068 | 提交 | 否 | fix_flow | 该 Flow 处于封禁状态，需先修正 Flow。 |
| FLOW_THROTTLED | 132069 | 提交 | 否 | fix_flow | 该 Flow 已被限流（最近一小时内已发出 10 条使用该 Flow 的消息），需先修正 Flow。 |
| INSUFFICIENT_FUNDS | — | 提交 | 否 | contact_platform_admin | 本地信用账户余额不足，请先充值或调整额度。 |
| INTERNAL | — | 提交 | 是（平台自动重试） | contact_platform_admin | 平台内部错误，正在自动重试；若持续失败请联系BlueMedia 支持团队并提供消息 ID。 |
| MARKETING_DISABLED_ON_CLOUD_API | 131063 | 提交 | 否 | use_marketing_messages_api | 该 WABA 已关闭 Cloud API 上的营销消息（disable_marketing_messages_on_cloud_api=true），营销类模板需改用 Marketing Messages API 发送。 |
| MARKETING_EXPERIMENT_EXCLUDED | 130472 | 投递 | 否 | none | 该消息因营销消息实验分组未被发送（Meta 侧的实验对照组行为），不是配置问题。 |
| MARKETING_OPT_OUT | 131050 | 投递 | 否 | stop_marketing_to_recipient | 收件人已在 WhatsApp 里关闭接收本商家的营销消息。不要重发（同样收不到），请把该号码从营销名单中移除；对方重新开启后 Meta 会通过 user_preferences webhook 通知。 |
| MEDIA_DOWNLOAD_FAILED | 131052 | 投递 | 否 | check_media | 无法下载用户发来的媒体文件，具体原因见 error.meta.details；可请用户用其他方式发送该文件。 |
| MEDIA_UPLOAD_FAILED | 131053 | 提交 | 否 | check_media | 消息里的媒体文件无法上传（常见原因是格式不受支持），具体原因见 error.meta.details。 |
| MESSAGE_TYPE_UNSUPPORTED | 131051 | 提交 | 否 | fix_request_params | 不支持的消息类型，请改用受支持的消息类型。 |
| MESSAGE_UNDELIVERABLE | 131026 | 投递 | 否 | check_recipient | 消息无法投递：收件号码可能不是 WhatsApp 用户，或未接受最新服务条款。 |
| META_ENGAGEMENT_LIMIT | 131049 | 投递 | 否 | wait_24h | Meta 为维护生态互动质量未投递该消息，对同一用户建议至少间隔 24 小时再试。 |
| META_PERMISSION_DENIED | 10, 200 | 提交 | 否 | fix_app_credentials | Meta 拒绝该请求的权限，需检查 App 权限与 Token 授权范围。 |
| META_RATE_LIMIT | 4, 80007 | 提交 | 是（平台自动重试） | retry_automatically | Meta 接口限流，平台会退避后自动重试。 |
| META_SERVICE_UNAVAILABLE | 131016, 133004 | 提交 | 是（平台自动重试） | retry_automatically | Meta 服务临时不可用，平台会退避后自动重试。 |
| META_THROUGHPUT_LIMIT | 130429 | 提交 | 是（平台自动重试） | retry_automatically | Cloud API 吞吐已达上限，平台会退避后自动重试。 |
| META_TOKEN_INVALID | 190 | 提交 | 否 | fix_app_credentials | Meta 访问令牌无效或已过期，需重新授权。 |
| PAIR_RATE_LIMIT | 131056 | 提交 | 是（平台自动重试） | retry_automatically | 同一发送号码对同一收件号码在短时间内发送过多，平台会退避后自动重试。 |
| PAYMENTS_TOS_PENDING | 134011 | 提交 | 否 | contact_platform_admin | 该 WABA 尚未接受 WhatsApp Payments 服务条款，需先按错误信息里的链接接受后再发。 |
| PHONE_NOT_REGISTERED | 131045, 133010 | 提交 | 否 | register_phone_number | 发送号码的注册状态有问题，需先在 WhatsApp Business Platform 上完成该号码的注册。 |
| PHONE_NOT_VERIFIED | 133006 | 提交 | 否 | register_phone_number | 该号码需要先完成验证才能注册使用。 |
| PHONE_SEND_RESTRICTED | 131048 | 提交 | 是（平台自动重试） | retry_automatically | 该号码的发送量被限制（此前消息被大量拦截或标记为垃圾信息）。平台会退避重试；若持续失败请在 WhatsApp Manager 查看该号码的质量评级。 |
| RECIPIENT_BLOCKED_BY_BUSINESS | 130403 | 投递 | 否 | unblock_recipient | 该商家已在 WhatsApp 上拉黑此用户，需先解除拉黑才能继续给他发消息。 |
| RECIPIENT_IS_SENDER | 131021 | 提交 | 否 | fix_request_params | 收件号码与发送号码相同，请改发给其他号码。 |
| REQUEST_PARAM_INVALID | 131009, 135000 | 提交 | 否 | fix_request_params | 请求中有一个或多个参数取值非法，请对照接口文档核对取值范围。 |
| REQUEST_PARAM_MISSING | 131008 | 提交 | 否 | fix_request_params | 请求缺少必填参数，请对照接口文档补齐。 |
| RETRIES_EXHAUSTED | — | 提交 | 否 | contact_platform_admin | 多次重试后仍未成功，请查看最后一次失败原因。 |
| TEMPLATE_CLASSIFICATION_LIMIT | 131064 | 提交 | 否 | contact_platform_admin | 该账号因模板分类违规触及发送上限（模板消息与直发消息都受限）。需检查模板分类是否正确，限制会在强制期结束后自动解除。 |
| TEMPLATE_DISABLED | 132016 | 提交 | 否 | fix_template | 该模板因多次被暂停已被永久停用，需用不同内容新建一个模板。 |
| TEMPLATE_NOT_FOUND | 132001 | 提交 | 否 | sync_template | 模板不存在或与 Meta 不同步，请先同步模板并确认名称与语言。 |
| TEMPLATE_PARAM_FORMAT_INVALID | 132012 | 提交 | 否 | fix_template_params | 模板参数格式不符合模板定义（如日期/货币等结构化参数写法错误）。 |
| TEMPLATE_PARAM_MISMATCH | 132000 | 提交 | 否 | fix_template_params | 模板参数数量与模板定义不一致，请按模板声明的占位符数量与顺序传 components。 |
| TEMPLATE_PAUSED | 132015 | 提交 | 否 | fix_template | 该模板因质量评级过低被暂停发送，需修改模板内容并重新过审。 |
| TEMPLATE_POLICY_VIOLATION | 132007 | 提交 | 否 | fix_template | 模板内容违反 WhatsApp 政策，需修改模板并重新提交审核。 |
| TEMPLATE_TEXT_TOO_LONG | 132005 | 提交 | 否 | fix_template | 模板译文超长，需在 WhatsApp Manager 里修改模板内容。 |
| UPSTREAM_META_ERROR | — | 提交 | 是（平台自动重试） | retry_automatically | 上游暂时不可用，平台会自动重试。 |
| WABA_MAINTENANCE_MODE | 131057 | 提交 | 是（平台自动重试） | retry_automatically | 该 WABA 处于维护模式（例如正在做吞吐升级），平台会退避后自动重试。 |
| WABA_RESTRICTED | 131031 | 提交 | 否 | contact_platform_admin | WABA 因违反平台政策被限制或数据无法验证，需BlueMedia 支持团队在 Meta 后台处理。 |
| WHATSAPP_24H_WINDOW_EXPIRED | 131047 | 提交 | 否 | use_template_or_wait_for_reply | 距客户上次回复已超过 24 小时，此时只能发送已审核的模板消息，或等客户先回话。 |
