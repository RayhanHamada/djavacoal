"use client";

import { useTranslations } from "next-intl";

import { FadeInView, ScaleXView, SlideInView } from "../atoms";

export default function GlobalMarketSection() {
    const t = useTranslations("AboutCompany.globalMarket");

    return (
        <section
            id="global-market"
            className="mt-2 scroll-mt-28 space-y-4 rounded-xl bg-[#222222] p-5 lg:p-10"
        >
            <header className="mb-2">
                <SlideInView yOffset={30} duration={0.6}>
                    <div className="mb-2 flex items-center gap-3">
                        <div className="h-px w-8 bg-white" />
                        <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                            {t("subtitle")}
                        </p>
                    </div>
                </SlideInView>

                <SlideInView yOffset={30} duration={0.65}>
                    <h2 className="text-xl leading-snug font-semibold text-white md:text-2xl">
                        {t("title")}
                    </h2>
                </SlideInView>

                <SlideInView yOffset={35} duration={0.7}>
                    <p className="font-medium text-[#EFA12D]">{t("tagline")}</p>
                </SlideInView>

                <ScaleXView duration={0.6}>
                    <div className="mt-4 h-px origin-left bg-[#3A3A3A]" />
                </ScaleXView>
            </header>

            <FadeInView duration={0.8}>
                <article className="space-y-5 text-justify leading-relaxed text-gray-300 lg:text-lg">
                    <p>{t("paragraph1")}</p>
                    <p>{t("paragraph2")}</p>
                    <p>{t("paragraph3")}</p>
                </article>
            </FadeInView>
        </section>
    );
}
