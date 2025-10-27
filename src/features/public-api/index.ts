import { getCloudflareContext } from "@opennextjs/cloudflare";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";

import { router } from "@/features/public-api/server/router";

const handler = new OpenAPIHandler(router, {
    plugins: [
        new OpenAPIReferencePlugin({
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

export async function handleRequest(request: Request) {
    const { env } = await getCloudflareContext({ async: true });
    const { response } = await handler.handle(request, {
        prefix: "/api/public",
        context: {
            env,
        },
    });

    return response ?? new Response("Not found", { status: 404 });
}
