#!/usr/bin/env node
/**
 * 把 GitBook 格式的文档源转换成 Docusaurus 可用的形式。
 *
 * 就地改写 docs/ 下的 Markdown，并根据 SUMMARY.md 生成 sidebars.mjs。
 * 不是幂等的——重跑前先 `git checkout docs/ SUMMARY.md` 还原。
 */

import { readFileSync, writeFileSync, readdirSync, statSync, rmSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const docsRoot = path.join(root, 'docs');

/** GitBook 的提示 emoji 对应到 Docusaurus 的 admonition 类型 */
const EMOJI_TO_ADMONITION = {
  '📘': 'note',
  '💡': 'tip',
  '🚧': 'warning',
  '❗': 'danger',
  '⚠️': 'danger',
};

const stats = {
  files: 0,
  liquidHints: 0,
  blockquoteHints: 0,
};

function listMarkdown(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) out.push(...listMarkdown(full));
    else if (name.endsWith('.md')) out.push(full);
  }
  return out;
}

function splitFrontmatter(text) {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) return { data: {}, body: text };
  const data = {};
  for (const line of match[1].split('\n')) {
    const kv = /^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let value = kv[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[kv[1]] = value;
  }
  return { data, body: text.slice(match[0].length) };
}

/** {% hint style="warning" %} ... {% endhint %}  ->  :::warning ... ::: */
function convertLiquidHints(body) {
  return body.replace(
    /\{%\s*hint style="([a-z]+)"\s*%\}\n([\s\S]*?)\n\{%\s*endhint\s*%\}/g,
    (_, style, inner) => {
      stats.liquidHints += 1;
      const type = style === 'success' ? 'tip' : style;
      return `:::${type}\n\n${inner.trim()}\n\n:::`;
    },
  );
}

/**
 * > 📘 鉴权
 * >
 * > 请求头携带 ...
 *
 * ->
 *
 * :::note[鉴权]
 * 请求头携带 ...
 * :::
 */
function convertBlockquoteHints(body) {
  const lines = body.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i += 1) {
    const head = /^>\s*(📘|💡|🚧|❗|⚠️)\s*(.*)$/.exec(lines[i]);
    if (!head) {
      out.push(lines[i]);
      continue;
    }
    const type = EMOJI_TO_ADMONITION[head[1]];
    const title = head[2].trim();

    // 吃掉整段引用块
    const inner = [];
    let j = i + 1;
    for (; j < lines.length && lines[j].startsWith('>'); j += 1) {
      inner.push(lines[j].replace(/^>\s?/, ''));
    }
    // 首行若本身就是正文（如 "> 📘 这里不需要 API Key"），保留为内容
    const body0 = title && !/^[一-龥A-Za-z0-9 ]{1,12}$/.test(title) ? title : '';
    const content = [body0, ...inner].join('\n').trim();
    const label = body0 ? '' : title;

    stats.blockquoteHints += 1;
    out.push(`:::${type}${label ? `[${label}]` : ''}`);
    out.push('');
    out.push(content);
    out.push('');
    out.push(':::');
    i = j - 1;
  }
  return out.join('\n');
}

function convertFile(file) {
  const raw = readFileSync(file, 'utf8');
  const { data, body } = splitFrontmatter(raw);

  let converted = convertLiquidHints(body);
  converted = convertBlockquoteHints(converted);
  converted = converted.replace(/\n{3,}/g, '\n\n').trimStart();

  const fm = ['---'];
  if (data.title) fm.push(`title: ${JSON.stringify(data.title)}`);
  if (data.excerpt) fm.push(`description: ${JSON.stringify(data.excerpt)}`);
  if (path.relative(docsRoot, file) === 'index.md') {
    fm.push('slug: /');
  }
  fm.push('---', '');

  writeFileSync(file, `${fm.join('\n')}\n${converted}`, 'utf8');
  stats.files += 1;
}

/* ------------------------------------------------------------------ */
/* SUMMARY.md -> sidebars.js                                           */
/* ------------------------------------------------------------------ */

function docId(href) {
  const id = href.replace(/\.md$/, '');
  return id === 'README' ? 'index' : id;
}

function parseSummary() {
  const text = readFileSync(path.join(docsRoot, 'SUMMARY.md'), 'utf8');
  const tree = [];
  let category = null;
  let lastTop = null;

  for (const line of text.split('\n')) {
    const group = /^##\s+(.*)$/.exec(line);
    if (group) {
      category = { type: 'category', label: group[1].trim(), items: [] };
      tree.push(category);
      lastTop = null;
      continue;
    }

    const item = /^(\s*)\*\s+\[([^\]]+)\]\(([^)]+)\)\s*$/.exec(line);
    if (!item) continue;

    const depth = item[1].length / 2;
    const node = { type: 'doc', id: docId(item[3]), label: item[2] };

    if (depth === 0) {
      if (category) {
        category.items.push(node);
        lastTop = node;
      } else {
        tree.push(node); // ## 之前的条目（概览）
      }
    } else if (lastTop) {
      // 有子项的条目升级成带 link 的 category
      if (lastTop.type === 'doc') {
        const promoted = {
          type: 'category',
          label: lastTop.label,
          link: { type: 'doc', id: lastTop.id },
          items: [],
        };
        category.items[category.items.length - 1] = promoted;
        lastTop = promoted;
      }
      lastTop.items.push(node);
    }
  }
  return tree;
}

function renderSidebar(tree) {
  const body = JSON.stringify({ docsSidebar: tree }, null, 2)
    .replace(/"([A-Za-z_][A-Za-z0-9_]*)":/g, '$1:')
    .replace(/"/g, "'");
  return `// 由 scripts/convert-gitbook.mjs 从 docs/SUMMARY.md 生成，可直接手工维护。
// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = ${body};

export default sidebars;
`;
}

/* ------------------------------------------------------------------ */

function main() {
  // README.md -> index.md（Docusaurus 的文档首页）
  const readme = path.join(docsRoot, 'README.md');
  const index = path.join(docsRoot, 'index.md');
  try {
    const text = readFileSync(readme, 'utf8');
    writeFileSync(index, text, 'utf8');
    rmSync(readme);
  } catch {
    /* 已经转换过 */
  }

  const sidebar = parseSummary();
  writeFileSync(path.join(root, 'sidebars.mjs'), renderSidebar(sidebar), 'utf8');
  rmSync(path.join(docsRoot, 'SUMMARY.md'));

  for (const file of listMarkdown(docsRoot)) convertFile(file);

  const count = (nodes) =>
    nodes.reduce((n, x) => n + (x.type === 'doc' ? 1 : (x.link ? 1 : 0) + count(x.items)), 0);

  process.stdout.write(
    [
      `转换文件      ${stats.files}`,
      `liquid hint   ${stats.liquidHints}`,
      `引用块 hint   ${stats.blockquoteHints}`,
      `侧边栏条目    ${count(sidebar)}`,
      '',
    ].join('\n'),
  );
}

main();
