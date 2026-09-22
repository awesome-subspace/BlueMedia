#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { stringify as toYaml } from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const staticRoot = path.join(root, "static");
const schemaRoot = path.join(staticRoot, "schemas", "webhooks");
const source =
  process.argv[2] ??
  process.env.OPENAPI_SOURCE ??
  "https://api.bsptest.com/portal/openapi.json";

async function loadJson(location) {
  if (/^https?:\/\//.test(location)) {
    const response = await fetch(location, {
      headers: { accept: "application/json" },
    });
    if (!response.ok)
      throw new Error(
        `OpenAPI source returned HTTP ${response.status}: ${location}`,
      );
    return response.json();
  }
  return JSON.parse(await readFile(path.resolve(location), "utf8"));
}

/** Convert OpenAPI 3.0 `nullable` into JSON Schema unions before promoting to 3.1. */
function promoteNullable(value) {
  if (Array.isArray(value)) return value.map(promoteNullable);
  if (value === null || typeof value !== "object") return value;
  const promoted = Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, promoteNullable(item)]),
  );
  if (promoted.nullable !== true) return promoted;
  delete promoted.nullable;
  if (typeof promoted.type === "string") {
    promoted.type = [promoted.type, "null"];
    return promoted;
  }
  if (Array.isArray(promoted.type)) {
    if (!promoted.type.includes("null")) promoted.type.push("null");
    return promoted;
  }
  if (promoted.$ref !== undefined) {
    const ref = promoted.$ref;
    delete promoted.$ref;
    promoted.oneOf = [{ $ref: ref }, { type: "null" }];
    return promoted;
  }
  if (promoted.allOf !== undefined) {
    const allOf = promoted.allOf;
    delete promoted.allOf;
    promoted.oneOf = [{ allOf }, { type: "null" }];
    return promoted;
  }
  promoted.type = ["object", "null"];
  return promoted;
}

const nullableString = { type: ["string", "null"] };
const dateTime = { type: "string", format: "date-time" };
const messageStatuses = [
  "accepted",
  "sending",
  "submitted",
  "sent",
  "delivered",
  "read",
  "failed",
];

const recipientProperties = {
  phoneNumberId: {
    type: "string",
    minLength: 1,
    description: "平台内号码 ID（pn_...）。",
  },
  to: {
    type: "string",
    minLength: 1,
    description:
      "E.164 收件人号码，不带 +。与 toUserId 至少提供一个；两者同时存在时优先使用 to。",
  },
  toUserId: {
    type: "string",
    minLength: 1,
    maxLength: 140,
    description:
      "Business-scoped user ID，例如 US.13491208655302741918。与 to 至少提供一个。",
  },
};

function messageVariant(type, payloadSchema, { typeOptional = false } = {}) {
  return {
    type: "object",
    properties: {
      ...recipientProperties,
      type: { const: type },
      [type]: payloadSchema,
    },
    required: ["phoneNumberId", ...(typeOptional ? [] : ["type"]), type],
    anyOf: [{ required: ["to"] }, { required: ["toUserId"] }],
    unevaluatedProperties: false,
  };
}

const mediaReference = (extra = {}) => ({
  type: "object",
  properties: {
    id: { type: "string", minLength: 1 },
    link: { type: "string", format: "uri" },
    ...extra,
  },
  oneOf: [
    {
      properties: { id: {}, link: {} },
      required: ["id"],
      not: { properties: { link: {} }, required: ["link"] },
    },
    {
      properties: { id: {}, link: {} },
      required: ["link"],
      not: { properties: { id: {} }, required: ["id"] },
    },
  ],
  additionalProperties: false,
});

