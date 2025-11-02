import "server-only";

import type { ContractRouterClient } from "@orpc/contract";
import type { JsonifiedClient } from "@orpc/openapi-client";

import { createORPCClient } from "@orpc/client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";

import { PUBLIC_API_PREFIX } from "@/adapters/public-api/constants";
import { type PublicAPIRouter, router } from "@/features/public-api/router";

const link = new OpenAPILink(router, {
    url: `${process.env.NEXT_PUBLIC_BASE_URL}${PUBLIC_API_PREFIX}`,
    fetch(request, init) {
        return globalThis.fetch(request, {
            ...init,
            credentials: "include", // Include cookies for cross-origin requests
        });
    },
});

export const publicAPIClient =
    createORPCClient<JsonifiedClient<ContractRouterClient<PublicAPIRouter>>>(
        link
    );
