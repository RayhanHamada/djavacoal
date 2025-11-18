"use client";

import Image from "next/image";

import { useTranslations } from "next-intl";

import { BANNER_IMAGE } from "../../lib/constants";

interface HeaderSectionProps {
    title?: string;
    backgroundImage?: string;
}

export default function HeaderSection({
    title,
    backgroundImage = BANNER_IMAGE,
}: HeaderSectionProps) {
    const t = useTranslations("AboutCompany.header");

    const displayTitle = title ?? t("title");

    return (
        <section className="relative w-full overflow-hidden bg-[#1C1C1C] text-white">
            <div className="relative h-48 w-full md:h-72">
                <Image
                    src={backgroundImage}
                    alt={t("bannerAlt")}
                    fill
                    className="object-cover object-center"
                    priority
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <h1 className="text-2xl font-semibold italic md:text-4xl">
                        {displayTitle}
                    </h1>
                </div>
            </div>
            {/* 🔹 Garis bawah */}
            <div className="absolute bottom-0 left-0 h-[1px] w-full bg-[#474747]" />
        </section>
    );
}
