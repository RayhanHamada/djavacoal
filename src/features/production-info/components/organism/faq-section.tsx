import { headers } from "next/headers";
import Image from "next/image";

import { getTranslations } from "next-intl/server";

import { FAQClientWrapper } from "./faq-section-client";
import { serverPublicAPIClient } from "@/adapters/public-api/server";
import { SECTIONS_ELEMENTS_ID } from "@/configs";

export default async function FAQSection() {
    const t = await getTranslations("ProductionInfo.faq");

    // Fetch FAQs from public API
    const { data: faqsResponse } = await serverPublicAPIClient.GET("/faqs", {
        headers: await headers(),
    });

    const faqs =
        faqsResponse?.data.faqs.map((faq) => ({
            id: faq.id,
            q: faq.question,
            a: faq.answer,
            order_index: faq.order_index,
        })) ?? [];

    return (
        <section
            id={SECTIONS_ELEMENTS_ID.PRODUCTION_INFO.FAQS}
            className="scroll-mt-28 rounded-xl bg-[#222222]"
        >
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

            {/* FAQ List - Client Component for interactivity */}
            <FAQClientWrapper faqs={faqs} />

            {/* Watermark */}
            <div className="flex justify-center pb-6">
                <Image
                    src="/svgs/logo.svg"
                    alt="Djavacoal Watermark"
                    width={100}
                    height={40}
                    className="opacity-85"
                />
            </div>
        </section>
    );
}
