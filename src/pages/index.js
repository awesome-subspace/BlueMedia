import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import styles from './index.module.css';

const SECTIONS = [
  {
    label: '开始使用',
    title: '指南',
    description: '从 API Key 验证、客户接入、号码注册到计费口径的端到端说明。',
    to: '/docs/guides/quickstart',
  },
  {
    label: '消息',
    title: '发送与状态',
    description: '出站消息、群发活动、转化事件上报，以及状态机与 24 小时窗口。',
    to: '/docs/messaging/messages',
  },
  {
    label: '资产',
    title: '号码与账户配置',
    description: 'Business Portfolio、WABA、号码注册验证与商业资料路由。',
    to: '/docs/assets-phone-numbers/business-portfolios',
  },
  {
    label: '内容',
    title: '模板、Flow 与媒体',
    description: '模板审核、Flow 发布、媒体上传与代理下载。',
    to: '/docs/templates-flows-media/templates',
  },
  {
    label: '集成',
    title: 'Webhook',
    description: '端点创建、签名校验、所有权验证与测试事件。',
    to: '/docs/guides/webhook-integration',
  },
  {
    label: '排障',
    title: '错误码',
    description: 'HTTP 错误与消息失败码两套体系，含 Meta 原始码对照。',
    to: '/docs/guides/error-codes',
  },
];

const SAMPLE = `curl -X POST https://api.bsptest.com/v1/messages \\
  -H "Authorization: Bearer <API_KEY>" \\
  -H "Idempotency-Key: order-20260921-001" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phoneNumberId": "pn_01923abc",
    "to": "8613800138000",
    "type": "text",
    "text": { "body": "你的订单已发货" }
  }'`;

function Hero() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>WhatsApp Business Platform</p>
          <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
          <p className={styles.heroTagline}>{siteConfig.tagline}</p>
          <div className={styles.actions}>
            <Link className="button button--primary button--lg" to="/docs/guides/quickstart">
              快速开始
            </Link>
            <Link className="button button--secondary button--lg" to="/docs/">
              浏览全部接口
            </Link>
          </div>
          <p className={styles.heroMeta}>
            123 个接口 · 9 篇指南 · 按业务域三级组织
          </p>
        </div>
        <div className={styles.heroCode}>
          <CodeBlock language="bash" title="发送第一条消息">
            {SAMPLE}
          </CodeBlock>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout
      title="BSP 开发者文档"
      description="接入 WhatsApp Business Platform 所需的全部接口与指南。">
      <Hero />
      <main className={styles.main}>
        <h2 className={styles.sectionHeading}>按业务域浏览</h2>
        <div className={styles.grid}>
          {SECTIONS.map((s) => (
            <Link key={s.to} to={s.to} className={styles.card}>
              <span className={styles.cardLabel}>{s.label}</span>
              <span className={styles.cardTitle}>{s.title}</span>
              <span className={styles.cardDescription}>{s.description}</span>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}
