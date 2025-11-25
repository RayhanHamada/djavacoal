import Link from "next/link";

import { getTranslations } from "next-intl/server";

import { BannerCarousel } from "./banner-carousel";
import { serverPublicAPIClient } from "@/adapters/public-api/server";

/**
 * BannerSection component - Hero carousel with CTA buttons
 * Server-rendered with client-side carousel functionality
 */
export async function BannerSection() {
    const t = await getTranslations("Home.banner");
    const { data } = await serverPublicAPIClient.GET("/home-content");
    const slide_banners = data?.data.slide_banners ?? [];

    return (
        <section className="relative h-[90vh] w-full overflow-hidden bg-[#161616] md:h-[800px]">
            {/* Client-side Carousel */}
            <BannerCarousel slides={slide_banners} />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-10 px-5 text-center md:px-20 lg:px-32">
                <h1 className="max-w-[700px] font-['Josefin_Sans'] text-[25px] leading-[1.4em] font-semibold text-white md:text-[36px] lg:text-[42px] lg:leading-[1.1em]">
                    {t.rich("title", {
                        djavacoal: (chunks) => (
                            <span className="text-[#EFA12D]">{chunks}</span>
                        ),
                    })}
                </h1>

                {/* Buttons */}
                <div className="flex w-full max-w-[480px] flex-col gap-3 sm:flex-row sm:justify-center sm:gap-5">
                    <Link
                        href="/about-company"
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
        </section>
    );
}
