import "server-only";

import { RPCHandler } from "@orpc/server/fetch";

import { router as admins } from "@/features/admin-auth/server/router";
import { router as gallery } from "@/features/gallery/server/router";

const router = {
    /**
     * Add your RPC methods here
     */
    admins,
    gallery,
};

const handler = new RPCHandler(router);
export default async function getHandler(request: Request) {
    return handler
        .handle(request, {
            prefix: "/api/rpc",
        })
        .catch((error) => {
            console.error("RPC Handler Error:", error);

            return;
        });
}

export type Router = typeof router;
