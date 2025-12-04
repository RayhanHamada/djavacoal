"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { SECTIONS_ELEMENTS_ID } from "@/configs";

const productionItems = [
    {
        id: "process",
        titleKey: "process",
        image: "/images/home-production-info1.png",
        href: `/production-info#${SECTIONS_ELEMENTS_ID.PRODUCTION_INFO.PRODUCTION_PROCESS}`,
    },
    {
        id: "payment",
        titleKey: "payment",
        image: "/images/home-production-info2.png",
        href: `/production-info#${SECTIONS_ELEMENTS_ID.PRODUCTION_INFO.MOQ_PAYMENT_TERMS}`,
    },
    {
        id: "shipment",
        titleKey: "shipment",
        image: "/images/home-production-info3.png",
        href: `/production-info#${SECTIONS_ELEMENTS_ID.PRODUCTION_INFO.SHIPMENT_TERMS}`,
    },
    {
        id: "packaging",
        titleKey: "packaging",
        image: "/images/home-production-info44.png",
        href: `/production-info#${SECTIONS_ELEMENTS_ID.PRODUCTION_INFO.PACKAGING_INFO}`,
    },
];

export function ProductionInfoSection() {
    const t = useTranslations("Home.productionInfo");
    return (
        <section className="bg-primary border-t-secondary border-b-secondary relative w-full border py-16 md:py-20 lg:py-24">
            {/* 🔹 Section Header */}
            <div className="mb-10 flex flex-col items-start justify-center px-5 md:items-start md:px-[60px] lg:px-60">
                <div className="flex items-center gap-3">
                    <div className="h-0.5 w-[50px] bg-[#EFA12D]" />
                    <h2 className="font-['Josefin_Sans'] text-[26px] font-bold text-white md:text-[34px] lg:text-[40px]">
                        {t("title")}{" "}
                        <span className="text-[#EFA12D]">{t("highlight")}</span>
                    </h2>
                </div>
            </div>

            {/* 🔸 Grid Images */}
            <div className="grid grid-cols-2 lg:grid-cols-4 lg:gap-3 lg:px-[100px]">
                {productionItems.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="group relative cursor-pointer overflow-hidden"
                    >
                        {/* Gambar */}
                        <Link href={item.href}>
                            <div className="relative h-[205.5px] w-full md:h-96 lg:h-[422.5px]">
                                <Image
                                    src={item.image}
                                    alt={t(`items.${item.titleKey}` as any)}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Overlay gelap */}
                                <div className="absolute inset-0 bg-black/40 transition-all duration-500 group-hover:bg-black/20" />
                                {/* Judul di bawah */}
                                <div className="absolute bottom-4 left-0 w-full text-center">
                                    <p className="font-['Open_Sans'] text-[13px] font-semibold text-white md:text-[15px]">
                                        {t(`items.${item.titleKey}` as any)}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
