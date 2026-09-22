#!/usr/bin/env node
/**
 * 文档结构校验，在 CI 里先于 build 跑，用来给出比 webpack 报错更易读的诊断。
 *
 * 检查五类事情：
 *   1. sidebars.js 里的每个 doc id 都能找到对应文件
 *   2. docs/ 下的每个页面都被侧边栏收录，且只收录一次
 *   3. 每个页面都有 title 和 description（决定 SEO 与搜索结果里的摘要）
 *   4. 没有残留的 GitBook 专有语法
 *   5. OpenAPI、Webhook Schema 与 Agent 文件存在且保留关键契约
 */

import {readFileSync, readdirSync, statSync, existsSync} from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {parse as parseYaml} from 'yaml';

const root = path.resolve(import.meta.dirname, '..');
const docsRoot = path.join(root, 'docs');
const staticRoot = path.join(root, 'static');
const errors = [];

/** 与 docusaurus.config.js 的 prism.additionalLanguages 保持一致 */
const KNOWN_LANGUAGES = new Set([
  'bash',
  'json',
  'js',
  'jsx',
  'ts',
  'tsx',
  'text',
  'yaml',
  'http',
  'python',
  'mermaid',
  'css',
  'html',
  'diff',
  'md',
  'sql',
]);

function listDocs(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) out.push(...listDocs(full));
    else if (name.endsWith('.md') || name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

const sidebars = (await import(path.join(root, 'sidebars.mjs'))).default;

/** 收集侧边栏里引用到的全部 doc id */
function collectIds(nodes, acc = []) {
  for (const node of nodes) {
    if (node.type === 'doc') acc.push(node.id);
    if (node.link?.type === 'doc') acc.push(node.link.id);
    if (node.items) collectIds(node.items, acc);
  }
  return acc;
}

const ids = collectIds(Object.values(sidebars).flat());

// 1. 侧边栏引用的文件都存在
for (const id of ids) {
  const md = path.join(docsRoot, `${id}.md`);
  const mdx = path.join(docsRoot, `${id}.mdx`);
  if (!existsSync(md) && !existsSync(mdx)) {
    errors.push(`侧边栏引用了不存在的页面：${id}`);
  }
}

// 2. 每个页面被收录且只收录一次
const seen = new Map();
for (const id of ids) seen.set(id, (seen.get(id) ?? 0) + 1);
for (const [id, count] of seen) {
  if (count > 1) errors.push(`页面在侧边栏里重复收录 ${count} 次：${id}`);
}

const files = listDocs(docsRoot);
for (const file of files) {
  const id = path.relative(docsRoot, file).replace(/\.mdx?$/, '');
  if (!seen.has(id)) errors.push(`页面未被侧边栏收录：${id}`);
}

// 5. 面向 SDK / IDE / Agent 的公开契约必须存在，并保留关键组合约束。
const openApiPath = path.join(staticRoot, 'openapi.json');
if (!existsSync(openApiPath)) {
  errors.push('缺少 static/openapi.json；运行 npm run openapi:sync');
} else {
  try {
    const openapi = JSON.parse(readFileSync(openApiPath, 'utf8'));
    if (openapi.openapi !== '3.1.0')
      errors.push('static/openapi.json 必须是 OpenAPI 3.1.0');
    const schemas = openapi.components?.schemas ?? {};
    const messageRequest = schemas.MessageRequest;
    if (
      !Array.isArray(messageRequest?.oneOf) ||
      messageRequest.oneOf.length < 11
    ) {
      errors.push('MessageRequest 必须用 oneOf 完整描述消息类型');
    }
    if (messageRequest?.discriminator?.propertyName !== 'type') {
      errors.push('MessageRequest 缺少 type discriminator');
    }
    if (schemas.TextMessageRequest?.required?.includes('type')) {
      errors.push('TextMessageRequest 不应把向后兼容的 type 标成必填');
    }
    if (!schemas.ImageMessageRequest?.required?.includes('type')) {
      errors.push('非 text 消息必须显式要求 type');
    }
    if (!Array.isArray(schemas.ImageMessageRequest?.properties?.image?.oneOf)) {
      errors.push('ImageMessageRequest 未表达 id/link 恰好一个');
    }
    if (
      openapi.paths?.['/v1/messages']?.post?.responses?.['202']?.content ===
      undefined
    ) {
      errors.push('POST /v1/messages 缺少 202 response schema');
    }
    if (
      openapi.paths?.['/v1/messages']?.get?.responses?.['200']?.content ===
      undefined
    ) {
      errors.push('GET /v1/messages 缺少 200 response schema');
    }
    if (openapi.webhooks?.inboundEvent === undefined) {
      errors.push('OpenAPI 缺少 webhook 入口');
    }
    const operationIds = [];
    for (const pathItem of Object.values(openapi.paths ?? {})) {
      for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
        const operationId = pathItem?.[method]?.operationId;
        if (typeof operationId === 'string') operationIds.push(operationId);
      }
    }
    if (operationIds.length === 0 || new Set(operationIds).size !== operationIds.length) {
      errors.push('OpenAPI operationId 缺失或重复，无法稳定生成 SDK');
    }
  } catch (error) {
    errors.push(`static/openapi.json 无法解析：${error.message}`);
  }
}
const openApiYamlPath = path.join(staticRoot, 'openapi.yaml');
if (!existsSync(openApiYamlPath)) {
  errors.push('缺少 static/openapi.yaml；运行 npm run openapi:sync');
} else {
  try {
    const yaml = parseYaml(readFileSync(openApiYamlPath, 'utf8'));
    if (yaml.openapi !== '3.1.0')
      errors.push('static/openapi.yaml 必须是 OpenAPI 3.1.0');
  } catch (error) {
    errors.push(`static/openapi.yaml 无法解析：${error.message}`);
  }
}

