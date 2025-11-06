import { cookies } from "next/headers";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { os } from "@orpc/server";
import { Locale } from "next-intl";

import { COOKIE_NAME, LOCALES } from "@/configs";

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
    const cookie = await cookies();
    const locale = (cookie.get(COOKIE_NAME.LOCALE)?.value ||
        LOCALES.EN) as Locale;

    return next({
        context: {
            ...context,
            cookie,
            locale,
        },
    });
});
