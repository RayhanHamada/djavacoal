import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";

export const API_PREFIX = "/api";

export const plugins = [
  new OpenAPIReferencePlugin({
    docsTitle: "Djavacoal API",
    schemaConverters: [new ZodToJsonSchemaConverter()],
    specGenerateOptions: {
      info: {
        title: "Djavacoal API",
        version: "1.0.0",
      },
      security: [{ bearerAuth: [] }],
      components: {
        securitySchemes: {
          bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        },
      },
    },
  }),
];