for (const filename of [
  'message.schema.json',
  'status.schema.json',
  'change.schema.json',
  'probe.schema.json',
  'job-completed.schema.json',
  'job-failed.schema.json',
  'usage-updated.schema.json',
  'webhook-verification.schema.json',
]) {
  const schemaPath = path.join(staticRoot, 'schemas', 'webhooks', filename);
  if (!existsSync(schemaPath)) {
    errors.push(`缺少 Webhook Schema：${filename}`);
    continue;
  }
  try {
    const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
    if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') {
      errors.push(`Webhook Schema 不是 JSON Schema 2020-12：${filename}`);
    }
  } catch (error) {
    errors.push(`Webhook Schema 无法解析 ${filename}：${error.message}`);
  }
}

for (const filename of ['llms.txt', 'llms-full.txt']) {
  if (!existsSync(path.join(staticRoot, filename)))
    errors.push(`缺少 Agent 文件：${filename}`);
}

try {
  const changelog = JSON.parse(
    readFileSync(path.join(staticRoot, 'changelog.json'), 'utf8'),
  );
  if (!Array.isArray(changelog.entries) || changelog.entries.length === 0) {
    errors.push('static/changelog.json 没有变更条目');
  }
} catch (error) {
  errors.push(`static/changelog.json 无法解析：${error.message}`);
}

// 3 & 4. 逐页检查 frontmatter 与残留语法
for (const file of files) {
  const rel = path.relative(root, file);
  const text = readFileSync(file, 'utf8');

  const fm = /^---\n([\s\S]*?)\n---/.exec(text);
  if (!fm) {
    errors.push(`缺少 frontmatter：${rel}`);
  } else {
    if (!/^title:/m.test(fm[1])) errors.push(`frontmatter 缺 title：${rel}`);
    if (!/^description:/m.test(fm[1]))
      errors.push(`frontmatter 缺 description：${rel}`);
  }

  if (/\{%\s*(hint|endhint|content-ref|embed)/.test(text)) {
    errors.push(`残留 GitBook liquid 语法：${rel}`);
  }
  if (/^>\s*(📘|🚧|💡|❗)/m.test(text)) {
    errors.push(`残留 GitBook 引用块提示（应转成 admonition）：${rel}`);
  }

  // 代码块围栏的第一个词必须是 Prism 认得的语言，否则高亮会静默失效。
  // 想给代码块加标题请用 ```json title="..."，不要把标题直接写成语言名。
  for (const [, info] of text.matchAll(/^```([^\n`]+)$/gm)) {
    const lang = info.trim().split(/\s+/)[0].toLowerCase();
    if (!KNOWN_LANGUAGES.has(lang)) {
      errors.push(
        `代码块语言 \`${lang}\` 不被支持（用 lang title="..." 写标题）：${rel}`,
      );
    }
  }
}

if (errors.length > 0) {
  process.stderr.write(`文档校验未通过，共 ${errors.length} 个问题：\n`);
  for (const error of errors) process.stderr.write(`  - ${error}\n`);
  process.exit(1);
}

process.stdout.write(
  `文档校验通过：${files.length} 个页面，侧边栏条目 ${ids.length} 个\n`,
);
