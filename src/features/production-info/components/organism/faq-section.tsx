"use client";
import { useMemo, useState } from "react";

import Image from "next/image";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

function FAQItem({
    q,
    a,
    open,
    onClick,
    children,
}: {
    q: string;
    a: string;
    open: boolean;
    onClick: () => void;
    children?: React.ReactNode;
}) {
    return (
        <div className="overflow-hidden rounded-md border border-[#4A4A4A] transition-all duration-300">
            {/* Pertanyaan */}
            <button
                onClick={onClick}
                className={`flex h-16 w-full items-center justify-between px-4 py-3 text-left transition-colors duration-300 ${
                    open ? "bg-[#6C694E]" : "bg-[#333D43] hover:bg-[#6C694E]"
                }`}
                aria-expanded={open}
            >
                <span className="text-sm font-semibold text-white md:text-base">
                    {q}
                </span>
                <span
                    className={`text-lg font-bold transition-transform duration-300 ${
                        open ? "rotate-90 text-white" : "text-[#FFFFFF]"
                    }`}
                >
                    {open ? "−" : "+"}
                </span>
            </button>

            {/* Jawaban dengan animasi */}
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-[#2B2B2B] bg-[#35362D]"
                    >
                        <div className="px-4 pt-2 pb-4 text-sm leading-relaxed text-[#EAEAEA] md:text-base">
                            {children ? children : <p>{a}</p>}
                            <div className="mt-3 flex justify-center">
                                <Image
                                    src="/svgs/logo.svg"
                                    alt="Djavacoal Watermark"
                                    width={100}
                                    height={40}
                                    className="opacity-85"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FAQSection() {
    const t = useTranslations("ProductionInfo.faq");
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const faqs = useMemo(
        () => [
            { q: t("items.q1.question"), a: t("items.q1.answer") },
            { q: t("items.q2.question"), a: t("items.q2.answer") },
            { q: t("items.q3.question"), a: t("items.q3.answer") },
            { q: t("items.q4.question"), a: t("items.q4.answer") },
            { q: t("items.q5.question"), a: t("items.q5.answer") },
            { q: t("items.q6.question"), a: t("items.q6.answer") },
            { q: t("items.q7.question"), a: t("items.q7.answer") },
            { q: t("items.q8.question"), a: t("items.q8.answer") },
            { q: t("items.q9.question"), a: t("items.q9.answer") },
            { q: t("items.q10.question"), a: t("items.q10.answer") },
            { q: t("items.q11.question"), a: t("items.q11.answer") },
            { q: t("items.q12.question"), a: t("items.q12.answer") },
            { q: t("items.q13.question"), a: t("items.q13.answer") },
            {
                q: t("items.q14.question"),
                a: t("items.q14.answer"),
                hasPortList: true,
            },
        ],
        [t]
    );

    const portKeys = [
        "portKlang",
        "jeddah",
        "portSaid",
        "barcelona",
        "rotterdam",
        "hamburg",
        "antwerp",
        "gdynia",
        "stPetersburg",
        "novorossiysk",
        "losAngeles",
        "newYork",
        "melbourne",
    ];

    return (
        <section id="faq" className="scroll-mt-28 rounded-xl bg-[#222222]">
            {/* Header */}
            <header className="mb-6 px-6 pt-4">
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

            {/* FAQ List */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-3 px-4 pb-8 md:px-6 lg:flex-row lg:flex-wrap"
            >
                {faqs.map((faq, index) => (
                    <div key={index} className="min-w-[48%] flex-1">
                        <FAQItem
                            q={faq.q}
                            a={faq.a}
                            open={activeIndex === index}
                            onClick={() =>
                                setActiveIndex(
                                    activeIndex === index ? null : index
                                )
                            }
                        >
                            {faq.hasPortList ? (
                                <>
                                    <p>{faq.a}</p>
                                    <p className="mt-2">
                                        {t("items.q14.transitTitle")}
                                    </p>
                                    <ul className="mt-2 ml-6 list-disc space-y-1">
                                        {portKeys.map((key) => (
                                            <li key={key}>
                                                {t(
                                                    `items.q14.ports.${key}` as never
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : null}
                        </FAQItem>
                    </div>
                ))}
            </motion.div>
        </section>
    );
}
