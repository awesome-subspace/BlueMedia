# BlueMedia API 文档

这是 BlueMedia 对外 API 文档的唯一内容源，并与 ReadMe 项目的 `1.0` 版本同步。

- `docs/指南/*.md`：接入、鉴权、消息、账务和 Webhook 等指南。
- `docs/<业务域>/*.md`：每个 HTTP 接口一份独立 Markdown；页面内容直接由 ReadMe 渲染，不在应用代码中维护文案。
- `_order.yaml`：控制分类和页面顺序。

## 使用 ReadMe MCP

MCP 地址：

```text
https://bsptest-d7d25630.readme.io/mcp
```

在 MCP 客户端中通过环境变量传入 ReadMe API Key，不要把 Key 写进仓库：

```json
{
  "mcpServers": {
    "bluemedia-readme": {
      "url": "https://bsptest-d7d25630.readme.io/mcp",
      "headers": {
        "Authorization": "Bearer ${env:README_API_KEY}"
      }
    }
  }
}
```

推荐流程：先通过 MCP 搜索并读取线上页面，再修改对应 Markdown、提交 Pull Request；合并到 `v1.0` 后由 ReadMe Git Sync 发布。这样线上内容与 GitHub 始终一致，MCP/API 的临时写入不会覆盖仓库真源。

## 本地校验

使用 Node.js 24：

```sh
npm run docs:check
npm run docs:lint
```

`docs:check` 会检查接口与页面一一对应、目录顺序、内部接口泄漏、内部 Token 层级说法以及误提交的 ReadMe API Key；`docs:lint` 使用 ReadMe CLI 校验页面格式。

## 文案约定

- 对客户只使用“API Key”“当前授权范围”和“Business Portfolio”。
- 不解释平台、BU、BM 的内部 Token 层级，也不展示内部 Key 前缀。
- 稳定协议字段和错误码（例如 `tenantId`、`BM_BUDGET_EXCEEDED`）不得擅自改名。
- 新增、修改或删除接口时，同步调整对应 Markdown 和 `_order.yaml`。
