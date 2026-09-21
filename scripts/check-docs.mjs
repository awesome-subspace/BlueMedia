#!/usr/bin/env node
/**
 * 文档结构校验，在 CI 里先于 build 跑，用来给出比 webpack 报错更易读的诊断。
 *
 * 检查四件事：
 *   1. sidebars.js 里的每个 doc id 都能找到对应文件
 *   2. docs/ 下的每个页面都被侧边栏收录，且只收录一次
 *   3. 每个页面都有 title 和 description（决定 SEO 与搜索结果里的摘要）
 *   4. 没有残留的 GitBook 专有语法
 */

import {readFileSync, readdirSync, statSync, existsSync} from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const docsRoot = path.join(root, 'docs');
const errors = [];

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

// 3 & 4. 逐页检查 frontmatter 与残留语法
for (const file of files) {
  const rel = path.relative(root, file);
  const text = readFileSync(file, 'utf8');

  const fm = /^---\n([\s\S]*?)\n---/.exec(text);
  if (!fm) {
    errors.push(`缺少 frontmatter：${rel}`);
  } else {
    if (!/^title:/m.test(fm[1])) errors.push(`frontmatter 缺 title：${rel}`);
    if (!/^description:/m.test(fm[1])) errors.push(`frontmatter 缺 description：${rel}`);
  }

  if (/\{%\s*(hint|endhint|content-ref|embed)/.test(text)) {
    errors.push(`残留 GitBook liquid 语法：${rel}`);
  }
  if (/^>\s*(📘|🚧|💡|❗)/m.test(text)) {
    errors.push(`残留 GitBook 引用块提示（应转成 admonition）：${rel}`);
  }
}

if (errors.length > 0) {
  process.stderr.write(`文档校验未通过，共 ${errors.length} 个问题：\n`);
  for (const error of errors) process.stderr.write(`  - ${error}\n`);
  process.exit(1);
}

process.stdout.write(`文档校验通过：${files.length} 个页面，侧边栏条目 ${ids.length} 个\n`);
