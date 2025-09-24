import { Locales } from "@/configs";
import { setUserLocale } from "@/utils/locale";
import { useLocale } from "next-intl";
import { useCallback } from "react";

export default function useAppLocale() {
  const locale = useLocale();

  const setLocale = useCallback(
    function (newLocale: Locales) {
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