const contact = {
  type: "object",
  required: ["name"],
  properties: {
    addresses: {
      type: "array",
      items: { type: "object", additionalProperties: true },
    },
    birthday: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
    emails: {
      type: "array",
      items: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" },
          type: { type: "string" },
        },
        additionalProperties: false,
      },
    },
    name: {
      type: "object",
      required: ["formatted_name"],
      properties: { formatted_name: { type: "string", minLength: 1 } },
      additionalProperties: true,
    },
    org: { type: "object", additionalProperties: true },
    phones: {
      type: "array",
      items: {
        type: "object",
        required: ["phone"],
        properties: { phone: { type: "string", minLength: 1 } },
        additionalProperties: true,
      },
    },
    urls: {
      type: "array",
      items: {
        type: "object",
        required: ["url"],
        properties: { url: { type: "string", format: "uri" } },
        additionalProperties: true,
      },
    },
  },
  additionalProperties: false,
};

const schemas = {
  TextMessageRequest: messageVariant(
    "text",
    {
      type: "object",
      required: ["body"],
      properties: {
        body: { type: "string", minLength: 1 },
        preview_url: { type: "boolean" },
      },
      additionalProperties: false,
    },
    { typeOptional: true },
  ),
  TemplateMessageRequest: messageVariant("template", {
    type: "object",
    required: ["name", "language"],
    properties: {
      name: { type: "string", minLength: 1 },
      language: {
        type: "object",
        required: ["code"],
        properties: { code: { type: "string", minLength: 1 } },
        additionalProperties: false,
      },
      components: {
        type: "array",
        items: { type: "object", additionalProperties: true },
      },
    },
    additionalProperties: false,
  }),
  ImageMessageRequest: messageVariant(
    "image",
    mediaReference({ caption: { type: "string" } }),
  ),
  VideoMessageRequest: messageVariant(
    "video",
    mediaReference({ caption: { type: "string" } }),
  ),
  AudioMessageRequest: messageVariant("audio", mediaReference()),
  DocumentMessageRequest: messageVariant(
    "document",
    mediaReference({
      caption: { type: "string" },
      filename: { type: "string" },
    }),
  ),
  StickerMessageRequest: messageVariant("sticker", mediaReference()),
  InteractiveMessageRequest: messageVariant("interactive", {
    type: "object",
    required: ["type"],
    properties: { type: { type: "string", minLength: 1 } },
    additionalProperties: true,
  }),
  LocationMessageRequest: messageVariant("location", {
    type: "object",
    required: ["latitude", "longitude"],
    properties: {
      latitude: {
        oneOf: [
          { type: "number", minimum: -90, maximum: 90 },
          { type: "string" },
        ],
      },
      longitude: {
        oneOf: [
          { type: "number", minimum: -180, maximum: 180 },
          { type: "string" },
        ],
      },
      name: { type: "string" },
      address: { type: "string" },
    },
    additionalProperties: false,
  }),
  ContactsMessageRequest: messageVariant("contacts", {
    type: "array",
    minItems: 1,
    maxItems: 257,
    items: contact,
  }),
  ReactionMessageRequest: messageVariant("reaction", {
    type: "object",
    required: ["message_id", "emoji"],
    properties: {
      message_id: { type: "string", pattern: "^wamid\\." },
      emoji: { type: "string", minLength: 1 },
    },
    additionalProperties: false,
  }),
  MessageRequest: {
    oneOf: [
      { $ref: "#/components/schemas/TextMessageRequest" },
      { $ref: "#/components/schemas/TemplateMessageRequest" },
      { $ref: "#/components/schemas/ImageMessageRequest" },
      { $ref: "#/components/schemas/VideoMessageRequest" },
      { $ref: "#/components/schemas/AudioMessageRequest" },
      { $ref: "#/components/schemas/DocumentMessageRequest" },
      { $ref: "#/components/schemas/StickerMessageRequest" },
      { $ref: "#/components/schemas/InteractiveMessageRequest" },
      { $ref: "#/components/schemas/LocationMessageRequest" },
      { $ref: "#/components/schemas/ContactsMessageRequest" },
      { $ref: "#/components/schemas/ReactionMessageRequest" },
    ],
    discriminator: {
      propertyName: "type",
      mapping: Object.fromEntries(
        [
          "text",
          "template",
          "image",
          "video",
          "audio",
          "document",
          "sticker",
          "interactive",
          "location",
          "contacts",
          "reaction",
        ].map((type) => [
          type,
          `#/components/schemas/${type[0].toUpperCase()}${type.slice(1)}MessageRequest`,
        ]),
      ),
    },
    description: "type 省略时按 text 处理；建议始终显式传 type。",
    "x-default-discriminator-value": "text",
  },
  MessageRecord: {
    type: "object",
    additionalProperties: false,
    required: [
      "id",
      "tenantId",
      "phoneNumberId",
      "metaPhoneNumberId",
      "toNumber",
      "toUserId",
      "type",
      "content",
      "category",
      "status",
      "wamid",
      "errorCode",
      "errorMessage",
      "metaError",
      "idempotencyKey",
      "createdAt",
      "updatedAt",
    ],
    properties: {
      id: { type: "string", pattern: "^msg_" },
      tenantId: { type: "string" },
      phoneNumberId: nullableString,
      metaPhoneNumberId: { type: "string" },
      toNumber: nullableString,
      toUserId: nullableString,
      type: { type: "string" },
      content: {},
      category: nullableString,
      status: { type: "string", enum: messageStatuses },
      wamid: nullableString,
      errorCode: nullableString,
      errorMessage: nullableString,
      metaError: { type: ["object", "null"], additionalProperties: true },
      idempotencyKey: nullableString,
      createdAt: dateTime,
      updatedAt: dateTime,
    },
  },
  MessageFailure: {
    type: "object",
    additionalProperties: false,
    required: [
      "code",
      "metaCode",
      "message",
      "meta",
      "retryable",
      "customerAction",
    ],
    properties: {
      code: { type: "string" },
      metaCode: { type: ["integer", "null"] },
      message: { type: "string" },
      meta: { type: ["object", "null"], additionalProperties: true },
      retryable: { type: "boolean" },
      customerAction: { type: "string" },
    },
  },
  MessageDetails: {
    allOf: [
      { $ref: "#/components/schemas/MessageRecord" },
      {
        type: "object",
        required: ["stage", "error"],
        properties: {
          stage: {
            type: ["string", "null"],
            enum: ["submit", "delivery", null],
          },
          error: {
            oneOf: [
              { $ref: "#/components/schemas/MessageFailure" },
              { type: "null" },
            ],
          },
        },
      },
    ],
  },
  WebhookMessageEvent: {
    type: "object",
    required: ["kind", "message"],
    properties: {
      kind: { const: "message" },
      wabaId: { type: "string" },
      phoneNumberId: { type: "string" },
      field: { type: "string" },
      profileName: { type: "string" },
      profileUsername: { type: "string" },
      message: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string" },
          type: { type: "string" },
          from: { type: "string" },
          from_user_id: { type: "string" },
          timestamp: { type: "string" },
        },
        additionalProperties: true,
      },
    },
    additionalProperties: false,
  },
  WebhookStatusEvent: {
    type: "object",
    required: ["kind", "status"],
    properties: {
      kind: { const: "status" },
      wabaId: { type: "string" },
      phoneNumberId: { type: "string" },
      field: { type: "string" },
      status: {
        type: "object",
        required: ["id", "status"],
        properties: {
          id: { type: "string" },
          status: { type: "string" },
          timestamp: { type: "string" },
          recipient_id: { type: "string" },
        },
        additionalProperties: true,
      },
    },
    additionalProperties: false,
  },
  WebhookChangeEvent: {
    type: "object",
    required: ["kind", "value"],
    properties: {
      kind: { const: "change" },
      wabaId: { type: "string" },
      phoneNumberId: { type: "string" },
      field: { type: "string" },
      value: {},
    },
    additionalProperties: false,
  },
  WebhookProbeEvent: {
    type: "object",
    required: ["kind", "value"],
    properties: { kind: { const: "probe" }, value: {} },
    additionalProperties: false,
  },
  PlatformEventEnvelope: {
    type: "object",
    required: [
      "id",
      "type",
      "api_version",
      "created_at",
      "account_id",
      "project_id",
      "data",
    ],
    properties: {
      id: { type: "string", pattern: "^evt_" },
      type: {
        type: "string",
        enum: [
          "job.completed",
          "job.failed",
          "usage.updated",
          "webhook.verification",
        ],
      },
      api_version: { type: "string" },
      created_at: dateTime,
      account_id: { type: "string" },
      project_id: nullableString,
      data: { type: "object", additionalProperties: true },
    },
    additionalProperties: false,
  },
  WebhookEvent: {
    oneOf: [
      { $ref: "#/components/schemas/WebhookMessageEvent" },
      { $ref: "#/components/schemas/WebhookStatusEvent" },
      { $ref: "#/components/schemas/WebhookChangeEvent" },
      { $ref: "#/components/schemas/WebhookProbeEvent" },
      { $ref: "#/components/schemas/PlatformEventEnvelope" },
    ],
  },
};

