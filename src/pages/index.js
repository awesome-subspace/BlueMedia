import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';

/**
 * 品牌型首页，遵循 DESIGN.md（Notion 分析）的结构语言：
 *   全页唯一一块深色 hero「夜景」带 + 暖纸本底 + 发丝线白卡、
 *   重字重负字距的标题、药丸形营销 CTA、克制到只有一个结构强调色。
 * 唯一偏离：那个强调色用 BlueMedia 品牌蓝，而非 Notion 蓝。
 * 贴纸色板只做装饰（星点、光晕、色块），不承载任何动作。
 */

const SAMPLES = [
  {
    value: 'curl',
    label: 'cURL',
    language: 'bash',
    code: `curl -X POST https://api.bsptest.com/v1/messages \\
  -H "Authorization: Bearer $BSP_API_KEY" \\
  -H "Idempotency-Key: order-8821-notify" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phoneNumberId": "pn_01923abc",
    "to": "8613800138000",
    "type": "text",
    "text": { "body": "你好，你的订单已发货。" }
  }'`,
  },
  {
    value: 'node',
    label: 'Node.js',
    language: 'js',
    code: `const res = await fetch("https://api.bsptest.com/v1/messages", {
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

// 202 只代表已受理，真实状态要轮询消息详情或接 Webhook
const { id, status } = await res.json();`,
  },
  {
    value: 'python',
    label: 'Python',
    language: 'python',
    code: `import os, requests

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

# 202 只代表已受理，真实状态要轮询消息详情或接 Webhook
message = res.json()`,
  },
  {
    value: 'go',
    label: 'Go',
    language: 'go',
    code: `payload := []byte(\`{
  "phoneNumberId": "pn_01923abc",
  "to": "8613800138000",
  "type": "text",
  "text": { "body": "你好，你的订单已发货。" }
}\`)

req, _ := http.NewRequest(http.MethodPost,
    "https://api.bsptest.com/v1/messages", bytes.NewReader(payload))
req.Header.Set("Authorization", "Bearer "+os.Getenv("BSP_API_KEY"))
req.Header.Set("Idempotency-Key", "order-8821-notify")
req.Header.Set("Content-Type", "application/json")

res, err := http.DefaultClient.Do(req)
if err != nil {
    return err
}
defer res.Body.Close()

// 202 只代表已受理，真实状态要轮询消息详情或接 Webhook`,
  },
  {
    value: 'java',
    label: 'Java',
    language: 'java',
    code: `var payload = """
    {
      "phoneNumberId": "pn_01923abc",
      "to": "8613800138000",
      "type": "text",
      "text": { "body": "你好，你的订单已发货。" }
    }""";

var request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.bsptest.com/v1/messages"))
    .header("Authorization", "Bearer " + System.getenv("BSP_API_KEY"))
    .header("Idempotency-Key", "order-8821-notify")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(payload))
    .build();

var res = HttpClient.newHttpClient()
    .send(request, HttpResponse.BodyHandlers.ofString());

// 202 只代表已受理，真实状态要轮询消息详情或接 Webhook`,
  },
  {
    value: 'php',
    label: 'PHP',
    language: 'php',
    code: `<?php
$ch = curl_init('https://api.bsptest.com/v1/messages');

curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . getenv('BSP_API_KEY'),
        'Idempotency-Key: order-8821-notify',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'phoneNumberId' => 'pn_01923abc',
        'to' => '8613800138000',
        'type' => 'text',
        'text' => ['body' => '你好，你的订单已发货。'],
    ], JSON_UNESCAPED_UNICODE),
]);

$response = curl_exec($ch);
// 202 只代表已受理，真实状态要轮询消息详情或接 Webhook`,
  },
];

const STARS = [
  [6, 22], [13, 68], [21, 14], [28, 44], [36, 78], [44, 20],
  [51, 58], [58, 34], [66, 72], [73, 18], [81, 50], [88, 28],
  [93, 66], [97, 40],
];

