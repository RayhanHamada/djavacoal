"use client";

import { setUserLocale } from "@/lib/locale";
import { Locale, useLocale } from "next-intl";
import { useCallback } from "react";

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
