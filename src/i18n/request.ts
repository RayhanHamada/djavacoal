import { cookies } from "next/headers";

import { Locale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
    const store = await cookies();
    const locale = (store.get("locale")?.value ?? "en") as Locale;

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
    };
});
