"use client";

import { cn } from "@/lib/utils";
import ukLogo from "@/../public/svgs/uk_flag.svg";
import arLogo from "@/../public/svgs/saudi_arabia_flag.svg";
import Image from "next/image";
import { useAppLocale } from "@/hooks";
import { LOCALES } from "@/configs";
import { Locale } from "next-intl";
import { Fragment } from "react";

export function LanguageSwitch() {
  const { locale, setLocale } = useAppLocale();

  function handleChangeLocale(newLocale: Locale) {
    setLocale(newLocale);
  }

  const locales = [
    { code: LOCALES.EN, label: LOCALES.EN, logo: ukLogo },
    { code: LOCALES.AR, label: LOCALES.AR, logo: arLogo },
  ];

  return (
    <div
      className={cn(
        "flex flex-col gap-y-2 items-center gap-x-2", //
        "md:flex-row md:justify-center"
      )}
    >
      {locales.map(({ code, label, logo }, index) => (
        <Fragment key={code}>
          <button
            onClick={() => handleChangeLocale(code)}
            className="flex gap-x-1 hover:cursor-pointer group hover:underline"
          >
            <Image src={logo} alt={label} width={20} height={20} />
            <span
              className={cn(
                "text-sm group-hover:underline uppercase font-bold",
                locale === code ? "text-secondary" : "text-white"
              )}
            >
              {label}
            </span>
          </button>
          {index < locales.length - 1 && <span className="text-white">|</span>}
        </Fragment>
      ))}
    </div>
  );
}
