import { cookies } from "next/headers";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { os } from "@orpc/server";

export const injectCFContext = os.middleware(async function ({
    context,
    next,
}) {
    const cfCtx = await getCloudflareContext({ async: true });

    return next({
        context: {
            ...context,
            ...cfCtx,
        },
    });
});

export const injectNextCookies = os.middleware(async function ({
    context,
    next,
}) {
    return next({
        context: {
            ...context,
            cookies: await cookies(),
        },
    });
});
