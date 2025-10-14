import type { Router } from "@/adapters/rpc";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

const link = new RPCLink({
  url: `${process.env.NEXT_PUBLIC_BASE_URL}api/rpc`,
});

export const client: RouterClient<Router> = createORPCClient(link);
export const rpc = createTanstackQueryUtils(client);
