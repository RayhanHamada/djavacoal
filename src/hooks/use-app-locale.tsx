"use client";

import { useCallback } from "react";

import { Locale, useLocale } from "next-intl";

import { setUserLocale } from "@/lib/locale";

export default function useAppLocale() {
    const locale = useLocale();

    const setLocale = useCallback(
        function (newLocale: Locale) {
            if (newLocale === locale) return;

            setUserLocale(newLocale);
        },
        [locale]
    );

    return {
        locale,
        setLocale,
    };
}