function response(description, schema, example) {
  return {
    description,
    headers: {
      "X-Request-Id": {
        description: "请求追踪 ID；错误响应始终返回。",
        schema: { type: "string" },
      },
    },
    ...(schema
      ? {
          content: {
            "application/json": { schema, ...(example ? { example } : {}) },
          },
        }
      : {}),
  };
}

function errorResponses(statuses) {
  return Object.fromEntries(
    statuses.map(([status, description]) => [
      status,
      response(description, { $ref: "#/components/schemas/ErrorResponse" }),
    ]),
  );
}

function patchMessageContracts(document) {
  const paths = document.paths ?? {};
  const collection = paths["/v1/messages"];
  const details = paths["/v1/messages/{id}"];
  if (!collection?.post || !collection?.get || !details?.get) {
    throw new Error(
      "OpenAPI source is missing the expected /v1/messages operations",
    );
  }

  collection.post.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/MessageRequest" },
        examples: {
          text: {
            value: {
              phoneNumberId: "pn_01923abc",
              to: "8613800138000",
              type: "text",
              text: { body: "你好", preview_url: false },
            },
          },
          image: {
            value: {
              phoneNumberId: "pn_01923abc",
              toUserId: "US.13491208655302741918",
              type: "image",
              image: {
                link: "https://cdn.example.com/image.jpg",
                caption: "图片说明",
              },
            },
          },
        },
      },
    },
  };
  collection.post.responses = {
    202: response(
      "请求已进入异步发送流程；不代表已送达。幂等重放可能返回原消息的当前状态。",
      { $ref: "#/components/schemas/MessageRecord" },
    ),
    ...errorResponses([
      ["400", "请求体、Idempotency-Key 或收件人格式无效。"],
      ["401", "API Key 缺失或无效。"],
      ["403", "scope 不足，或收件人已退订营销消息。"],
      ["404", "发送号码不存在或不属于当前授权范围。"],
      ["409", "幂等键冲突，或 24 小时客服窗口已关闭。"],
      [
        "429",
        "超过调用频率，或命中 Meta 人均互动冷却。请根据 error.retryable 决定是否退避重试。",
      ],
      ["500", "平台内部错误。记录 X-Request-Id 后重试或联系支持。"],
    ]),
  };

  const query = Object.fromEntries(
    collection.get.parameters.map((item) => [item.name, item]),
  );
  query.limit.schema = {
    type: "integer",
    minimum: 1,
    maximum: 200,
    default: 50,
  };
  query.limit.description = "每页条数。超出 1..200 时服务端会夹取到边界值。";
  query.before.schema = { type: "string", format: "date-time" };
  query.before.description = "上一页最后一条消息的 createdAt；无法解析时忽略。";
  query.status.schema = { type: "string", enum: messageStatuses };
  query.status.description =
    "精确匹配消息状态。服务端当前对未知值返回空数组；客户端应按枚举预校验。";
  query.from.schema = { type: "string", format: "date-time" };
  query.from.description = "createdAt 闭区间下界；无法解析时忽略。";
  query.to.schema = { type: "string", format: "date-time" };
  query.to.description = "createdAt 闭区间上界；无法解析时忽略。";
  collection.get.responses = {
    200: response("按 createdAt 倒序返回裸数组；没有 total。", {
      type: "array",
      items: { $ref: "#/components/schemas/MessageRecord" },
    }),
    ...errorResponses([
      ["401", "API Key 缺失或无效。"],
      ["403", "当前凭证不能访问该资源。"],
      ["500", "平台内部错误。"],
    ]),
  };

  details.get.responses = {
    200: response("消息当前状态以及结构化失败原因。", {
      $ref: "#/components/schemas/MessageDetails",
    }),
    ...errorResponses([
      ["401", "API Key 缺失或无效。"],
      ["403", "当前凭证不能访问该资源。"],
      ["404", "消息不存在或不属于当前账户。"],
      ["500", "平台内部错误。"],
    ]),
  };
}

