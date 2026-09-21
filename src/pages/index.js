import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';

const DOMAINS = [
  {
    label: 'GUIDES',
    title: '开发指南',
    description: '从 API Key 验证、客户接入、号码注册到计费口径的端到端说明。',
    count: '9 篇',
    to: '/docs/guides/quickstart',
  },
  {
    label: 'MESSAGING',
    title: '消息发送与状态',
    description: '出站消息、群发活动、转化上报，以及状态机与 24 小时客服窗口。',
    count: '13 个接口',
    to: '/docs/messaging/messages',
  },
  {
    label: 'ONBOARDING',
    title: 'WhatsApp 客户接入',
    description: '代客接入与一次性邀请链接两条路径，共用同一套可恢复的五步编排。',
    count: '13 个接口',
    to: '/docs/onboarding/provider-onboarding',
  },
  {
    label: 'ASSETS',
    title: '资产与号码配置',
    description: 'Business Portfolio、WABA、号码注册验证、商业资料与消息路由。',
    count: '34 个接口',
    to: '/docs/assets-phone-numbers/business-portfolios',
  },
  {
    label: 'CONTENT',
    title: '模板、Flow 与媒体',
    description: '模板审核与同步、Flow 发布与弃用、媒体上传与代理下载。',
    count: '23 个接口',
    to: '/docs/templates-flows-media/templates',
  },
  {
    label: 'BILLING',
    title: '账务与服务状态',
    description: '信用账户、Portfolio 预算、价目表，以及存活与就绪探针。',
    count: '11 个接口',
    to: '/docs/billing-status/credit-account',
  },
];

const TASKS = [
  {title: '发出第一条消息', to: '/docs/guides/quickstart'},
  {title: '接入一个新客户', to: '/docs/guides/customer-onboarding'},
  {title: '验证 Webhook 签名', to: '/docs/guides/webhook-integration'},
  {title: '注册并验证号码', to: '/docs/guides/phone-numbers'},
  {title: '创建群发活动', to: '/docs/messaging/broadcasts'},
  {title: '读懂用量与账单口径', to: '/docs/guides/billing'},
  {title: '上报广告转化事件', to: '/docs/guides/ctwa-attribution'},
  {title: '设置 Portfolio 预算上限', to: '/docs/billing-status/allocations'},
];

const HELP = [
  {
    title: '错误码',
    description: 'HTTP 错误与消息失败码两套体系，附 Meta 原始码对照。',
    to: '/docs/guides/error-codes',
  },
  {
    title: '常见问题',
    description: '接入时最常踩的二十来个坑，每条直达对应接口页。',
    to: '/docs/reference/faq',
  },
  {
    title: '限流与配额',
    description: '平台侧与 Meta 侧的限制汇总，标明各自该怎么处理。',
    to: '/docs/reference/rate-limits',
  },
  {
    title: '术语表',
    description: 'ID 前缀速查，以及账务、接入、Webhook 的关键字段含义。',
    to: '/docs/reference/glossary',
  },
];

const CURL = `curl -X POST https://api.bsptest.com/v1/messages \\
  -H "Authorization: Bearer <API_KEY>" \\
  -H "Idempotency-Key: order-8821-notify" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phoneNumberId": "pn_01923abc",
    "to": "8613800138000",
    "type": "text",
    "text": { "body": "你好，你的订单已发货。" }
  }'`;

const NODE = `const res = await fetch("https://api.bsptest.com/v1/messages", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.BSP_API_KEY}\`,
    "Idempotency-Key": "order-8821-notify",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    phoneNumberId: "pn_01923abc",
    to: "8613800138000",
    type: "text",
    text: { body: "你好，你的订单已发货。" },
  }),
});

// 202 只代表已受理，真实状态要轮询 GET /v1/messages/{id} 或接 Webhook
const { id, status } = await res.json();`;

const PYTHON = `import os, requests

res = requests.post(
    "https://api.bsptest.com/v1/messages",
    headers={
        "Authorization": f"Bearer {os.environ['BSP_API_KEY']}",
        "Idempotency-Key": "order-8821-notify",
    },
    json={
        "phoneNumberId": "pn_01923abc",
        "to": "8613800138000",
        "type": "text",
        "text": {"body": "你好，你的订单已发货。"},
    },
    timeout=10,
)

# 202 只代表已受理，真实状态要轮询 GET /v1/messages/{id} 或接 Webhook
message = res.json()`;

function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <img
            className={styles.heroLogo}
            src={useBaseUrl('/img/logo-bluemedia-dark.svg')}
            alt="BlueMedia"
          />
          <h1 className={styles.heroTitle}>开发者文档</h1>
          <p className={styles.heroTagline}>
            接入 WhatsApp Business Platform 所需的全部接口与指南。客户接入、号码管理、
            模板与消息发送、Webhook 回调、账务查询，一处查全。
          </p>
          <div className={styles.actions}>
            <Link className={styles.btnPrimary} to="/docs/guides/quickstart">
              快速开始
            </Link>
            <Link className={styles.btnGhost} to="/docs/">
              浏览全部接口
            </Link>
          </div>
          <dl className={styles.stats}>
            <div>
              <dt>113</dt>
              <dd>个接口</dd>
            </div>
            <div>
              <dt>9</dt>
              <dd>篇指南</dd>
            </div>
            <div>
              <dt>3 级</dt>
              <dd>业务域导航</dd>
            </div>
          </dl>
        </div>

        <div className={styles.heroCode}>
          <Tabs groupId="lang" className={styles.langTabs}>
            <TabItem value="curl" label="cURL" default>
              <CodeBlock language="bash">{CURL}</CodeBlock>
            </TabItem>
            <TabItem value="node" label="Node.js">
              <CodeBlock language="js">{NODE}</CodeBlock>
            </TabItem>
            <TabItem value="python" label="Python">
              <CodeBlock language="python">{PYTHON}</CodeBlock>
            </TabItem>
          </Tabs>
        </div>
      </div>
    </header>
  );
}

function Section({title, description, children, muted}) {
  return (
    <section className={muted ? styles.sectionMuted : styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHead}>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title="开发者文档"
      description="接入 WhatsApp Business Platform 所需的全部接口与指南：客户接入、号码管理、消息发送、Webhook 回调和账务查询。">
      <Hero />

      <Section
        title="按业务域浏览"
        description="每个业务域下先有一页资源组概览，说明这组接口解决什么问题、有哪些易错点，再往下才是具体接口。">
        <div className={styles.domainGrid}>
          {DOMAINS.map((d) => (
            <Link key={d.to} to={d.to} className={styles.domainCard}>
              <div className={styles.domainTop}>
                <span className={styles.domainLabel}>{d.label}</span>
                <span className={styles.domainCount}>{d.count}</span>
              </div>
              <span className={styles.domainTitle}>{d.title}</span>
              <span className={styles.domainDesc}>{d.description}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="常见任务" muted>
        <ul className={styles.taskList}>
          {TASKS.map((t) => (
            <li key={t.to}>
              <Link to={t.to}>{t.title}</Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="遇到问题"
        description="先看这四页——绝大多数「为什么被拒了」「为什么数字对不上」在这里有现成答案。">
        <div className={styles.helpGrid}>
          {HELP.map((h) => (
            <Link key={h.to} to={h.to} className={styles.helpCard}>
              <span className={styles.helpTitle}>{h.title}</span>
              <span className={styles.helpDesc}>{h.description}</span>
            </Link>
          ))}
        </div>
      </Section>
    </Layout>
  );
}
