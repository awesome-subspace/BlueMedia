---
title: "认证与权限"
excerpt: "除公开端点（Meta 回调、健康检查）外，所有请求都要带 `Authorization: Bearer <API_KEY>`。请把 API Key 当作密码保存，不要放进前端代码、URL、日志或工单截图。"
---

除公开端点（Meta 回调、健康检查）外，所有请求都要带 `Authorization: Bearer <API_KEY>`。请把 API Key 当作密码保存，不要放进前端代码、URL、日志或工单截图。

## API Key 的授权范围

每把 API Key 都绑定到一个客户 Business Portfolio，并自动限制为该 Portfolio 及其下属 WABA、号码和业务数据。调用方不需要理解或选择内部权限层级，只需使用交付给自己的 API Key。

- 访问授权范围之外的资源会返回 `403` 或 `404`，不会泄露资源是否存在。
- 列表接口如果要求 `portfolioId` 或 `wabaId`，必须传当前授权范围内的值。
- API Key 的授权范围由服务端维护，不能通过请求参数扩大。
- 如需更换授权范围、增加号码或重新签发 Key，请联系 BlueMedia 支持人员。

## Scope（细粒度权限）

API Key 还可能带有细粒度 scope。每个接口需要的 scope 会显示在接口标题旁；缺少时返回 `403`。调用方不能自行扩大 scope，如需调整请联系 BlueMedia 支持人员。

## 按号码限制

API Key 可能进一步限制为指定号码。若一个属于当前 Business Portfolio 的号码仍返回 `403`，请确认该号码是否已加入当前 Key 的授权范围。

## 门户账号 ≠ API 鉴权

开发者控制台使用浏览器会话。服务端集成请始终使用 `Authorization: Bearer` + API Key，不要复制浏览器会话信息作为长期凭证。

## 联调时确认凭证归属

调用 `GET /whoami` 可以快速确认 API Key 是否有效，并读取当前账户标识与服务版本。该接口不会返回完整密钥、号码白名单或其它敏感授权信息。
