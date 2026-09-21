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
**2026-09-21 已完成登记**，实测返回 `is_docker: 1`。

登记项：**服务名** `BSPDocSystem`（与 `.gitlab-ci.yml` 的 `ATLS_SVC_NAME` 逐字一致）、
**镜像/包名**小写 `bspdocsystem`（平台侧独立字段）、类型 **Docker**、容器端口 **8080**
（见 `nginx/docs.conf` 的 `listen`）。

### 服务名与镜像名大小写不一致 → 发布阶段 404

服务名是 `BSPDocSystem`、镜像/包名是 `bspdocsystem`，而平台生成的构建脚本在 Docker 分支
用**服务名**拼发布包目录，部署 agent 又按**镜像名**去 OSS 取：

```
开始从oss安装包:bspdocsystem-1.0.1
下载svc pkg失败，err:oss: StatusCode=404, ErrorCode=NoSuchKey
package安装失败
```

**这时候镜像已经推进 Harbor 了，CI 是绿的**，只有平台发布页红 —— 从流水线日志里看不出原因。

`scripts/atlantis-build-wrapper.sh` 在「拉取平台脚本」和「执行」之间插一行 sed 修正它，
由 `ATLS_USE_LOCAL_BUILD_SH` 启用。ApiWorker 用的是同一个补丁。补丁打不上会立即失败并
打印实际内容，不会静默跑一个错的构建。

### nginx：全仓只有一份配置

`nginx/docs.conf` 被 `Dockerfile` COPY 进镜像（`/etc/nginx/conf.d/default.conf`），
容器监听 8080，直接托管静态产物。站点的全部路由规则（缓存、真 404、探针、gzip）
都在这一份里，跟着镜像走。

请求链路：

```
云 LB(TLS 终止, *.bsptest.com)
  → 宿主机 8080   ApiWorker 仓的边缘实例（唯一对外端口，按 server_name 分流）
    → 127.0.0.1:11820   平台把宿主机端口映射到容器 8080
      → 容器内 nginx  nginx/docs.conf
```

本仓曾经还有一份 `nginx/host-docs.conf`（宿主机上另起一套只绑 `127.0.0.1:8083` 的
nginx 实例做中间跳），已删除：那一跳实际只做「把请求原样转给容器」，而路由规则拆在
两处的代价是改一条路由要同时动镜像和宿主机，且两处会不同步。

### 边缘侧要加的 server 块（在 ApiWorker 仓提 MR）

域名归属归边缘管——这是边缘 conf 自己文档写明的职责（「域名归属由本文件决定」）。
在 `senpeng.zheng/ApiWorker` 的 `nginx/apiworker.conf` 里加：

```nginx
# 与其他 upstream 并列，加在 http{} 里
upstream docs_site {
    server 127.0.0.1:11820;   # 平台映射到 BSPDocSystem 容器的 8080
    keepalive 32;
}

# 整个域名交给文档站容器；路由细节在 BSPDocSystem 仓的 nginx/docs.conf 里，
# 文档站改路由不需要动这个仓库。
server {
    listen 0.0.0.0:8080;
    server_name docs.bsptest.com;

    location / {
        proxy_pass http://docs_site;
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_redirect off;     # 容器已开 absolute_redirect off，跳转是相对地址
    }
}
```

边缘的 `http{}` 层已统一设好 `Host` / `X-Real-IP` / `X-Forwarded-For` /
`X-Forwarded-Proto`，容器能拿到真实客户端信息，不需要在这个 server 块里重复。

**上线后立刻查一次重复头**：

```sh
curl -sI https://docs.bsptest.com/ | grep -ci x-frame-options   # 期望 1
```

边缘 `http{}` 已经下发 `X-Frame-Options` 和 `X-Content-Type-Options`，而容器那份
`docs.conf` 为了镜像能独立跑也带了同名头 —— 两层都发，响应里会出现两份。结果是 2
就二选一：删容器那两条（与 center-console / bluechip 两个兄弟仓的做法一致），
或者在边缘对这个域名单独处理。`Referrer-Policy` 边缘没有，只有容器发，不受影响。

### 被砍掉的两条路由

原 `host-docs.conf` 里还有两组 location，合并时一并删除，因为本仓根本不提供它们：

- `/openapi.json` → 转发给 API（`127.0.0.1:3200`）。这条**搬不进容器**——容器里的
  `127.0.0.1` 是它自己的 loopback，不是宿主机。而且本仓没有任何页面引用它。
  真要恢复，应该加在边缘那一侧。
- `/llms.txt` / `/llms-full.txt`（原本就是注释掉的）。构建产物根下没有这两个文件，
  开着只会把请求转给容器换回一份 404 页面，对 agent 比直接 404 更糟。

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
