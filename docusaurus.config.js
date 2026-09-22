// @ts-check
import {execFileSync} from 'node:child_process';
import {themes as prismThemes} from 'prism-react-renderer';

/**
 * 「最后更新于」需要读 git 提交时间，而构建镜像用的 node:24-bookworm-slim
 * **不带 git 二进制**——强行开启会让构建直接失败：
 *   Error: This Docusaurus site is outside any Git worktree.
 *
 * 装 git 要走 Debian 源，而公司 runner 能不能到那个源没有先例可依（ApiWorker 的
 * Dockerfile 全程没用过 apt），为一个锦上添花的功能引入没验证过的网络依赖不值得。
 * 所以这里按能力探测：本地开发有 git 就显示时间戳，镜像里没有就静默关掉。
 * 想让线上也显示，在 Dockerfile 的 builder 阶段装上 git 即可，无需改这里。
 */
const gitAvailable = (() => {
  try {
    execFileSync('git', ['rev-parse', '--is-inside-work-tree'], {stdio: 'ignore'});
    return true;
  } catch {
    return false;
  }
})();

const GITLAB_URL = 'http://git.domob-inc.cn/wenqiao.kang/BSPDocSystem';

// 站点对外地址在**构建期**定下来（Docusaurus 会把 url/baseUrl 编译进产物，
// 运行期改环境变量没有任何效果）。Dockerfile 以构建参数传入，本地开发用默认值。
const SITE_URL = process.env.DOCS_URL || 'http://localhost:3000';
const SITE_BASE_URL = process.env.DOCS_BASE_URL || '/';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'BSP 开发者文档',
  tagline: '接入 WhatsApp Business Platform 所需的全部接口与指南',
  favicon: 'img/favicon.png',

  url: SITE_URL,
  baseUrl: SITE_BASE_URL,
  organizationName: 'wenqiao.kang',
  projectName: 'BSPDocSystem',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',

  future: {
    v4: true,
    faster: true,
  },

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  // 接口文档里大量出现 `/v1/messages/{id}` 这类路径参数。
  // detect 让 .md 按 CommonMark 解析，花括号不会被当成 JSX 表达式；
  // 需要写 JSX 的页面用 .mdx 后缀即可。
  markdown: {
    format: 'detect',
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.mjs',
          sidebarCollapsed: true,
          editUrl: `${GITLAB_URL}/-/edit/main/`,
          showLastUpdateTime: gitAvailable,
          breadcrumbs: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      /** @type {import('@easyops-cn/docusaurus-search-local').PluginOptions} */
      ({
        hashed: true,
        language: ['en', 'zh'],
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: '开发者文档',
        logo: {
          alt: 'BlueMedia',
          src: 'img/logo-bluemedia-color.png',
          srcDark: 'img/logo-bluemedia-color.png',
          height: 26,
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: '文档',
          },
          {
            to: '/docs/guides/quickstart',
            label: '快速开始',
            position: 'left',
          },
          {
            to: '/docs/guides/error-codes',
            label: '错误码',
            position: 'left',
          },
          {
            type: 'dropdown',
            label: '参考',
            position: 'left',
            items: [
              {to: '/docs/reference/openapi', label: 'OpenAPI 与 Agent 接入'},
              {to: '/docs/reference/glossary', label: '术语表'},
              {to: '/docs/reference/rate-limits', label: '限流与配额'},
              {to: '/docs/reference/idempotency', label: '幂等与重试'},
              {to: '/docs/reference/faq', label: '常见问题'},
              {to: '/docs/reference/changelog', label: '更新日志'},
            ],
          },
          {
            href: GITLAB_URL,
            label: 'GitLab',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '上手',
            items: [
              {label: '快速开始', to: '/docs/guides/quickstart'},
              {label: '认证与权限', to: '/docs/guides/authentication'},
              {label: '客户接入', to: '/docs/guides/customer-onboarding'},
            ],
          },
          {
            title: '接口',
            items: [
              {label: '消息发送与状态', to: '/docs/messaging/messages'},
              {label: '资产与号码配置', to: '/docs/assets-phone-numbers/business-portfolios'},
              {label: '模板、Flow 与媒体', to: '/docs/templates-flows-media/templates'},
            ],
          },
          {
            title: '排障',
            items: [
              {label: '错误码', to: '/docs/guides/error-codes'},
              {label: '常见问题', to: '/docs/reference/faq'},
              {label: '限流与配额', to: '/docs/reference/rate-limits'},
              {label: '幂等与重试', to: '/docs/reference/idempotency'},
            ],
          },
          {
            title: '更多',
            items: [
              {label: 'OpenAPI 与 Agent 接入', to: '/docs/reference/openapi'},
              {label: '术语表', to: '/docs/reference/glossary'},
              {label: '更新日志', to: '/docs/reference/changelog'},
              {label: '源码仓库', href: GITLAB_URL},
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} BlueMedia · BSP 开发者文档`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: [
          'bash',
          'json',
          'http',
          'yaml',
          'python',
          'go',
          'java',
          // php 依赖 markup-templating，必须排在它前面
          'markup-templating',
          'php',
        ],
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      mermaid: {
        theme: {light: 'neutral', dark: 'dark'},
        options: {
          themeVariables: {
            primaryColor: '#eef1fb',
            primaryBorderColor: '#2d44ba',
            primaryTextColor: '#041726',
            lineColor: '#7986cb',
          },
        },
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
    }),
};

export default config;
