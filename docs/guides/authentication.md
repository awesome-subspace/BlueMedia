---
title: "认证与权限"
description: "除公开端点（Meta 回调、健康检查）外，所有请求都要带 `Authorization: Bearer <API_KEY>`。请把 API Key 当作密码保存，不要放进前端代码、URL、日志或工单截图。"
---

除公开端点（Meta 回调、健康检查）外，所有请求都要带 `Authorization: Bearer <API_KEY>`。请把 API Key 当作密码保存，不要放进前端代码、URL、日志或工单截图。

## API Key 的授权范围

每把 API Key 都绑定到一个客户 Business Portfolio，并自动限制为该 Portfolio 及其下属 WABA、号码和业务数据。调用方不需要理解或选择内部权限层级，只需使用交付给自己的 API Key。

- 访问授权范围之外的资源会返回 `403` 或 `404`，不会泄露资源是否存在。
- 列表接口如果要求 `portfolioId` 或 `wabaId`，必须传当前授权范围内的值。
- API Key 的授权范围由服务端维护，不能通过请求参数扩大。
- 如需更换授权范围、增加号码或重新签发 Key，请联系 BlueMedia 支持人员。

## Scope（细粒度权限）

API Key 还可能带有细粒度 scope。每个接口需要的 scope 写在该接口页顶部的「鉴权」提示里；缺少时返回 `403`。调用方不能自行扩大 scope，如需调整请联系 BlueMedia 支持人员。

全部取值，以及**实际被检查**的接口：

| scope | 检查它的接口 |
| ----- | ------------ |
| `messages:send` | `POST /v1/messages`、`POST /v1/messages/read`、`POST /v1/broadcasts` 及其 pause/resume/cancel、`POST /v1/conversions/events` |
| `messages:read` | `GET /v1/conversations`、`GET /v1/conversations/{id}`、`POST /v1/conversations/{id}/read`、`GET /v1/broadcasts` 系列、`GET /v1/conversions/events` |
| `templates:manage` | 模板的创建/编辑/删除/同步、模板分析及其开启、上传模板媒体头、以及 Flow 的创建/编辑/上传 JSON/发布/弃用/删除 |
| `media:write` | `POST /v1/media`、`DELETE /v1/media/{id}` |
| `phone_numbers:manage` | 号码的 register / deregister / request-code / verify-code / two-step-pin / display-name / refresh |
| `phone_numbers:read` | `GET /v1/phone-numbers/{id}/registration-status` |
| `onboarding:read` | `GET /v1/onboarding/embedded-signup` 系列、`GET /v1/onboarding/invitations`、`GET /v1/business-portfolios/{id}/token-scopes` |
| `onboarding:write` | 创建/重试接入操作、创建与撤销邀请、上报 ES 事件、绑定 Pixel、额度授权与撤销 |
| `billing:read` | `GET /v1/credit-account/usage`、`GET /v1/credit-account/ledger`、Portfolio 预算的读写与对账、`GET /v1/wabas/{id}/analytics` |

两点容易误会：

- **没有在接口页「鉴权」里列出 scope 的接口，就是不检查额外 scope**，带任意有效 API Key 即可调用。资产与消息的多数**读**接口（如 `GET /v1/messages`、`GET /v1/phone-numbers`、`GET /v1/templates`、`GET /v1/credit-account`）属于这一类——它们仍然受 API Key 的授权范围约束，只是不额外要求 scope。
- 部分 Key 的 scope 是 `*`（不限）或为空（历史上签发的宽权限 Key），这两种都**通过所有** scope 检查。

## 按号码限制

API Key 可能进一步限制为指定号码。若一个属于当前 Business Portfolio 的号码仍返回 `403`，请确认该号码是否已加入当前 Key 的授权范围。

## 门户账号 ≠ API 鉴权

开发者控制台使用浏览器会话。服务端集成请始终使用 `Authorization: Bearer` + API Key，不要复制浏览器会话信息作为长期凭证。

## 联调时确认凭证归属

调用 `GET /whoami` 可以快速确认 API Key 是否有效，并读取当前账户标识与服务版本。该接口不会返回完整密钥、号码白名单或其它敏感授权信息。
