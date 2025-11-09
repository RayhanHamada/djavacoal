"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { FaWhatsapp } from "react-icons/fa";

import { FadeInView, ScaleXView, SlideInView } from "../atoms";
import { useAboutCompanyContentAPI } from "@/features/public-api/hooks";

export default function FactorySection() {
    const t = useTranslations("AboutCompany.factory");
    const { data } = useAboutCompanyContentAPI();

    return (
        <section
            id="factory"
            className="mt-10 scroll-mt-28 space-y-6 rounded-xl bg-[#222222] p-5 lg:p-10"
        >
            <header className="mb-2 pt-4">
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
                    <p className="font-medium text-[#EFA12D]">
                        {t("tagline")}
                    </p>
                </SlideInView>

                <ScaleXView duration={0.6}>
                    <div className="mt-4 h-px origin-left bg-[#3A3A3A]" />
                </ScaleXView>
            </header>

            <FadeInView duration={0.5}>
                <div className="relative h-56 w-full overflow-hidden rounded-md sm:h-72 md:h-80 lg:h-[520px] lg:max-w-3/4">
                    {data?.data.our_factory_photo && (
                        <Image
                            src={data?.data.our_factory_photo ?? ""}
                            alt={t("imageAlt")}
                            fill
                            className="rounded-md object-cover"
                            priority
                            sizes="(max-width: 1024px) 100vw, 850px"
                        />
                    )}
                </div>
            </FadeInView>

            <SlideInView yOffset={30} duration={0.55}>
                <article className="space-y-4 text-justify text-sm leading-relaxed text-gray-300 md:text-base">
                    <p>{t("description")}</p>
                </article>
            </SlideInView>

            <div className="mt-4 flex">
                <Link
                    href="https://wa.me/628xxxxxxx"
                    target="_blank"
                    className="bg-button-whatsapp flex h-16 w-full items-center justify-center gap-2 rounded-md font-semibold text-white transition hover:bg-[#25d366] md:w-[325px] lg:w-[325px]"
                >
                    <span>{t("scheduleVisit")}</span>
                    <FaWhatsapp className="text-lg" />
                </Link>
            </div>
        </section>
    );
}
