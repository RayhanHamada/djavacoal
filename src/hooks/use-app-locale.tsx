"use client";

import { useCallback } from "react";

import { Locale, useLocale } from "next-intl";

import { setUserLocale } from "@/lib/locale";

export default function useAppLocale() {
    const locale = useLocale();

    const setLocale = useCallback(
        async function (newLocale: Locale) {
            if (newLocale === locale) return;

            await setUserLocale(newLocale);
        },
        [locale]
    );

    return {
        locale,
        setLocale,
    };
}