function schemaFromFieldLabel(label) {
  if (label === "object") return { type: "object", additionalProperties: true };
  if (label === "array") return { type: "array", items: {} };
  if (label === "object[]")
    return {
      type: "array",
      items: { type: "object", additionalProperties: true },
    };
  if (label === "string[]") return { type: "array", items: { type: "string" } };
  if (label === "boolean") return { type: "boolean" };
  if (label === "integer") return { type: "integer" };
  if (label === "integer >= 0") return { type: "integer", minimum: 0 };
  if (label === "number") return { type: "number" };
  if (label === "URL") return { type: "string", format: "uri" };
  if (label === "ISO 8601") return { type: "string", format: "date-time" };
  if (label === "string(200)") return { type: "string", maxLength: 200 };
  if (label.includes(" | "))
    return { type: "string", enum: label.split(" | ") };
  return { type: "string" };
}

/** Recover the field types already embedded in the backend's human descriptions. */
function tightenGeneratedRequestSchemas(document) {
  for (const pathItem of Object.values(document.paths ?? {})) {
    for (const operation of Object.values(pathItem ?? {})) {
      const schema =
        operation?.requestBody?.content?.["application/json"]?.schema;
      for (const property of Object.values(schema?.properties ?? {})) {
        if (typeof property?.description !== "string") continue;
        const label = /^(.+?) · (?:必填|可选)/.exec(property.description)?.[1];
        if (!label) continue;
        Object.assign(property, schemaFromFieldLabel(label), {
          description: property.description,
        });
      }
    }
  }
}

