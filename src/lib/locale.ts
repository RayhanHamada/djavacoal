"use server";

import { cookies } from "next/headers";

import { Locale } from "next-intl";

import { COOKIE_NAME, DEFAULT_LOCALE, LOCALES } from "@/configs";

export async function getUserLocale() {
    try {
        const value = (await cookies()).get(COOKIE_NAME.LOCALE)?.value;
        console.log(`Success get locale`);

        return value || DEFAULT_LOCALE;
    } catch (error) {
        console.error("Failed to get user locale cookie:", error);
        return DEFAULT_LOCALE;
    }
}

export async function setUserLocale(locale: Locale) {
    try {
        const cookieStore = await cookies();

        cookieStore.set(COOKIE_NAME.LOCALE, locale);
    } catch (error) {
        console.error("Failed to set user locale cookie:", error);
    }
}

export async function onChangeLocale() {
    const locale = await getUserLocale();

    setUserLocale(locale === LOCALES.EN ? LOCALES.AR : LOCALES.EN);
}
