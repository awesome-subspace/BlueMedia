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

## CI / 部署

走公司 **Atlantis** 那条路：GitLab CI → bfo runner 调 Atlantis API → 用本仓根 `Dockerfile`
构建镜像 → 推内网 Harbor → Atlantis 平台部署。

```
main     → prod        develop → pre
tags     → prod        其余分支 → test
```

### 校验为什么不在单独的 CI 作业里

公司 runner **连不上 Docker Hub**，`image: node:24` 这类 docker-executor 作业会卡在拉镜像。
所以把门禁放进 Dockerfile 的 builder 阶段：

```dockerfile
RUN npm run docs:check && npm run build
```

`docs:check` 管结构（frontmatter、侧边栏收录、GitBook 残留语法、代码块语言），`build` 开着
`onBrokenLinks: 'throw'` 管死链。任一失败 → 镜像构建失败 → 流水线红。只有一条构建路径，
不会出现「CI 绿了但镜像里是旧产物」。

### 平台侧要先登记（否则流水线必红）

Atlantis 上必须存在同名服务，否则流水线在**构建之前**就挂：

```
109012 control script: 请确保服务在 Atlantis 平台已添加
```

这句读起来像「服务没登记」，实际是「**这个名字**没登记」，报错里区分不出来。查某个名字在不在：

```sh
curl -s -H 'X-Atlantis-UUID: BSPDocSystem' -H 'skip: atlantis' \
  -H 'Content-type: application/json' -X POST \
  --data '{"svc_name":"BSPDocSystem","namespace":"","env":"prod","svc_branch":"main"}' \
  https://atlantis-api.bluemedia-inc.com/deploy/ci/config
```

已登记返回 `is_docker: 1`；没登记返回 `is_vm/is_docker/is_k8s` 全零（与随手编的名字完全一致）。

登记时要填的：**服务名** `BSPDocSystem`（与 `.gitlab-ci.yml` 的 `ATLS_SVC_NAME` 逐字一致）、
**镜像/包名**小写 `bspdocsystem`（平台侧独立字段）、类型 **Docker**、容器端口 **8080**
（见 `nginx/docs.conf` 的 `listen`）。

### 版本号

Atlantis 读 `version.sh` 的 `VERSION` 当镜像 tag，而 **Harbor 拒绝已存在的 tag** —— 同一个版本
推第二次，流水线直接失败。`scripts/git-hooks/pre-commit` 每次提交自动把补丁号 +1，克隆后启用一次：

```sh
git config core.hooksPath scripts/git-hooks
```

`git merge` 不触发 pre-commit，非快进合并进 `main` 后要手动抬一下版本号（改完用
`git commit --no-verify`，否则 hook 会在你选的数字上再 +1）。

### 站点地址是构建期固定的

Docusaurus 把 `url` / `baseUrl` 编译进产物，运行期改环境变量没有任何效果。构建参数：

```sh
docker build --build-arg DOCS_URL=https://docs.bsptest.com --build-arg DOCS_BASE_URL=/ .
```

不传则回落到 `http://localhost:3000`（见 `docusaurus.config.js`）。

### 「最后更新于」在镜像里是关掉的

它要读 git 提交时间，而 `node:24-bookworm-slim` 不带 git 二进制，强开会让构建失败
（`This Docusaurus site is outside any Git worktree.`）。配置按 git 可用性自动探测：本地开发显示，
镜像里静默关闭。想让线上也显示，在 builder 阶段装上 git 即可，不用改配置。
