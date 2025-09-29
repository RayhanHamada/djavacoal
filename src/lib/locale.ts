"use server";

import { cookies } from "next/headers";
import { COOKIE_NAME, DEFAULT_LOCALE, LOCALES } from "@/configs";
import { Locale } from "next-intl";

export async function getUserLocale() {
  return (await cookies()).get(COOKIE_NAME.LOCALE)?.value || DEFAULT_LOCALE;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME.LOCALE, locale);
}

export async function onChangeLocale() {
  const locale = await getUserLocale();

  setUserLocale(locale === LOCALES.EN ? LOCALES.AR : LOCALES.EN);
}
