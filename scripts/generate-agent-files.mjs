#!/usr/bin/env node

import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsRoot = path.join(root, "docs");
const staticRoot = path.join(root, "static");
const markdownRoot = path.join(staticRoot, "markdown");
const marker = path.join(root, ".generated-agent-files");
const publicBase = (process.env.DOCS_URL ?? "https://docs.bsptest.com").replace(
  /\/$/,
  "",
);

async function listDocs(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) return listDocs(full);
      return /\.mdx?$/.test(entry.name) ? [full] : [];
    }),
  );
  return nested.flat().sort();
}

function metadata(source, fallback) {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(source);
  const frontmatter = match?.[1] ?? "";
  const value = (key) => {
    const found = new RegExp(`^${key}:\\s*["']?(.+?)["']?$`, "m")
      .exec(frontmatter)?.[1]
      ?.trim();
    return found?.replace(/["']$/, "");
  };
  return {
    title: value("title") ?? fallback,
    description: value("description") ?? "",
    body: match ? source.slice(match[0].length) : source,
  };
}

function markdownSafe(body) {
  return body
    .replace(/^import\s+.+;\s*$/gm, "")
    .replace(
      /<CardGrid[\s\S]*?\/>/g,
      "> 此处为网页卡片导航；请使用本文件顶部的 canonical URL 继续浏览。",
    )
    .trim();
}

const files = await listDocs(docsRoot);
await rm(markdownRoot, { recursive: true, force: true });
await mkdir(markdownRoot, { recursive: true });

const records = [];
for (const file of files) {
  const relative = path.relative(docsRoot, file);
  const id = relative.replace(/\.mdx?$/, "");
  const source = await readFile(file, "utf8");
  const meta = metadata(source, id);
  const route = id === "index" ? "/docs/" : `/docs/${id}`;
  const markdownPath = `/markdown/${id}.md`;
  const rendered = [
    `# ${meta.title}`,
    "",
    `Canonical: ${publicBase}${route}`,
    `OpenAPI: ${publicBase}/openapi.yaml`,
    "",
    markdownSafe(meta.body),
    "",
  ].join("\n");
  const output = path.join(markdownRoot, `${id}.md`);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, rendered);
  records.push({ ...meta, id, route, markdownPath, rendered });
}

const sections = [
  [
    "Start here",
    [
      "guides/quickstart",
      "guides/authentication",
      "guides/messaging",
      "guides/webhook-integration",
      "guides/error-codes",
    ],
  ],
  [
    "API reference",
    [
      "messaging/messages",
      "templates-flows-media/templates",
      "assets-phone-numbers/phone-numbers",
      "onboarding/provider-onboarding",
      "webhooks/post-v1-webhook-endpoints",
    ],
  ],
  [
    "Reliability",
    ["reference/openapi", "reference/idempotency", "reference/rate-limits"],
  ],
  ["Changes", ["reference/changelog"]],
];
const byId = new Map(records.map((record) => [record.id, record]));
const llms = [
  "# BlueMedia BSP API",
  "",
  "> REST API for integrating WhatsApp Business Platform through BlueMedia.",
  "",
  "Base URL: https://api.bsptest.com",
  `OpenAPI YAML: ${publicBase}/openapi.yaml`,
  `OpenAPI JSON: ${publicBase}/openapi.json`,
  `Complete Markdown corpus: ${publicBase}/llms-full.txt`,
  "",
  ...sections.flatMap(([heading, ids]) => [
    `## ${heading}`,
    "",
    ...ids.flatMap((id) => {
      const record = byId.get(id);
      return record
        ? [
            `- [${record.title}](${publicBase}${record.markdownPath}): ${record.description}`,
          ]
        : [];
    }),
    "",
  ]),
  "## Webhook JSON Schemas",
  "",
  "- [message](https://docs.bsptest.com/schemas/webhooks/message.schema.json)",
  "- [status](https://docs.bsptest.com/schemas/webhooks/status.schema.json)",
  "- [change](https://docs.bsptest.com/schemas/webhooks/change.schema.json)",
  "- [probe](https://docs.bsptest.com/schemas/webhooks/probe.schema.json)",
  "- [job.completed](https://docs.bsptest.com/schemas/webhooks/job-completed.schema.json)",
  "- [job.failed](https://docs.bsptest.com/schemas/webhooks/job-failed.schema.json)",
  "- [usage.updated](https://docs.bsptest.com/schemas/webhooks/usage-updated.schema.json)",
  "- [webhook.verification](https://docs.bsptest.com/schemas/webhooks/webhook-verification.schema.json)",
  "",
].join("\n");

const full = records
  .map((record) =>
    [
      `<!-- source: ${publicBase}${record.route} -->`,
      `<!-- markdown: ${publicBase}${record.markdownPath} -->`,
      record.rendered,
    ].join("\n"),
  )
  .join("\n---\n\n");

await writeFile(path.join(staticRoot, "llms.txt"), llms);
await writeFile(path.join(staticRoot, "llms-full.txt"), `${full}\n`);
await writeFile(marker, `${records.length}\n`);
process.stdout.write(
  `Agent 文件已生成：${records.length} 个 Markdown 页面 + llms.txt + llms-full.txt\n`,
);
