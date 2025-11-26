"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

import { LOCALES, SECTIONS_ELEMENTS_ID } from "@/configs";
import { useHomeContentAPI } from "@/features/public-api/hooks";

export function PackagingOptionsSection() {
    const t = useTranslations("Home.packagingOptions");
    const { data: homeContent } = useHomeContentAPI();
    const locale = useLocale();

    return (
        <section className="relative w-full overflow-hidden bg-[url('/images/bg-packaging-option.png')] bg-cover py-16">
            {/* Section Header */}
            <div className="mb-10 flex flex-col items-start justify-center px-5 md:px-10 lg:px-60">
                <div className="flex items-center gap-3">
                    <div className="h-0.5 w-[50px] bg-[#EFA12D]" />
                    <h2 className="font-['Josefin_Sans'] text-[26px] font-bold text-white md:text-[34px] lg:text-[40px]">
                        {t("title")}{" "}
                        <span className="text-[#EFA12D]">{t("highlight")}</span>
                    </h2>
                </div>
            </div>
            <div className="flex flex-col items-center gap-0 px-5 md:grid md:grid-cols-2 md:gap-10 md:px-10 lg:flex lg:flex-row lg:justify-center lg:px-[100px]">
                {homeContent?.data.packaging_options
                    .slice(0, 3)
                    .map((option) => {
                        const name = option.type;
                        return (
                            <motion.div
                                key={option.id}
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.4 }}
                                className="group relative flex aspect-square scale-90 flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#FFFFFF30] bg-[radial-gradient(circle_at_center,#000_0%,#171717_50%,#ffffff40_100%)] shadow-[0_0_40px_#00000050] transition-all duration-500 hover:border-[#EFA12D] sm:scale-95 md:scale-100 lg:rounded-none"
                            >
                                {/* Gambar */}
                                <div className="relative flex h-full w-full items-center justify-center">
                                    <Image
                                        src={option.image_url}
                                        alt={name}
                                        width={600}
                                        height={600}
                                        className="h-full w-full scale-75 object-contain transition-transform duration-700 group-hover:scale-85"
                                    />

                                    {/* Overlay Radial Putih di Sudut */}
                                    <div className="pointer-events-none absolute inset-0" />
                                </div>

                                {/* Teks di atas tengah */}
                                <h3
                                    className="absolute top-5 font-['Josefin_Sans'] text-xl font-semibold text-white md:text-xl lg:text-2xl"
                                    dir={locale === LOCALES.AR ? "rtl" : "ltr"}
                                >
                                    <span className="text-[#EFA12D]">
                                        {option.type}
                                    </span>{" "}
                                    {t("packagingLabel")}
                                </h3>
                            </motion.div>
                        );
                    })}
            </div>
            {/* Tombol View Details */}
            <div className="mt-12 flex justify-center">
                <Link
                    href={`/production-info#${SECTIONS_ELEMENTS_ID.PRODUCTION_INFO.PACKAGING_INFO}`}
                    className="font-['Open_Sans'] text-[15px] font-semibold text-[#EFA12D] italic underline-offset-4 hover:underline md:text-[16px]"
                >
                    {t("viewDetails")}
                </Link>
            </div>
            <div className="absolute bottom-0 left-0 h-px w-full bg-[#EFA12D]" />
        </section>
    );
}