function addSdkMetadata(document) {
  document.tags = (document.tags ?? []).map((tag) => ({
    ...tag,
    description: tag.description ?? `${tag.name}相关接口。`,
  }));
  for (const [route, pathItem] of Object.entries(document.paths ?? {})) {
    for (const method of ["get", "post", "put", "patch", "delete"]) {
      const operation = pathItem?.[method];
      if (!operation || operation.operationId) continue;
      const normalized = route
        .replace(/[{}]/g, "")
        .split("/")
        .filter(Boolean)
        .join("_")
        .replace(/[^A-Za-z0-9_]/g, "_");
      operation.operationId = `${method}_${normalized}`;
    }
  }
}

function standaloneSchema(name, schema) {
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: `https://docs.bsptest.com/schemas/webhooks/${name}.schema.json`,
    title: name,
    ...schema,
  };
}

function platformEvent(type, dataSchema) {
  return standaloneSchema(type, {
    ...schemas.PlatformEventEnvelope,
    properties: {
      ...schemas.PlatformEventEnvelope.properties,
      type: { const: type },
      data: dataSchema,
    },
  });
}

const webhookFiles = {
  message: standaloneSchema("message", schemas.WebhookMessageEvent),
  status: standaloneSchema("status", schemas.WebhookStatusEvent),
  change: standaloneSchema("change", schemas.WebhookChangeEvent),
  probe: standaloneSchema("probe", schemas.WebhookProbeEvent),
  "job-completed": platformEvent("job.completed", {
    type: "object",
    required: ["job_id", "job_kind"],
    properties: {
      job_id: { type: "string" },
      job_kind: { type: "string" },
      template_name: { type: "string" },
    },
    additionalProperties: true,
  }),
  "job-failed": platformEvent("job.failed", {
    type: "object",
    additionalProperties: true,
  }),
  "usage-updated": platformEvent("usage.updated", {
    type: "object",
    additionalProperties: true,
  }),
  "webhook-verification": platformEvent("webhook.verification", {
    type: "object",
    required: ["challenge"],
    properties: { challenge: { type: "string", pattern: "^ch_" } },
    additionalProperties: false,
  }),
};

