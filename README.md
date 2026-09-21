# BSP 开发者文档系统

BlueMedia 对外 API 文档站，基于 [Docusaurus](https://docusaurus.io/) 构建。

## 本地运行

需要 Node.js ≥ 20（本仓在 24 上开发）：

```sh
npm install
npm start          # 开发服务器，默认 http://localhost:3000
npm run build      # 生产构建，输出到 build/
npm run serve      # 本地预览生产构建
npm run docs:check # 结构校验（CI 会先跑它）
```

## 目录结构

| 路径 | 作用 |
| --- | --- |
| `docs/index.mdx` | 文档首页 |
| `docs/guides/*.md` | 接入、鉴权、消息、账务、Webhook 等开发指南 |
| `docs/<业务域>/*.md` | 每个 HTTP 接口一份独立 Markdown |
| `sidebars.mjs` | 左侧导航结构（三级：业务域 → 资源组 → 接口） |
| `docusaurus.config.js` | 站点配置 |
| `src/pages/index.js` | 落地页 |
| `src/components/CardGrid` | 文档内的卡片导航组件 |
| `scripts/check-docs.mjs` | 结构校验 |
| `scripts/convert-gitbook.mjs` | 一次性迁移脚本（GitBook → Docusaurus），保留备查 |

## 写作约定

### Markdown 格式

`markdown.format` 设为 `detect`：

- **`.md` 按 CommonMark 解析。**接口文档里大量出现 `/v1/messages/{id}` 这类路径参数，CommonMark 下花括号是普通字符，不会被当成 JSX 表达式。接口页一律用 `.md`。
- **`.mdx` 按 MDX 解析**，可以写 JSX。需要用 `<CardGrid />` 这类组件的页面才用 `.mdx`。

### 提示框

用 Docusaurus admonition，不要用 GitBook 的 `{% hint %}` 或 `> 📘` 引用块（`docs:check` 会拦下）：

```md
:::note[鉴权]
请求头携带 `Authorization: Bearer <API_KEY>`。
:::
```

可用类型：`note` / `tip` / `info` / `warning` / `danger`。

### Frontmatter

每个页面都必须有 `title` 和 `description`，后者决定搜索结果和分享卡片里的摘要。

### 新增接口页

1. 在对应业务域目录下新建 `.md`。
2. 在 `sidebars.mjs` 里把它挂到所属资源组下。
3. 跑 `npm run docs:check` 确认收录无误。

## 内容约定

- 对客户只使用「API Key」「当前授权范围」和「Business Portfolio」。
- 不解释平台、BU、BM 的内部 Token 层级，也不展示内部 Key 前缀。
- 稳定协议字段和错误码（例如 `tenantId`、`BM_BUDGET_EXCEEDED`）不得擅自改名。

## CI

`.gitlab-ci.yml` 在 MR 和默认分支上跑 `docs:check` + `build`，构建产物作为 artifact 保留一周。
`build` 阶段开了 `onBrokenLinks: 'throw'`，任何死链都会让流水线失败。
