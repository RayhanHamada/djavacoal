import "server-only";

import { RPCHandler } from "@orpc/server/fetch";

import { router as admins } from "@/features/admin-auth/server/router";

const router = {
  /**
   * Add your RPC methods here
   */
  admins,
};

const handler = new RPCHandler(router);
export default async function getHandler(request: Request) {
  return handler.handle(request, {
    prefix: "/api/rpc",
  });
}

export type Router = typeof router;
