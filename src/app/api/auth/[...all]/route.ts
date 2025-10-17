import { getCloudflareContext } from "@opennextjs/cloudflare";
import { toNextJsHandler } from "better-auth/next-js";

import { getAuth } from "@/features/admin-auth/lib/better-auth-server";

export const { GET, POST } = toNextJsHandler({
    async handler(request) {
        const { env } = await getCloudflareContext({ async: true });
        return getAuth(env).handler(request);
    },
});
