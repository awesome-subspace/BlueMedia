---
title: "BlueMedia API"
excerpt: "使用 BlueMedia API 接入 WhatsApp Business Platform，完成客户接入、号码管理、消息发送、Webhook 回调和账务查询。"
---

# BlueMedia API

通过 BlueMedia API 接入 WhatsApp Business Platform，完成客户接入、号码管理、模板与消息发送、Webhook 回调和账务查询。

{% hint style="info" %}
开始前请准备 BlueMedia 提供的 **API Key**。除特别标注的公开端点外，请求都需要携带 `Authorization: Bearer <API_KEY>`。
{% endhint %}

**API Base URL**

```text
https://api.bsptest.com
```

## 从这里开始

<table data-view="cards">
  <thead>
    <tr>
      <th></th>
      <th data-type="content-ref"></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>快速开始</strong><br>验证 API Key，并完成第一次 API 调用。</td>
      <td><a href="guides/quickstart.md">开始接入</a></td>
    </tr>
    <tr>
      <td><strong>发送第一条消息</strong><br>提交消息并跟踪 accepted、sent、delivered、read 等状态。</td>
      <td><a href="guides/messaging.md">查看消息指南</a></td>
    </tr>
    <tr>
      <td><strong>接入客户</strong><br>创建邀请，让客户完成 Meta 授权和资产落地。</td>
      <td><a href="guides/customer-onboarding.md">查看接入流程</a></td>
    </tr>
    <tr>
      <td><strong>配置 Webhook</strong><br>安全接收消息状态、入站消息和业务事件。</td>
      <td><a href="guides/webhook-integration.md">配置回调</a></td>
    </tr>
    <tr>
      <td><strong>管理号码</strong><br>完成验证码、注册、商业资料和生命周期管理。</td>
      <td><a href="guides/phone-numbers.md">查看号码指南</a></td>
    </tr>
    <tr>
      <td><strong>错误码与排障</strong><br>根据 HTTP 状态、错误码和 requestId 快速定位问题。</td>
      <td><a href="guides/error-codes.md">开始排障</a></td>
    </tr>
  </tbody>
</table>

## 推荐接入顺序

1. 阅读[快速开始](guides/quickstart.md)，验证 API Key。
2. 按[客户接入](guides/customer-onboarding.md)完成 Business Portfolio、WABA 和号码接入。
3. 配置[Webhook](guides/webhook-integration.md)，确保能接收异步状态和入站消息。
4. 按[发消息与状态追踪](guides/messaging.md)发送测试消息并确认最终状态。

左侧导航已按业务域收录全部接口。每个接口均为独立 Markdown 页面，可单独维护、评审和追踪变更。
