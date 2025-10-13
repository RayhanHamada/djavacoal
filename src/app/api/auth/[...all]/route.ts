import { getAuth } from "@/features/admin-auth/lib/better-auth-server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler({
  async handler(request) {
    const { env } = await getCloudflareContext({ async: true });
    return getAuth(env.DJAVACOAL_DB).handler(request);
  },
});
