import "server-only";

import { cookies } from "next/headers";

import { Locale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { COOKIE_NAME, DEFAULT_LOCALE } from "@/configs";

export default getRequestConfig(async () => {
    const store = await cookies();
    const locale = (store.get(COOKIE_NAME.LOCALE)?.value ??
        DEFAULT_LOCALE) as Locale;

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
    };
});
