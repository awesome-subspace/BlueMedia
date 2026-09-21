// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

const GITLAB_URL = 'http://git.domob-inc.cn/wenqiao.kang/BSPDocSystem';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'BSP 开发者文档',
  tagline: '接入 WhatsApp Business Platform 所需的全部接口与指南',
  favicon: 'img/favicon.svg',

  url: 'http://git.domob-inc.cn',
  baseUrl: '/',
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
          editUrl: `${GITLAB_URL}/-/edit/main/`,
          showLastUpdateTime: true,
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
        title: 'BSP 开发者文档',
        logo: {
          alt: 'BSP',
          src: 'img/logo.svg',
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
              {label: 'Webhook 集成', to: '/docs/guides/webhook-integration'},
              {label: '账务与信用额度', to: '/docs/guides/billing'},
            ],
          },
          {
            title: '更多',
            items: [
              {label: '源码仓库', href: GITLAB_URL},
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} BlueMedia · BSP 开发者文档`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'json', 'http', 'yaml'],
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
    }),
};

export default config;
