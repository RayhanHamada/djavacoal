"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { useTranslations } from "next-intl";

export function AboutUsSection() {
    const t = useTranslations("Home.aboutUs");
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section className="w-full bg-[#151515] px-[20px] py-16 md:px-[40px] md:py-20 lg:px-[100px] lg:py-24">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
                {/* ✅ RIGHT: Video / Image (pindah ke atas di mobile & tablet) */}
                <div className="relative order-1 w-full overflow-hidden rounded-[16px] border border-[#FFFFFF20] bg-[#1A1A1A] shadow-lg lg:order-2 lg:w-1/2">
                    {/* 🎬 Thumbnail (belum play) */}
                    {!isPlaying ? (
                        <>
                            <Image
                                src="/images/hero-carousel-1.png"
                                alt={t("companyProfile")}
                                width={1280}
                                height={720}
                                className="h-[240px] w-full object-cover md:h-[380px] lg:h-[420px]"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                            {/* Top-left title */}
                            <div className="absolute top-0 left-0 w-full bg-black/40 px-5 py-3 text-[13px] text-white italic md:text-[15px]">
                                {t("companyProfile")}
                            </div>

                            {/* Center Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button
                                    onClick={() => setIsPlaying(true)}
                                    className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-[#EFA12D] transition-transform hover:scale-110 md:h-[85px] md:w-[85px]"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="white"
                                        className="h-8 w-8 md:h-10 md:w-10"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    ) : (
                        // 🎥 Saat play → tampilkan YouTube video
                        <iframe
                            className="h-[240px] w-full md:h-[380px] lg:h-[420px]"
                            src="https://www.youtube.com/embed/NWO_S1Kh6U0?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1"
                            title={t("companyProfile")}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    )}

                    {/* ✅ Watermark tetap muncul di atas semua */}
                    <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 scale-55 opacity-90">
                        <Image
                            src="/images/logo.png"
                            alt="Djavacoal Watermark"
                            width={180}
                            height={60}
                            className="object-contain drop-shadow-lg"
                        />
                    </div>
                </div>

                {/* ✅ LEFT: Description */}
                <div className="order-2 flex w-full flex-col items-start justify-center gap-6 text-left lg:order-1 lg:w-1/2">
                    <h2 className="font-['Josefin_Sans'] text-3xl font-bold text-white md:text-4xl lg:text-[42px]">
                        {t("title")}
                        <span className="text-[#EFA12D]">
                            {" "}
                            {t("highlight")}
                        </span>{" "}
                    </h2>
                    <div className="space-y-5 text-justify font-['Open_Sans'] text-[15px] leading-[1.8em] text-[#CFCFCF] md:text-[16px]">
                        <p>{t("paragraphs.intro")}</p>
                        <p>{t("paragraphs.natural")}</p>
                        <p>{t("paragraphs.quality")}</p>
                    </div>

                    {/* ✅ CTA */}
                    <div className="flex w-full justify-center lg:justify-start">
                        <Link
                            href="/about-us"
                            className="group relative mt-2 inline-flex items-center gap-2 pb-1 font-['Open_Sans'] text-lg font-semibold text-[#EFA12D] md:text-xl"
                        >
                            <span className="relative">
                                <span className="italic">
                                    {t("cta.getToKnow")}
                                </span>
                                &nbsp;{t("cta.toKnowUs")}
                                <span className="absolute bottom-[-3px] left-0 h-[2px] w-[25px] bg-[#EFA12D] transition-all duration-500 ease-out group-hover:w-full group-hover:bg-[#EFA12D]" />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