const PILLARS = [
  {
    tone: 'sky',
    title: '一次接入，全链路可追',
    body: '从客户授权、号码注册到消息投递与计费，每一步都有落库的状态和可恢复的重试，不靠猜。',
  },
  {
    tone: 'pink',
    title: '把踩过的坑写进文档',
    body: '24 小时窗口、幂等键、预留与冲回、Meta 侧限流——该提醒的地方都提醒了，而不是只罗列字段。',
  },
  {
    tone: 'teal',
    title: '错误告诉你该找谁',
    body: '每个失败码都标了能不能重试、该由调用方修还是平台修，不用再逐条去对 Meta 的原始错误表。',
  },
];

export default function Home() {
  return (
    <Layout
      title="开发者文档"
      description="接入 WhatsApp Business Platform 所需的全部接口与指南：客户接入、号码管理、消息发送、Webhook 回调和账务查询。">
      <div className={styles.page}>
        {/* ── 夜景带：全页唯一的深色岛屿 ── */}
        <header className={styles.hero}>
          {/* 光影层：两团缓慢漂移的极光 + 顶部光束 + 网格 + 暗角 */}
          <div className={styles.aurora} aria-hidden="true">
            <span className={styles.auroraA} />
            <span className={styles.auroraB} />
            <span className={styles.auroraC} />
          </div>
          <div className={styles.beam} aria-hidden="true" />
          <div className={styles.grid} aria-hidden="true" />
          <div className={styles.vignette} aria-hidden="true" />

          <div className={styles.stars} aria-hidden="true">
            {STARS.map(([left, top], i) => (
              <span
                key={i}
                className={styles.star}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `${(i % 7) * 0.8}s`,
                }}
              />
            ))}
          </div>

          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <img
                className={styles.heroLogo}
                src={useBaseUrl('/img/logo-bluemedia-dark.svg')}
                alt="BlueMedia"
              />
              <h1 className={styles.heroTitle}>
                把 WhatsApp
                <br />
                接进你的业务
              </h1>
              <p className={styles.heroTagline}>
                BlueMedia 开发者文档 —— 接入 WhatsApp Business Platform
                所需的全部接口与指南。
              </p>
              <div className={styles.actions}>
                <Link className={styles.btnPrimary} to="/docs/guides/quickstart">
                  快速开始
                </Link>
                <Link className={styles.btnSecondary} to="/docs/">
                  阅读文档
                </Link>
              </div>
            </div>

            <div className={styles.heroWell}>
              <div className={styles.wellGlow} aria-hidden="true" />
              <div className={styles.wellBar} aria-hidden="true">
                <span />
                <span />
                <span />
                <em>发出第一条消息</em>
              </div>
              <div className={styles.wellBody}>
                <Tabs groupId="lang" className={styles.langTabs}>
                  {SAMPLES.map((s, i) => (
                    <TabItem
                      key={s.value}
                      value={s.value}
                      label={s.label}
                      default={i === 0}>
                      <CodeBlock language={s.language}>{s.code}</CodeBlock>
                    </TabItem>
                  ))}
                </Tabs>
              </div>
            </div>
          </div>
        </header>

        {/* ── 暖纸本底上的品牌陈述 ── */}
        <section className={styles.statement}>
          <div className={styles.statementInner}>
            <span className={styles.badgePill}>为什么是这份文档</span>
            <h2 className={styles.statementTitle}>
              接口文档的价值不在字段表，
              <br />
              在于把「会出什么错」说清楚。
            </h2>

            <div className={styles.pillars}>
              {PILLARS.map((p) => (
                <div key={p.title} className={styles.pillar}>
                  <span
                    className={`${styles.sticker} ${styles[`sticker--${p.tone}`]}`}
                    aria-hidden="true"
                  />
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 收尾 CTA ── */}
        <section className={styles.closing}>
          <div className={styles.closingInner}>
            <h2>准备好了就从第一条消息开始。</h2>
            <Link className={styles.btnPrimary} to="/docs/guides/quickstart">
              快速开始
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