const document = promoteNullable(await loadJson(source));
document.openapi = "3.1.0";
document.jsonSchemaDialect = "https://json-schema.org/draft/2020-12/schema";
document.info = {
  ...document.info,
  description: `${document.info?.description ?? ""}\n\n本文件由服务端公开契约同步，并在文档仓补充 Agent 可验证的消息与 Webhook Schema。`,
  "x-source": "https://api.bsptest.com/portal/openapi.json",
};
document.servers = [{ url: "https://api.bsptest.com" }];
document.components ??= {};
document.components.schemas = {
  ...(document.components.schemas ?? {}),
  ...schemas,
};
document.components.schemas.ErrorResponse = {
  type: "object",
  additionalProperties: false,
  required: ["error"],
  properties: {
    error: {
      type: "object",
      required: ["code", "message", "retryable", "httpStatus", "requestId"],
      properties: {
        code: { type: "string" },
        message: { type: "string" },
        retryable: { type: "boolean" },
        httpStatus: { type: "integer", minimum: 400, maximum: 599 },
        requestId: { type: "string" },
        details: { type: "object", additionalProperties: true },
        upstream: { type: "object", additionalProperties: true },
      },
      additionalProperties: true,
    },
  },
};
tightenGeneratedRequestSchemas(document);
patchMessageContracts(document);
addSdkMetadata(document);
document.webhooks = {
  inboundEvent: {
    post: {
      operationId: "receive_webhook_event",
      summary: "BlueMedia 向已配置端点投递事件",
      parameters: [
        {
          name: "X-Webhook-Signature-256",
          in: "header",
          required: false,
          schema: { type: "string" },
          description: "默认协议签名。",
        },
        {
          name: "Webhook-Signature",
          in: "header",
          required: false,
          schema: { type: "string" },
          description: "连接协议 v1 签名。",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/WebhookEvent" },
          },
        },
      },
      responses: {
        200: { description: "接收端确认处理。任何 2xx 都视为成功。" },
      },
    },
  },
};

await mkdir(schemaRoot, { recursive: true });
await writeFile(
  path.join(staticRoot, "openapi.json"),
  `${JSON.stringify(document, null, 2)}\n`,
);
await writeFile(
  path.join(staticRoot, "openapi.yaml"),
  toYaml(document, { lineWidth: 0 }),
);
await Promise.all(
  Object.entries(webhookFiles).map(([name, schema]) =>
    writeFile(
      path.join(schemaRoot, `${name}.schema.json`),
      `${JSON.stringify(schema, null, 2)}\n`,
    ),
  ),
);

process.stdout.write(
  `OpenAPI 已从 ${source} 同步：${Object.keys(document.paths).length} 个路径，${Object.keys(document.components.schemas).length} 个 schema\n`,
);
