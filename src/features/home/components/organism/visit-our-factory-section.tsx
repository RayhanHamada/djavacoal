"use client";

import Image from "next/image";
import Link from "next/link";

import { useTranslations } from "next-intl";

import { useHomeContentAPI } from "@/features/public-api/hooks";

export function VisitOurFactorySection() {
    const t = useTranslations("Home.visitFactory");
    const { data: homeContentData } = useHomeContentAPI();
    const whatsappLink = new URL(
        `https://wa.me/${homeContentData?.data.whatsapp_number}?text=${encodeURIComponent(t("whatsappMessage"))}`
    );

    return (
        <section className="relative w-full overflow-hidden bg-[#1D1D1D] text-center text-white">
            {/* ==== Title di atas gambar ==== */}
            <div className="bg-[#1D1D1D] pt-12 pb-6 md:pt-16 md:pb-8">
                <h2 className="font-['Josefin_Sans'] text-[28px] font-bold tracking-wide uppercase md:text-[36px] lg:text-[44px]">
                    {t("title")}{" "}
                    <span className="text-[#EFA12D]">{t("highlight")}</span>
                </h2>
            </div>

            {/* ==== Full-width Image ==== */}
            <div className="relative h-[380px] w-full md:h-[500px] lg:h-[580px]">
                {homeContentData?.data.visit_our_factory_photo && (
                    <Image
                        src={homeContentData.data.visit_our_factory_photo}
                        alt={t("imageAlt")}
                        fill
                        priority
                        className="object-cover object-center pt-6"
                    />
                )}
                {/* Overlay optional, biar kontras sedikit */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#00000040] to-transparent" />
            </div>

            {/* ==== Description & Button di bawah gambar ==== */}
            <div className="mx-auto max-w-3xl px-6 pt-10 pb-16 text-[#C6C6C6]">
                <p className="mb-8 text-[15px] leading-relaxed md:text-[16px]">
                    {t("description")}
                </p>

                <Link
                    href={whatsappLink.toString()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-button-whatsapp container mx-auto inline-flex h-[54px] w-[271px] items-center justify-center gap-3 rounded-lg px-6 font-['Open_Sans'] text-[14px] font-semibold text-white transition-all hover:bg-[#1EBE5B] md:h-[54px] md:w-[360px] md:text-[15px] lg:h-[54px] lg:w-[500px]"
                >
                    <span>{t("cta")}</span>
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"
                            fill="currentColor"
                        />
                    </svg>
                </Link>
            </div>
        </section>
    );
}
