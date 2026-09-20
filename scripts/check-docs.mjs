#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const docsRoot = path.join(root, 'docs');
const expectedEndpointCount = 113;
const errors = [];

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

function orderEntries(relativePath) {
  return read(relativePath)
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*-\s+(.+?)\s*$/)?.[1])
    .filter(Boolean);
}

function markdownFiles(directory) {
  return readdirSync(directory)
    .filter((name) => name.endsWith('.md'))
    .sort();
}

const rootOrder = orderEntries('docs/_order.yaml');
const actualCategories = readdirSync(docsRoot)
  .filter((name) => statSync(path.join(docsRoot, name)).isDirectory())
  .sort();

for (const category of rootOrder) {
  if (!actualCategories.includes(category)) errors.push(`docs/_order.yaml points to missing category: ${category}`);
}
for (const category of actualCategories) {
  if (!rootOrder.includes(category)) errors.push(`Category is missing from docs/_order.yaml: ${category}`);
}

const docs = [];
for (const category of actualCategories) {
  const directory = path.join(docsRoot, category);
  const orderPath = `docs/${category}/_order.yaml`;
  const order = orderEntries(orderPath);
  const files = markdownFiles(directory);
  const slugs = files.map((name) => name.slice(0, -3));

  for (const slug of order) {
    if (!slugs.includes(slug)) errors.push(`${orderPath} points to missing page: ${slug}`);
  }
  for (const slug of slugs) {
    if (!order.includes(slug)) errors.push(`${category}/${slug}.md is missing from ${orderPath}`);
  }

  for (const filename of files) {
    const relativePath = `docs/${category}/${filename}`;
    const source = read(relativePath);
    const frontMatter = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(source);
    if (!frontMatter) {
      errors.push(`${relativePath} is missing YAML front matter`);
      continue;
    }
    if (!/^title:\s*.+$/m.test(frontMatter[1])) errors.push(`${relativePath} is missing title`);
    if (!/^excerpt:\s*.+$/m.test(frontMatter[1])) errors.push(`${relativePath} is missing excerpt`);
    docs.push({ category, filename, relativePath, source, body: frontMatter[2] });
  }
}

const guides = docs.filter(({ category }) => category === '指南');
const endpoints = docs.filter(({ category }) => category !== '指南');
if (guides.length !== 9) errors.push(`Expected 9 guide pages, found ${guides.length}`);
if (endpoints.length !== expectedEndpointCount) {
  errors.push(`Expected ${expectedEndpointCount} endpoint pages, found ${endpoints.length}`);
}

const routeKeys = new Map();
const contentHashes = new Map();
for (const page of endpoints) {
  const route = page.body.match(/^`(GET|POST|PUT|PATCH|DELETE)\s+([^`]+)`/m);
  if (!route) {
    errors.push(`${page.relativePath} does not declare its METHOD /path`);
  } else {
    const key = `${route[1]} ${route[2]}`;
    const previous = routeKeys.get(key);
    if (previous) errors.push(`Duplicate endpoint ${key}: ${previous}, ${page.relativePath}`);
    routeKeys.set(key, page.relativePath);
  }
  if (!page.body.includes('## 请求')) errors.push(`${page.relativePath} is missing the request section`);
  if (!page.body.includes('## 响应')) errors.push(`${page.relativePath} is missing the response section`);
  if (!page.body.includes('鉴权')) errors.push(`${page.relativePath} is missing authentication guidance`);
  if (/title:\s*["']?快速开始/.test(page.source)) {
    errors.push(`${page.relativePath} still contains the broken website-import title`);
  }

  const hash = createHash('sha256').update(page.source).digest('hex');
  const duplicate = contentHashes.get(hash);
  if (duplicate) errors.push(`Duplicate endpoint page content: ${duplicate}, ${page.relativePath}`);
  contentHashes.set(hash, page.relativePath);
}

const allPublicDocs = docs.map(({ source }) => source).join('\n');
const forbidden = [
  [/sk_(?:platform|bu|bm)_/i, 'internal API Key prefix'],
  [/apiKeyLevel/i, 'internal API Key level field'],
  [/(?:平台|BU|BM)\s*级(?:别)?\s*(?:Token|令牌|Key)/i, 'internal credential level'],
  [/(?:平台|BU|BM)\s*(?:Token|令牌)/i, 'internal credential name'],
  [/(?:本|同一)\s*BU\b/i, 'internal BU wording'],
  [/rdme_[a-z0-9]{20,}/i, 'ReadMe API key'],
];
for (const [pattern, label] of forbidden) {
  if (pattern.test(allPublicDocs)) errors.push(`Public docs contain ${label}: ${pattern}`);
}

const internalRoutes = [
  '/v1/api-keys',
  '/v1/tenants',
  '/v1/portal-users',
  '/v1/platform/',
  '/portal/',
];
for (const route of internalRoutes) {
  if (routeKeys.has(`GET ${route}`) || allPublicDocs.includes(`\`${route}`)) {
    errors.push(`Public docs expose internal route: ${route}`);
  }
}

const slugs = new Set(docs.map(({ filename }) => filename.slice(0, -3)));
for (const page of docs) {
  for (const match of page.source.matchAll(/\]\(\/docs\/([a-z0-9-]+)(?:[)#?]|\))/g)) {
    if (!slugs.has(match[1])) errors.push(`${page.relativePath} links to missing page: ${match[1]}`);
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Docs contract passed: ${guides.length} guides, ${endpoints.length} endpoint pages.`);
