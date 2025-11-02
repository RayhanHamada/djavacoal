import "server-only";

import { onError, ORPCError } from "@orpc/client";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ValidationError } from "@orpc/server";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { z } from "zod";

import { PUBLIC_API_PREFIX } from "@/adapters/public-api/constants";
import { router } from "@/features/public-api/router";

const handler = new OpenAPIHandler(router, {
    interceptors: [
        onError(async function (error) {
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

            /**
             * assumes BAD_REQUEST is input validation error
             */
            if (errorCode === "BAD_REQUEST") {
                throw new ORPCError("INPUT_VALIDATION_ERROR", {
                    status: 422,
                    message,
                    data,
                    cause,
                });
            }

            /**
             * assumes INTERNAL_SERVER_ERROR is output validation error
             */
            if (errorCode === "INTERNAL_SERVER_ERROR") {
                throw new ORPCError("OUTPUT_VALIDATION_ERROR", {
                    status: 500,
                    message,
                    data,
                    cause,
                });
            }

            console.log(error);
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
    ],
});

export async function getHandler(request: Request) {
    return handler
        .handle(request, {
            prefix: PUBLIC_API_PREFIX,
        })
        .catch((error) => {
            console.error("Public API Handler Error:", error);

            return {
                response: undefined,
                matched: false,
            };
        });
}

export { _publicApiClient as serverPublicAPIClient } from "@/adapters/public-api/api-client";
