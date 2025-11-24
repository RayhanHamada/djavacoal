"use client";
import { useEffect, useMemo, useState } from "react";

import Image from "next/image";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { SECTIONS_ELEMENTS_ID } from "@/configs";

interface StepCardProps {
    image: string;
    title: string;
    description: string;
}

function StepCard({ image, title, description }: StepCardProps) {
    return (
        <div className="flex flex-col justify-start rounded-xl bg-[#222222] transition-transform duration-300 hover:-translate-y-1">
            {/* Gambar dengan watermark di tengah atas + gradasi hitam tipis */}
            <div className="relative mb-4 w-full overflow-hidden rounded-xl">
                {/* Gambar utama */}
                <Image
                    src={image}
                    alt={title}
                    width={500}
                    height={500}
                    className="h-auto w-full rounded-xl object-cover"
                />

                {/* Gradasi hitam tipis di bagian atas */}
                <div className="absolute top-0 left-0 z-10 h-1/3 w-full rounded-t-xl bg-linear-to-b from-black/70 to-transparent" />

                {/* Logo watermark di tengah atas */}
                <div className="absolute top-3 left-1/2 z-20 -translate-x-1/2">
                    <Image
                        src="/svgs/logo.svg"
                        alt="Djavacoal Watermark"
                        width={130}
                        height={60}
                        className="object-contain opacity-85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
                    />
                </div>
            </div>

            {/* Konten teks */}
            <h3 className="mb-1 text-sm font-semibold text-white">{title}</h3>
            <p className="text-sm leading-relaxed text-[#CCCCCC]">
                {description}
            </p>
        </div>
    );
}

export default function ProcessSection() {
    const t = useTranslations("ProductionInfo.process");
    const [isMd, setIsMd] = useState(false);

    // Deteksi ukuran layar real-time
    useEffect(() => {
        const handleResize = () => setIsMd(window.innerWidth >= 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const steps = useMemo(
        () => [
            {
                image: "/images/Step1.png",
                title: t("steps.step1.title"),
                description: t("steps.step1.description"),
            },
            {
                image: "/images/Step2.png",
                title: t("steps.step2.title"),
                description: t("steps.step2.description"),
            },
            {
                image: "/images/Step3.png",
                title: t("steps.step3.title"),
                description: t("steps.step3.description"),
            },
            {
                image: "/images/Step4.png",
                title: t("steps.step4.title"),
                description: t("steps.step4.description"),
            },
            {
                image: "/images/Step5.png",
                title: t("steps.step5.title"),
                description: t("steps.step5.description"),
            },
            {
                image: "/images/Step6.png",
                title: t("steps.step6.title"),
                description: t("steps.step6.description"),
            },
            {
                image: "/images/Step7.png",
                title: t("steps.step7.title"),
                description: t("steps.step7.description"),
            },
            {
                image: "/images/Step8.png",
                title: t("steps.step8.title"),
                description: t("steps.step8.description"),
            },
            {
                image: "/images/Step9.png",
                title: t("steps.step9.title"),
                description: t("steps.step9.description"),
            },
        ],
        [t]
    );

    const itemsPerRow = isMd ? 3 : 2;
    const rows = Array.from({ length: Math.ceil(steps.length / itemsPerRow) });

    return (
        <section
            id={SECTIONS_ELEMENTS_ID.PRODUCTION_INFO.PRODUCTION_PROCESS}
            className="mt-2 scroll-mt-28 space-y-4 rounded-xl bg-[#222222] p-5 lg:p-10"
        >
            {/* Header */}
            <header className="mb-2">
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

            {/* Grid adaptif */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
            >
                {rows.map((_, rowIndex) => {
                    const start = rowIndex * itemsPerRow;
                    const group = steps.slice(start, start + itemsPerRow);

                    return (
                        <div
                            key={rowIndex}
                            className={`grid grid-cols-2 gap-3 py-6 md:grid-cols-3 ${
                                rowIndex !== rows.length - 1
                                    ? "border-b border-[#3A3A3A]"
                                    : ""
                            }`}
                        >
                            {group.map((step, index) => (
                                <StepCard
                                    key={index}
                                    image={step.image}
                                    title={step.title}
                                    description={step.description}
                                />
                            ))}
                        </div>
                    );
                })}
            </motion.div>
        </section>
    );
}
