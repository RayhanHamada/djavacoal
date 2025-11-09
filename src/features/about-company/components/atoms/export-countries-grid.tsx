"use client";

import Image from "next/image";

import { useTranslations } from "next-intl";

import { EXPORT_COUNTRIES } from "../../lib/constants";

export default function ExportCountriesGrid() {
    const t = useTranslations("AboutCompany.exportCountries");

    return (
        <div className="space-y-4 py-4">
            <h3 className="text-lg font-semibold">{t("title")}</h3>
            <p className="text-sm leading-relaxed text-gray-300">
                {t("description")}
            </p>

            {/* Flags Grid */}
            <div className="flex flex-wrap gap-3 rounded-md pt-2">
                {EXPORT_COUNTRIES.map((code) => (
                    <div
                        key={code}
                        className="relative aspect-video h-8 overflow-hidden rounded-sm transition-all lg:h-16"
                    >
                        <Image
                            src={`https://flagsapi.com/${code}/flat/64.png`}
                            alt={t("flagAlt", { code })}
                            fill
                            sizes="(max-width: 768px) 2rem, 4rem"
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
