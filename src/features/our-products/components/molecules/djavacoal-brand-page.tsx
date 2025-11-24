"use client";

import Image from "next/image";

import { useTranslations } from "next-intl";

import { CardBrand } from "../atoms/card-brand";

export function DjavacoalBrandPage() {
    const t = useTranslations("DjavacoalBrand");
    return (
        <div className="space-y-12 rounded-xl py-0 lg:bg-[#222222] lg:px-10">
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-5">
                    <span className="flex items-center gap-3">
                        <Image
                            src={"/images/logo-mini.png"}
                            alt={t("logoAlt")}
                            width={72}
                            height={46}
                            className="h-[46px] w-auto object-contain"
                        />
                        <h1 className="text-[46px] font-bold text-white">
                            <span className="text-secondary">{t("title")}</span>{" "}
                            {t("titleHighlight")}
                        </h1>
                    </span>
                    <div className="h-px w-full bg-[#393939]" />
                    <div className="flex flex-col items-start justify-start gap-5 py-6">
                        <h2 className="text-2xl font-bold text-white">
                            {t("descriptionTitle")}
                        </h2>
                        <p className="text-l text-justify text-white">
                            {t("description.intro")} <b>Djavacoal Indonesia</b>
                            {t("description.intro2")}
                            <span className="text-secondary font-bold">
                                {" "}
                                {t("description.brandName")}
                            </span>
                            {t("description.intro2")}{" "}
                            <span className="text-secondary font-bold">
                                {" "}
                                {t("description.brandName")}
                            </span>{" "}
                            {t("description.qualityStart")}{" "}
                            {t("description.partnership")}{" "}
                            {t("description.conclusion")}
                        </p>
                    </div>
                    <div className="h-px w-full bg-[#393939]" />
                    <div className="flex flex-col items-start justify-start gap-5 py-6">
                        <CardBrand />
                    </div>
                </div>
            </div>
        </div>
    );
}
