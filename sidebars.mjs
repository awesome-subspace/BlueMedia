// 由 scripts/convert-gitbook.mjs 从 docs/SUMMARY.md 生成，可直接手工维护。
// className 上的 api-method 决定侧边栏里的 HTTP 方法徽标（样式见 src/css/custom.css）。
// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: '概览'
    },
    {
      type: 'category',
      label: '开始使用',
      items: [
        {
          type: 'doc',
          id: 'guides/quickstart',
          label: '快速开始'
        },
        {
          type: 'doc',
          id: 'guides/authentication',
          label: '认证与权限'
        },
        {
          type: 'doc',
          id: 'guides/customer-onboarding',
          label: '客户接入'
        },
        {
          type: 'doc',
          id: 'guides/phone-numbers',
          label: '号码注册与生命周期'
        },
        {
          type: 'doc',
          id: 'guides/messaging',
          label: '发消息与状态追踪'
        },
        {
          type: 'doc',
          id: 'guides/billing',
          label: '账务与信用额度'
        },
        {
          type: 'doc',
          id: 'guides/webhook-integration',
          label: 'Webhook 集成'
        },
        {
          type: 'doc',
          id: 'guides/ctwa-attribution',
          label: '广告归因与转化上报'
        },
        {
          type: 'doc',
          id: 'guides/error-codes',
          label: '错误码'
        }
      ]
    },
    {
      type: 'category',
      label: '接入准备与鉴权',
      items: [
        {
          type: 'doc',
          id: 'authentication/get-whoami',
          label: '验证 API Key',
          className: 'api-method get'
        },
        {
          type: 'doc',
          id: 'authentication/post-oauth-token',
          label: 'OAuth token 端点',
          className: 'api-method post'
        }
      ]
    },
    {
      type: 'category',
      label: '消息发送与状态',
      items: [
        {
          type: 'category',
          label: '消息',
          link: {
            type: 'doc',
            id: 'messaging/messages'
          },
          items: [
            {
              type: 'doc',
              id: 'messaging/post-v1-messages',
              label: '提交出站消息',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'messaging/get-v1-messages',
              label: '列出最近消息',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'messaging/get-v1-messages-id',
              label: '读取消息状态',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'messaging/post-v1-messages-read',
              label: '标记已读',
              className: 'api-method post'
            }
          ]
        },
        {
          type: 'category',
          label: '群发 Broadcasts',
          link: {
            type: 'doc',
            id: 'messaging/broadcasts'
          },
          items: [
            {
              type: 'doc',
              id: 'messaging/post-v1-broadcasts',
              label: '创建群发',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'messaging/get-v1-broadcasts',
              label: '列出群发活动',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'messaging/get-v1-broadcasts-id',
              label: '活动详情',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'messaging/get-v1-broadcasts-id-recipients',
              label: '收件人明细',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'messaging/post-v1-broadcasts-id-pause',
              label: '暂停派发',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'messaging/post-v1-broadcasts-id-resume',
              label: '恢复活动',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'messaging/post-v1-broadcasts-id-cancel',
              label: '取消活动',
              className: 'api-method post'
            }
          ]
        },
        {
          type: 'category',
          label: '转化事件上报',
          link: {
            type: 'doc',
            id: 'messaging/conversions'
          },
          items: [
            {
              type: 'doc',
              id: 'messaging/post-v1-conversions-events',
              label: '上报转化事件',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'messaging/get-v1-conversions-events',
              label: '列出转化事件',
              className: 'api-method get'
            }
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'WhatsApp 客户接入',
      items: [
        {
          type: 'category',
          label: '服务商侧接入操作',
          link: {
            type: 'doc',
            id: 'onboarding/provider-onboarding'
          },
          items: [
            {
              type: 'doc',
              id: 'onboarding/post-v1-onboarding-embedded-signup',
              label: '完成接入',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'onboarding/get-v1-onboarding-embedded-signup',
              label: '查询最近操作',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'onboarding/get-v1-onboarding-embedded-signup-operationid',
              label: '操作详情',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'onboarding/post-v1-onboarding-embedded-signup-operationid-retry',
              label: '从失败步骤恢复',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'onboarding/post-v1-onboarding-es-events',
              label: '上报 ES 会话事件',
              className: 'api-method post'
            }
          ]
        },
        {
          type: 'category',
          label: '邀请管理',
          link: {
            type: 'doc',
            id: 'onboarding/invitations'
          },
          items: [
            {
              type: 'doc',
              id: 'onboarding/post-v1-onboarding-invitations',
              label: '生成接入链接',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'onboarding/get-v1-onboarding-invitations',
              label: '列出邀请',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'onboarding/delete-v1-onboarding-invitations-id',
              label: '撤销邀请',
              className: 'api-method delete'
            }
          ]
        },
        {
          type: 'category',
          label: '客户侧邀请页（免鉴权）',
          link: {
            type: 'doc',
            id: 'onboarding/invitation-public'
          },
          items: [
            {
              type: 'doc',
              id: 'onboarding/get-v1-onboarding-invitations-token',
              label: '读取邀请信息',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'onboarding/post-v1-onboarding-invitations-token-complete',
              label: '提交 Meta 授权结果',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'onboarding/post-v1-onboarding-invitations-token-retry',
              label: '重试接入',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'onboarding/get-v1-onboarding-invitations-token-status',
              label: '轮询接入进度',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'onboarding/post-v1-onboarding-invitations-token-es-events',
              label: '上报中断与自助报错',
              className: 'api-method post'
            }
          ]
        }
      ]
    },
    {
      type: 'category',
      label: '商业验证（PLBV）',
      items: [
        {
          type: 'doc',
          id: 'business-verification/get-v1-business-portfolios-portfolioid-certification',
          label: '读取最近认证记录',
          className: 'api-method get'
        },
        {
          type: 'doc',
          id: 'business-verification/post-v1-business-portfolios-portfolioid-certification-refresh',
          label: '刷新 PLBV 认证',
          className: 'api-method post'
        },
        {
          type: 'doc',
          id: 'business-verification/post-v1-business-portfolios-id-refresh-verification',
          label: '同步验证状态',
          className: 'api-method post'
        },
        {
          type: 'doc',
          id: 'business-verification/get-v1-business-portfolios-id-token-scopes',
          label: '诊断客户 Token Scopes',
          className: 'api-method get'
        }
      ]
    },
    {
      type: 'category',
      label: '资产与号码配置',
      items: [
        {
          type: 'category',
          label: 'Business Portfolio',
          link: {
            type: 'doc',
            id: 'assets-phone-numbers/business-portfolios'
          },
          items: [
            {
              type: 'doc',
              id: 'assets-phone-numbers/get-v1-business-portfolios',
              label: '列出 Portfolios',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/post-v1-business-portfolios',
              label: '手工创建 Portfolio',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/get-v1-business-portfolios-id',
              label: 'Portfolio 详情',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/patch-v1-business-portfolios-id',
              label: '修改 Portfolio',
              className: 'api-method patch'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/delete-v1-business-portfolios-id',
              label: '删除 Portfolio',
              className: 'api-method delete'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/get-v1-business-portfolios-id-delete-preview',
              label: '删除影响预览',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/post-v1-business-portfolios-id-dataset',
              label: '绑定 Meta Pixel',
              className: 'api-method post'
            }
          ]
        },
        {
          type: 'category',
          label: 'WhatsApp 账户（WABA）',
          link: {
            type: 'doc',
            id: 'assets-phone-numbers/wabas'
          },
          items: [
            {
              type: 'doc',
              id: 'assets-phone-numbers/get-v1-wabas',
              label: '列出 WABA',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/post-v1-wabas',
              label: '手工创建 WABA 记录',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/get-v1-wabas-id',
              label: 'WABA 详情',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/patch-v1-wabas-id',
              label: '修改 WABA',
              className: 'api-method patch'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/delete-v1-wabas-id',
              label: '删除 WABA',
              className: 'api-method delete'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/get-v1-wabas-id-delete-preview',
              label: '删除影响预览',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/post-v1-wabas-id-credit-line-authorize',
              label: '授权信用额度',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/post-v1-wabas-id-credit-line-deauthorize',
              label: '取消额度授权',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/get-v1-wabas-id-analytics',
              label: '用量分析',
              className: 'api-method get'
            }
          ]
        },
        {
          type: 'category',
          label: '业务号码记录',
          link: {
            type: 'doc',
            id: 'assets-phone-numbers/phone-numbers'
          },
          items: [
            {
              type: 'doc',
              id: 'assets-phone-numbers/get-v1-phone-numbers',
              label: '列出号码',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/post-v1-phone-numbers',
              label: '手工创建号码记录',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/get-v1-phone-numbers-id',
              label: '号码详情',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/patch-v1-phone-numbers-id',
              label: '修改号码本地字段',
              className: 'api-method patch'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/delete-v1-phone-numbers-id',
              label: '删除号码',
              className: 'api-method delete'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/get-v1-phone-numbers-id-delete-preview',
              label: '删除影响预览',
              className: 'api-method get'
            }
          ]
        },
        {
          type: 'category',
          label: '号码注册与验证',
          link: {
            type: 'doc',
            id: 'assets-phone-numbers/phone-registration'
          },
          items: [
            {
              type: 'doc',
              id: 'assets-phone-numbers/get-v1-phone-numbers-id-registration-status',
              label: '查询注册状态',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/post-v1-phone-numbers-id-refresh',
              label: '拉取 Meta 侧状态',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/post-v1-phone-numbers-id-request-code',
              label: '请求验证码',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/post-v1-phone-numbers-id-verify-code',
              label: '提交验证码',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/post-v1-phone-numbers-id-register',
              label: '注册号码',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/post-v1-phone-numbers-id-deregister',
              label: '注销号码',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/post-v1-phone-numbers-id-two-step-pin',
              label: '设置两步验证 PIN',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/post-v1-phone-numbers-id-display-name',
              label: '修改显示名称',
              className: 'api-method post'
            }
          ]
        },
        {
          type: 'category',
          label: '商业资料与消息路由',
          link: {
            type: 'doc',
            id: 'assets-phone-numbers/phone-configuration'
          },
          items: [
            {
              type: 'doc',
              id: 'assets-phone-numbers/get-v1-phone-numbers-id-business-profile',
              label: '读取商业资料',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/put-v1-phone-numbers-id-business-profile',
              label: '覆盖商业资料',
              className: 'api-method put'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/get-v1-phone-numbers-id-messaging-config',
              label: '读取消息路由配置',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'assets-phone-numbers/put-v1-phone-numbers-id-messaging-config',
              label: '覆盖消息路由配置',
              className: 'api-method put'
            }
          ]
        }
      ]
    },
    {
      type: 'category',
      label: '模板、Flow 与媒体',
      items: [
        {
          type: 'category',
          label: '模板',
          link: {
            type: 'doc',
            id: 'templates-flows-media/templates'
          },
          items: [
            {
              type: 'doc',
              id: 'templates-flows-media/get-v1-templates',
              label: '列出模板',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/post-v1-templates',
              label: '创建模板',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/get-v1-templates-id',
              label: '模板详情',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/patch-v1-templates-id',
              label: '编辑模板',
              className: 'api-method patch'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/delete-v1-templates-id',
              label: '删除模板',
              className: 'api-method delete'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/post-v1-templates-sync',
              label: '同步 Meta 模板',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/post-v1-templates-media',
              label: '上传模板媒体头',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/get-v1-templates-analytics',
              label: '模板分析',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/post-v1-templates-analytics-enable',
              label: '开启模板分析',
              className: 'api-method post'
            }
          ]
        },
        {
          type: 'category',
          label: 'Flow',
          link: {
            type: 'doc',
            id: 'templates-flows-media/flows'
          },
          items: [
            {
              type: 'doc',
              id: 'templates-flows-media/get-v1-flows',
              label: '列出 Flow',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/post-v1-flows',
              label: '创建 Flow',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/get-v1-flows-id',
              label: 'Flow 详情',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/patch-v1-flows-id',
              label: '修改 Flow',
              className: 'api-method patch'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/delete-v1-flows-id',
              label: '删除 Flow',
              className: 'api-method delete'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/post-v1-flows-id-json',
              label: '上传 Flow JSON',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/get-v1-flows-id-assets',
              label: 'Flow 资产',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/get-v1-flows-id-preview',
              label: '预览链接',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/post-v1-flows-id-publish',
              label: '发布 Flow',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/post-v1-flows-id-deprecate',
              label: '弃用 Flow',
              className: 'api-method post'
            }
          ]
        },
        {
          type: 'category',
          label: '媒体',
          link: {
            type: 'doc',
            id: 'templates-flows-media/media'
          },
          items: [
            {
              type: 'doc',
              id: 'templates-flows-media/post-v1-media',
              label: '上传媒体',
              className: 'api-method post'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/get-v1-media-id',
              label: '媒体详情',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/get-v1-media-id-content',
              label: '代理下载',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'templates-flows-media/delete-v1-media-id',
              label: '删除媒体',
              className: 'api-method delete'
            }
          ]
        }
      ]
    },
    {
      type: 'category',
      label: '收件箱与会话',
      items: [
        {
          type: 'doc',
          id: 'inbox-conversations/get-v1-conversations',
          label: '收件箱列表',
          className: 'api-method get'
        },
        {
          type: 'doc',
          id: 'inbox-conversations/get-v1-conversations-id',
          label: '单个会话线程',
          className: 'api-method get'
        },
        {
          type: 'doc',
          id: 'inbox-conversations/post-v1-conversations-id-read',
          label: '清零未读计数',
          className: 'api-method post'
        }
      ]
    },
    {
      type: 'category',
      label: 'Webhook 集成',
      items: [
        {
          type: 'doc',
          id: 'webhooks/get-v1-webhook-endpoints',
          label: '列出端点',
          className: 'api-method get'
        },
        {
          type: 'doc',
          id: 'webhooks/post-v1-webhook-endpoints',
          label: '创建账户回调端点',
          className: 'api-method post'
        },
        {
          type: 'doc',
          id: 'webhooks/get-v1-webhook-endpoints-id',
          label: '读取单个端点',
          className: 'api-method get'
        },
        {
          type: 'doc',
          id: 'webhooks/patch-v1-webhook-endpoints-id',
          label: '局部更新端点',
          className: 'api-method patch'
        },
        {
          type: 'doc',
          id: 'webhooks/delete-v1-webhook-endpoints-id',
          label: '停用端点并保留历史记录',
          className: 'api-method delete'
        },
        {
          type: 'doc',
          id: 'webhooks/post-v1-webhook-endpoints-id-rotate-secret',
          label: '轮换签名密钥',
          className: 'api-method post'
        },
        {
          type: 'doc',
          id: 'webhooks/post-v1-webhook-endpoints-id-enable',
          label: '重新启用被停用的端点',
          className: 'api-method post'
        },
        {
          type: 'doc',
          id: 'webhooks/post-v1-webhook-endpoints-id-verify',
          label: '触发所有权验证',
          className: 'api-method post'
        },
        {
          type: 'doc',
          id: 'webhooks/post-v1-webhook-endpoints-id-test',
          label: '发一条测试事件',
          className: 'api-method post'
        }
      ]
    },
    {
      type: 'category',
      label: '概览统计',
      items: [
        {
          type: 'doc',
          id: 'overview/get-v1-overview-counts',
          label: '总览页计数看板',
          className: 'api-method get'
        }
      ]
    },
    {
      type: 'category',
      label: '账务与服务状态',
      items: [
        {
          type: 'category',
          label: '信用账户与用量',
          link: {
            type: 'doc',
            id: 'billing-status/credit-account'
          },
          items: [
            {
              type: 'doc',
              id: 'billing-status/get-v1-credit-account',
              label: '账户余额',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'billing-status/get-v1-credit-account-usage',
              label: '用量与费用',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'billing-status/get-v1-credit-account-ledger',
              label: '账本流水',
              className: 'api-method get'
            }
          ]
        },
        {
          type: 'category',
          label: 'Portfolio 预算',
          link: {
            type: 'doc',
            id: 'billing-status/allocations'
          },
          items: [
            {
              type: 'doc',
              id: 'billing-status/get-v1-credit-account-allocations',
              label: '预算总览',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'billing-status/put-v1-credit-account-allocations-portfolioid',
              label: '设置预算上限',
              className: 'api-method put'
            },
            {
              type: 'doc',
              id: 'billing-status/delete-v1-credit-account-allocations-portfolioid',
              label: '取消预算上限',
              className: 'api-method delete'
            },
            {
              type: 'doc',
              id: 'billing-status/get-v1-credit-account-allocations-audit',
              label: '预算对账',
              className: 'api-method get'
            }
          ]
        },
        {
          type: 'category',
          label: '价目与售价',
          link: {
            type: 'doc',
            id: 'billing-status/pricing'
          },
          items: [
            {
              type: 'doc',
              id: 'billing-status/get-v1-pricing-rates',
              label: '我的价目表',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'billing-status/get-v1-pricing-tariff',
              label: '我的售价策略',
              className: 'api-method get'
            }
          ]
        },
        {
          type: 'category',
          label: '服务状态探针',
          link: {
            type: 'doc',
            id: 'billing-status/health'
          },
          items: [
            {
              type: 'doc',
              id: 'billing-status/get-live',
              label: '进程存活检查',
              className: 'api-method get'
            },
            {
              type: 'doc',
              id: 'billing-status/get-ready',
              label: '就绪检查',
              className: 'api-method get'
            }
          ]
        }
      ]
    },
    {
      type: 'category',
      label: '参考',
      items: [
        {
          type: 'doc',
          id: 'reference/glossary',
          label: '术语表'
        },
        {
          type: 'doc',
          id: 'reference/rate-limits',
          label: '限流与配额'
        },
        {
          type: 'doc',
          id: 'reference/idempotency',
          label: '幂等与重试'
        },
        {
          type: 'doc',
          id: 'reference/faq',
          label: '常见问题'
        },
        {
          type: 'doc',
          id: 'reference/changelog',
          label: '更新日志'
        }
      ]
    }
  ]
};

export default sidebars;
