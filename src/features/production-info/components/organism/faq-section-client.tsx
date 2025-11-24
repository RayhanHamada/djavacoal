"use client";

import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface FAQ {
    id: number;
    q: string;
    a: string;
    order_index: number;
}

interface FAQClientWrapperProps {
    faqs: FAQ[];
}

function FAQItem({
    q,
    a,
    open,
    onClick,
}: {
    q: string;
    a: string;
    open: boolean;
    onClick: () => void;
}) {
    return (
        <div className="overflow-hidden rounded-md border border-[#4A4A4A] transition-all duration-300">
            {/* Question */}
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

            {/* Answer with animation */}
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
                        <div
                            className="px-4 pt-2 pb-4 text-sm leading-relaxed text-[#EAEAEA] md:text-base"
                            dangerouslySetInnerHTML={{ __html: a }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function FAQClientWrapper({ faqs }: FAQClientWrapperProps) {
    const t = useTranslations("ProductionInfo.faq");
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    if (faqs.length === 0) {
        return (
            <div className="px-4 pb-8 md:px-6">
                <p className="text-center text-[#CCCCCC]">
                    {t("noFaqsAvailable")}
                </p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-3 px-5 pb-8 md:px-10 lg:flex-row lg:flex-wrap"
        >
            {faqs.map((faq, index) => (
                <div key={faq.id} className="min-w-[48%] flex-1">
                    <FAQItem
                        q={faq.q}
                        a={faq.a}
                        open={activeIndex === index}
                        onClick={() =>
                            setActiveIndex(activeIndex === index ? null : index)
                        }
                    />
                </div>
            ))}
        </motion.div>
    );
}
