# BSPDocSystem 生产镜像（Atlantis 构建 → 内网 Harbor → Atlantis 平台部署）
#
# 两阶段：node 构建静态站 → nginx 托管。运行期不需要 node。
#
# ── 两条踩过的约束，改之前先看 ────────────────────────────────────────────────
#
# 1) 基础镜像**必须写全域名**，不能用裸的 `node:24-bookworm-slim` / `nginx:alpine`。
#    公司 runner 的 docker daemon 配了 registry mirror，而那个 mirror 对 Docker Hub
#    **官方**镜像一律返回 403：
#      ERROR: unexpected status from HEAD request to
#        https://<mirror>/v2/library/node/manifests/24-bookworm-slim?ns=docker.io
#        403 Forbidden
#    裸名字会被 daemon 重写到那个 mirror，于是解析直接失败；写全域名就绕开了重写。
#    这个坑只在**本地没缓存该镜像的 runner** 上暴露——池子里有几台早年缓存过，所以
#    表现为"换台机器就构建失败"，很容易误判成偶发。
#
# 2) runner 的 BuildKit 太老，**不认 `RUN --mount=type=cache`**（报 "Unknown flag: mount"），
#    也不能用 `# syntax=docker/dockerfile:1` 升级 frontend——同样是连不上 Docker Hub。
#    所以这里没有 npm 缓存挂载，改用国内源 + 加大超时/重试来保证依赖安装稳定。

ARG NODE_IMAGE=m.daocloud.io/docker.io/library/node:24-bookworm-slim
ARG NGINX_IMAGE=m.daocloud.io/docker.io/library/nginx:1.27-alpine

# ---------------------------------------------------------------------------
# builder：装依赖 → 结构校验 → 构建静态产物
# ---------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS builder
WORKDIR /app

# 站点的对外地址在构建期就要定下来（Docusaurus 把 url/baseUrl 编译进产物里，
# 运行期改环境变量没用）。默认值见 docusaurus.config.js。
ARG DOCS_URL
ARG DOCS_BASE_URL
ENV DOCS_URL=${DOCS_URL}
ENV DOCS_BASE_URL=${DOCS_BASE_URL}

# 国内源 + 放宽超时。runner 在国内办公室，直连 registry.npmjs.org 经常在
# 大包（@swc/core、mermaid）上超时，表现为随机的 ECONNRESET 而不是稳定失败。
RUN npm config set registry https://registry.npmmirror.com \
 && npm config set fetch-timeout 600000 \
 && npm config set fetch-retries 5

# 先只拷 manifest，让依赖层在文档内容变动时仍能命中缓存
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# 校验放在构建前：docs:check 的报错比 webpack 的可读得多（缺 frontmatter、
# 页面没被侧边栏收录、残留 GitBook 语法、代码块语言写错）。
# build 开着 onBrokenLinks: 'throw'，任何死链都会让这一层失败 —— 这就是本项目的 CI 门禁。
RUN npm run docs:check \
 && npm run build

# ---------------------------------------------------------------------------
# runtime：nginx 托管静态产物
# ---------------------------------------------------------------------------
FROM ${NGINX_IMAGE} AS runtime

# 站点自己的 server 块。监听 8080 而不是 80，容器内不需要特权端口。
COPY nginx/docs.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html

# 与 nginx/docs.conf 里的 listen 保持一致。平台侧的端口映射要填这个值。
EXPOSE 8080

# 健康检查用站点根即可（纯静态，没有依赖项要探）。
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
