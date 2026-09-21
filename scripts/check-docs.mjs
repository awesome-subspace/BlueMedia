#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const docsRoot = path.join(root, 'docs');
const expectedEndpointCount = 113;
const expectedGuideCount = 9;
const expectedSectionCount = 11;
const errors = [];

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

function markdownFiles(directory) {
  return readdirSync(directory)
    .filter((name) => name.endsWith('.md'))
    .sort();
}

const categories = readdirSync(docsRoot)
  .filter((name) => statSync(path.join(docsRoot, name)).isDirectory())
  .sort();

const docs = [];
for (const category of categories) {
  const directory = path.join(docsRoot, category);
  for (const filename of markdownFiles(directory)) {
    if (filename === 'README.md' || filename === 'SUMMARY.md') {
      errors.push(`${category}/${filename} is unexpected; only docs/README.md and docs/SUMMARY.md define the GitBook space`);
      continue;
    }

    const relativePath = `docs/${category}/${filename}`;
    const source = read(relativePath);
    const frontMatter = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(source);
    if (!frontMatter) {
      errors.push(`${relativePath} is missing YAML front matter`);
      continue;
    }
    if (!/^title:\s*.+$/m.test(frontMatter[1])) errors.push(`${relativePath} is missing title`);
    if (!/^excerpt:\s*.+$/m.test(frontMatter[1])) errors.push(`${relativePath} is missing excerpt`);
    docs.push({
      category,
      filename,
      relativePath,
      docsRelativePath: `${category}/${filename}`,
      source,
      body: frontMatter[2],
    });
  }
}

const guides = docs.filter(({ category }) => category === 'guides');
const endpoints = docs.filter(({ category }) => category !== 'guides');
if (guides.length !== expectedGuideCount) errors.push(`Expected ${expectedGuideCount} guide pages, found ${guides.length}`);
if (endpoints.length !== expectedEndpointCount) {
  errors.push(`Expected ${expectedEndpointCount} endpoint pages, found ${endpoints.length}`);
}

const summary = read('docs/SUMMARY.md');
const sectionCount = [...summary.matchAll(/^##\s+.+$/gm)].length;
if (sectionCount !== expectedSectionCount) {
  errors.push(`Expected ${expectedSectionCount} navigation sections, found ${sectionCount}`);
}

const summaryTargets = [...summary.matchAll(/^\s*\*\s+\[[^\]]+\]\(([^)]+\.md(?:#[^)]+)?)\)/gm)]
  .map((match) => decodeURIComponent(match[1].split('#')[0]));
const summaryCounts = new Map();
for (const target of summaryTargets) {
  summaryCounts.set(target, (summaryCounts.get(target) ?? 0) + 1);
  if (!existsSync(path.join(docsRoot, target))) errors.push(`docs/SUMMARY.md points to missing page: ${target}`);
}

const expectedSummaryTargets = ['README.md', ...docs.map(({ docsRelativePath }) => docsRelativePath)];
for (const target of expectedSummaryTargets) {
  const count = summaryCounts.get(target) ?? 0;
  if (count === 0) errors.push(`${target} is missing from docs/SUMMARY.md`);
  if (count > 1) errors.push(`${target} appears ${count} times in docs/SUMMARY.md`);
}
for (const target of summaryCounts.keys()) {
  if (!expectedSummaryTargets.includes(target)) errors.push(`docs/SUMMARY.md contains an unexpected page: ${target}`);
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

const publicPages = [
  { relativePath: 'docs/README.md', source: read('docs/README.md') },
  ...docs,
];
const allPublicDocs = publicPages.map(({ source }) => source).join('\n');
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

const internalRoutes = ['/v1/api-keys', '/v1/tenants', '/v1/portal-users', '/v1/platform/', '/portal/'];
for (const route of internalRoutes) {
  if (routeKeys.has(`GET ${route}`) || allPublicDocs.includes(`\`${route}`)) {
    errors.push(`Public docs expose internal route: ${route}`);
  }
}

for (const page of publicPages) {
  if (/\]\(\/docs\//.test(page.source)) {
    errors.push(`${page.relativePath} contains a legacy /docs/ link`);
  }

  const targets = [
    ...page.source.matchAll(/\]\(([^)]+)\)/g),
    ...page.source.matchAll(/href=["']([^"']+)["']/g),
  ].map((match) => match[1]);

  for (const rawTarget of targets) {
    if (/^(?:https?:|mailto:|#)/i.test(rawTarget)) continue;
    const target = rawTarget.split('#')[0].split('?')[0];
    if (!target.endsWith('.md')) continue;
    const absoluteTarget = path.resolve(root, path.dirname(page.relativePath), target);
    if (!absoluteTarget.startsWith(`${docsRoot}${path.sep}`) || !existsSync(absoluteTarget)) {
      errors.push(`${page.relativePath} links to missing page: ${rawTarget}`);
    }
  }
}

const gitbookConfig = read('gitbook-docs.yaml');
const spaceCount = [...gitbookConfig.matchAll(/^\s*-\s+type:\s+space\s*$/gm)].length;
if (spaceCount !== 1) errors.push(`gitbook-docs.yaml must define exactly one space, found ${spaceCount}`);
if (/^\s*-\s+type:\s+section\s*$/m.test(gitbookConfig)) {
  errors.push('gitbook-docs.yaml must not hide business domains behind site sections');
}
if (!/^\s*directory:\s+\.\/docs\s*$/m.test(gitbookConfig)) {
  errors.push('gitbook-docs.yaml must map the GitBook space to ./docs');
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(
  `Docs contract passed: 1 space, ${sectionCount} sections, ${guides.length} guides, ${endpoints.length} endpoint pages.`,
);
