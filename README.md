# BlueMedia API 文档

这是 BlueMedia 对外 API 文档的唯一内容源，通过 GitBook Git Sync 从 `v1.0` 分支发布。

- `docs/README.md`：文档首页。
- `docs/SUMMARY.md`：GitBook 左侧导航结构。
- `docs/guides/*.md`：接入、鉴权、消息、账务和 Webhook 等开发指南。
- `docs/<业务域>/*.md`：每个 HTTP 接口一份独立 Markdown；接口文案不写在应用代码中。
- `gitbook-docs.yaml`：GitBook Site Git Sync 配置。

## 本地校验

使用 Node.js 24：

```sh
npm run docs:check
```

校验会确认：113 个接口和 9 篇指南均被导航收录、Markdown 链接有效、接口不重复，并阻止内部接口、内部凭证层级说法或密钥进入公开文档。

## 维护约定

- 对客户只使用“API Key”“当前授权范围”和“Business Portfolio”。
- 不解释平台、BU、BM 的内部 Token 层级，也不展示内部 Key 前缀。
- 稳定协议字段和错误码（例如 `tenantId`、`BM_BUDGET_EXCEEDED`）不得擅自改名。
- 新增、修改或删除接口时，同步更新对应 Markdown 和 `docs/SUMMARY.md`。
- 内容合并到 `v1.0` 后由 GitBook 自动同步，不要直接在线编辑接口正文。
