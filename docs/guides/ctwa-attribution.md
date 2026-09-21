---
title: "广告归因与转化上报"
description: "用户点「点击进入 WhatsApp」广告（Click to WhatsApp，CTWA）发来的第一条消息里，带着这次**广告点击的 id**。把它和后续的成交/线索一起报回 Meta，广告后台才能算出这条广告到底带来了多少转化。这份数据只在那一次 webhook 里出现，Meta 的 Graph API 事后查不到，所以平台会替你存下来。"
---

用户点「点击进入 WhatsApp」广告（Click to WhatsApp，CTWA）发来的第一条消息里，带着这次**广告点击的 id**。把它和后续的成交/线索一起报回 Meta，广告后台才能算出这条广告到底带来了多少转化。这份数据只在那一次 webhook 里出现，Meta 的 Graph API 事后查不到，所以平台会替你存下来。

## 前置条件

| 条件                            | 说明                                                                                                                                                        |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 客户已投 CTWA 广告              | 只有从广告点进来的对话才有可归因的点击 id。普通对话没有。                                                                                                   |
| Business Portfolio 已绑定 Pixel | 转化事件要报到客户自己的 Meta Pixel（dataset）上。绑定关系来自嵌入式注册时客户选择的 Pixel；也可以事后用 `POST /v1/business-portfolios/{id}/dataset` 补绑。 |

:::note

**没绑 Pixel 也可以先报。**事件会被存下来（状态 `skipped`）而不是丢掉——webhook 不会重投，事件无法重造。补绑 Pixel 时平台会把它们自动重新排队。

:::

## 1\. 找出广告带来的对话

收件箱列表和会话详情都会带上广告归因字段：

```GET /v1/conversations 的一条记录（截取）
{
  "id": "conv_...",
  "contactWaId": "8613800138000",
  "contactName": "张三",
  "ctwaClid": "Aff-n8ZTODiE79d22KtAwQKj9e_mIEOOj...",
  "adSourceId": "120210000000000000",
  "adSourceUrl": "https://fb.me/xxxxx",
  "adSourceType": "ad",
  "attributedAt": "2026-08-21T09:12:00.000Z"
}
```

`adSourceId` 就是广告 id，回答「这个客户是哪条广告带来的」；`ctwaClid` 是上报转化时唯一被 Meta 接受的标识。归因取**首次触达**：同一个人日后又点了别的广告进来，也不会覆盖这个会话最初的来源（逐条消息的完整 `referral` 仍保留在消息记录里）。

:::warning

**`ctwaClid` 可能为空，而 `adSourceId` 有值。**WhatsApp Status 广告位不下发点击 id（Meta 的既定行为）。这类对话能看出来自哪条广告，但**无法上报转化**。

:::

## 2\. 上报转化

客户在你的网站/系统里完成了成交或留下线索时，把它报上来。`value` 用**主单位**（250 就是 250 元），与 Meta 的口径一致：

```bash
curl -X POST https://api.bsptest.com/v1/conversions/events \
  -H 'Authorization: Bearer <API_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{
    "portfolioId": "bm_...",
    "ctwaClid": "<会话上的 ctwaClid>",
    "eventName": "Purchase",
    "value": 250,
    "currency": "CNY",
    "timestamp": 1787000000,
    "idempotencyKey": "order-20260821-8891"
  }'
```

```202 Accepted
{
  "accepted": true,
  "queued": true,
  "datasetBound": true
}
```

`eventName` 用 Meta 的标准事件名：`Purchase`、`LeadSubmitted`、`AddToCart`、`InitiateCheckout`。

:::warning

**202 只代表「已排队」，不代表已经报给 Meta。**平台先落库、再由后台任务异步上报（这样 Meta 临时故障、token 过期、还没绑 Pixel 都不会让事件丢掉）。真实结果看下一步的 `status`。

:::

两个容易错的地方：

- **`timestamp` 要填事件*真实发生*的时间**（unix 秒），不是调用接口的时间——Meta 的归因窗口按事件时间计算，填成"现在"会把昨天的成交算到今天。省略则取当前时间。
- **建议带 `idempotencyKey`**（比如订单号）。网络超时重试时，同一个 key 只会排队一次；不带的话平台按「点击 + 事件名 + 秒级时间」自动去重，两次重试若跨秒就会变成两笔。

## 3\. 查上报状态

```bash
curl -H 'Authorization: Bearer <API_KEY>' \
  'https://api.bsptest.com/v1/conversions/events?limit=20&status=failed'
```

| status    | 含义                                                                                                      |
| --------- | --------------------------------------------------------------------------------------------------------- |
| `pending` | 待上报（含失败后退避重试中）。                                                                            |
| `sending` | 本轮正在上报。                                                                                            |
| `sent`    | Meta 已接受。                                                                                             |
| `failed`  | 不可重试的失败，`lastError` 是原因（常见：Business Portfolio 的 Meta 授权已失效，需要客户重新完成接入）。 |
| `skipped` | 保存事件时 Business Portfolio 尚未绑定 Pixel。补绑后会自动重新排队。                                      |

`source` 区分来源：`api` 是本接口报的，`automatic_events` 是 Meta 自动识别的（见下）。

## Meta 自动识别的转化

客户可以授权 Meta 对广告带来的对话做自动分析，由 Meta 判断发生了下单或留线索，再把结论推给平台——平台会自动排队上报，**不需要你调任何接口**，在上一步的列表里以 `source: automatic_events` 出现。

开启方式：客户在嵌入式注册流程的资产页勾选「自动识别订单和线索事件」，或事后在 Meta Business Suite → 设置 → WhatsApp 账户 → 隐私与数据共享里打开对应开关。

:::note

**欧盟、英国、日本的客户不可用**（Meta 的限制）。另外它是*推断*结果，与你自己确认的成交可能不完全一致——两者会分别记录，不会互相覆盖。

:::

## Pixel（dataset）怎么绑

正常情况下不需要手动绑定：客户走嵌入式注册时选择的 Pixel 会自动关联到对应的 Business Portfolio。以下两种情况需要补绑——

- 客户是在平台支持这项能力之前接入的；
- 接入时没走到选 Pixel 那一步。

```bash
curl -X POST https://api.bsptest.com/v1/business-portfolios/bm_.../dataset \
  -H 'Authorization: Bearer <API_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"datasetId": "1234567890"}'
```

响应里的 `requeuedConversionEvents` 是这次被重新排队的历史事件条数（即此前状态为 `skipped` 的那些）。

:::warning

**拥有 Pixel 的商业主体必须和拥有 WABA 的是同一个**（Meta 的要求）。绑错主体的 Pixel 会在上报阶段被拒，表现为事件变成 `failed`。

:::
