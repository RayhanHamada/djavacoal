import "server-only";

import { onError, ORPCError } from "@orpc/client";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ValidationError } from "@orpc/server";
import { CORSPlugin } from "@orpc/server/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { z } from "zod";

import { PUBLIC_API_PREFIX } from "@/adapters/public-api/constants";
import { router } from "@/features/public-api/router";

const origin = new URL(process.env.NEXT_PUBLIC_BASE_URL).hostname;

const handler = new OpenAPIHandler(router, {
    clientInterceptors: [
        onError(async function (error) {
            console.log(error);
            /**
             * skip check if not ORPCError or not ValidationError
             */
            if (!(error instanceof ORPCError)) return;
            if (!(error.cause instanceof ValidationError)) return;

            /**
             * convert to ZodError for better formatting
             */
            const zodError = new z.ZodError(
                error.cause.issues as z.core.$ZodIssue[]
            );
            const errorCode = error.code;
            const message = z.prettifyError(zodError);
            const data = z.flattenError(zodError);
            const cause = error.cause;

            const map = {
                BAD_REQUEST: {
                    code: "INPUT_VALIDATION_ERROR",
                    status: 422,
                },
                INTERNAL_SERVER_ERROR: {
                    code: "OUTPUT_VALIDATION_ERROR",
                    status: 500,
                },
            } as const;

            const m = map[errorCode as keyof typeof map];
            const err = m
                ? new ORPCError(m.code, {
                      status: m.status,
                      message,
                      data,
                      cause,
                  })
                : null;

            if (err) throw err;
        }),
    ],
    plugins: [
        new OpenAPIReferencePlugin({
            docsTitle: "Djavacoal API Docs",
            schemaConverters: [new ZodToJsonSchemaConverter()],
            specGenerateOptions: {
                info: {
                    title: "Public Djavacoal API",
                    version: "1.0.0",
                },
            },
        }),
        new CORSPlugin({
            origin: [`https://${origin}`, `https://www.${origin}`],
        }),
    ],
});

export async function getHandler(request: Request) {
    return handler.handle(request, {
        prefix: PUBLIC_API_PREFIX,
    });
}

export { _publicApiClient as serverPublicAPIClient } from "@/adapters/public-api/api-client";
