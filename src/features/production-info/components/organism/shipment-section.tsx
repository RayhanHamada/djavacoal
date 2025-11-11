"use client";
import Image from "next/image";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { SECTIONS_ELEMENTS_ID } from "@/configs";

export default function ShipmentSection() {
    const t = useTranslations("ProductionInfo.shipment");

    return (
        <section
            id={SECTIONS_ELEMENTS_ID.PRODUCTION_INFO.SHIPMENT_TERMS}
            className="scroll-mt-28 rounded-xl bg-[#222222]"
        >
            {/* Header */}
            <header className="mb-4 px-4 pt-4 md:px-6">
                <div className="mb-2 flex items-center gap-3">
                    <div className="h-px w-8 bg-white" />
                    <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                        {t("subtitle")}
                    </p>
                </div>
                <h2 className="text-xl leading-snug font-semibold text-white md:text-2xl">
                    {t("title")}
                </h2>
                <div className="mt-4 h-px bg-[#3A3A3A]" />
            </header>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-start gap-6 px-4 pb-6 md:grid md:grid-cols-[minmax(0,309px)_1fr] md:gap-6 md:px-6 lg:grid-cols-[minmax(0,500px)_1fr] lg:gap-8"
            >
                {/* LEFT: IMAGE */}
                <div className="relative h-72 w-full overflow-hidden rounded-lg md:aspect-4/3 md:max-h-[350px] lg:aspect-square lg:h-auto lg:max-h-[500px] lg:max-w-[500px]">
                    <Image
                        src="/images/shipment.png"
                        alt={t("imageAlt")}
                        fill
                        className="rounded-lg object-cover"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute top-0 left-0 z-10 h-1/3 w-full rounded-t-lg bg-linear-to-b from-black/80 to-transparent" />

                    {/* Watermark logo */}
                    <div className="absolute top-3 left-1/2 z-20 -translate-x-1/2">
                        <Image
                            src="/svgs/logo.svg"
                            alt="Djavacoal Watermark"
                            width={140}
                            height={60}
                            className="object-contain opacity-80"
                        />
                    </div>
                </div>

                {/* RIGHT: TEXT */}
                <div className="w-full text-sm leading-relaxed text-[#CCCCCC] md:text-base">
                    <h3 className="mb-2 font-semibold text-white">
                        <span>{t("methodTitle")}</span>{" "}
                        <span className="text-[#EFA12D]">
                            {t("methodSubtitle")}
                        </span>
                    </h3>

                    <p>
                        {t("descriptionPart1")}{" "}
                        <strong className="font-semibold">
                            {t("fobBold")}
                        </strong>{" "}
                        {t("descriptionPart2")}{" "}
                        <strong className="font-semibold">
                            {t("preparingBold")}
                        </strong>
                        {t("descriptionPart3")}{" "}
                        <strong className="font-semibold">
                            {t("portBold")}
                        </strong>
                        {t("descriptionPart4")}
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
