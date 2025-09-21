"use server";

import { cookies } from "next/headers";
import { COOKIE_NAME, DEFAULT_LOCALE } from "@/configs";
import { Locale } from "next-intl";

export async function getUserLocale() {
  return (await cookies()).get(COOKIE_NAME.LOCALE)?.value || DEFAULT_LOCALE;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME.LOCALE, locale);
}
