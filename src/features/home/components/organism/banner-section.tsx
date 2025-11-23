"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { useTranslations } from "next-intl";

import { CAROUSEL_INTERVAL } from "../../lib/constants";
import { useHomeContentAPI } from "@/features/public-api/hooks";
import { cn } from "@/lib/utils";

/**
 * BannerSection component - Hero carousel with CTA buttons
 * Auto-advances slides every 8 seconds with manual navigation
 */
export function BannerSection() {
    const t = useTranslations("Home.banner");
    const [currentSlide, setCurrentSlide] = useState(0);

    const { data } = useHomeContentAPI();
    const slide_banners = useMemo(
        () => data?.data.slide_banners || [],
        [data?.data.slide_banners]
    );

    // Auto-slide carousel
    useEffect(() => {
        if (!slide_banners.length) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slide_banners.length);
        }, CAROUSEL_INTERVAL);

        return () => clearInterval(interval);
    }, [slide_banners]);

    return (
        <section className="relative h-[800px] w-full overflow-hidden bg-[#161616]">
            {/* Image Carousel */}
            <div className="absolute inset-0">
                {slide_banners.map((slide, index) => (
                    <div
                        key={slide}
                        className={cn(
                            `absolute inset-0 transition-opacity duration-1500 ease-in-out`,
                            index === currentSlide ? "opacity-100" : "opacity-0"
                        )}
                    >
                        <Image
                            src={slide}
                            alt={slide}
                            className="object-cover"
                            fetchPriority="high"
                            fill
                            priority
                        />
                    </div>
                ))}
                <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-transparent" />
            </div>

            {/* ✅ Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-10 px-5 text-center md:px-20 lg:px-32">
                <h1 className="max-w-[700px] font-['Josefin_Sans'] text-[25px] leading-[1.4em] font-semibold text-white md:text-[36px] lg:text-[42px] lg:leading-[1.1em]">
                    {t.rich("title", {
                        djavacoal: (chunks) => (
                            <span className="text-[#EFA12D]">{chunks}</span>
                        ),
                    })}
                </h1>

                {/* ✅ Buttons (tetap satu baris & responsif) */}
                <div className="flex w-full max-w-[480px] flex-col gap-3 sm:flex-row sm:justify-center sm:gap-5">
                    <Link
                        href="/about-us"
                        className="flex flex-1 items-center justify-center rounded-[40px] border border-white bg-black/40 px-8 py-4 font-['Josefin_Sans'] text-[15px] font-bold whitespace-nowrap text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/60 sm:text-[16px] md:px-10 md:py-5"
                    >
                        {t("buttons.aboutUs")}
                    </Link>
                    <Link
                        href="/our-products"
                        className="flex flex-1 items-center justify-center rounded-[40px] border border-[#EFA12D] bg-black/40 px-8 py-4 font-['Josefin_Sans'] text-[15px] font-bold whitespace-nowrap text-[#EFA12D] backdrop-blur-sm transition-all duration-300 hover:bg-black/60 sm:text-[16px] md:px-10 md:py-5"
                    >
                        {t("buttons.discoverProducts")}
                    </Link>
                </div>
            </div>

            {/* Carousel Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-5 md:bottom-10">
                {Array.from({ length: slide_banners.length }).map(
                    (_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={cn(
                                `h-3.5 w-3.5 rounded-full border border-[#EFA12D] transition-all duration-300`,
                                index === currentSlide
                                    ? "bg-[#EFA12D]"
                                    : "bg-transparent hover:bg-[#EFA12D]/50"
                            )}
                            aria-label={t("carouselAriaLabel", {
                                index: index + 1,
                            })}
                        />
                    )
                )}
            </div>
        </section>
    );
}
