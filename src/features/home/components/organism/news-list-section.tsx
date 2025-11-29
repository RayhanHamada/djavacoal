"use client";

import type { NewsItem } from "../../lib/types";

import { useTranslations } from "next-intl";

import { useAutoAdvance } from "../../hooks";
import { NEWS_CAROUSEL_INTERVAL } from "../../lib/constants";
import { SectionHeading } from "../atoms";
import { NewsCarousel } from "../molecules";

/** Visible items per breakpoint */
const VISIBLE_ITEMS = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
} as const;

interface NewsListSectionProps {
    /** News items to display */
    newsItems: NewsItem[];
}

/**
 * NewsListSection - Responsive news carousel with auto-advance
 *
 * Breakpoints:
 * - Mobile (<md): 1 visible
 * - Tablet (md-xl): 2 visible
 * - Desktop (xl+): 3 visible
 */
export function NewsListSection({ newsItems }: NewsListSectionProps) {
    const t = useTranslations("Home.newsArticles");

    const totalSlides = newsItems.length;

    const { currentSlide, setCurrentSlide } = useAutoAdvance({
        totalSlides,
        interval: NEWS_CAROUSEL_INTERVAL,
    });

    if (!totalSlides) return null;

    return (
        <section className="relative w-full overflow-hidden border-t border-[#D0D0D0] bg-[#0D0D0D] py-12 md:py-16">
            <SectionHeading
                title={t("title")}
                highlight={t("highlight")}
                variant="center"
            />

            <div className="relative mx-auto mt-8 max-w-7xl px-4 md:mt-12 md:px-6 lg:px-8">
                {/* Desktop */}
                <NewsCarousel
                    items={newsItems}
                    currentSlide={currentSlide}
                    onSlideChange={setCurrentSlide}
                    itemsPerSlide={VISIBLE_ITEMS.desktop}
                    className="hidden xl:block"
                />

                {/* Tablet */}
                <NewsCarousel
                    items={newsItems}
                    currentSlide={currentSlide}
                    onSlideChange={setCurrentSlide}
                    itemsPerSlide={VISIBLE_ITEMS.tablet}
                    className="hidden md:block xl:hidden"
                />

                {/* Mobile */}
                <NewsCarousel
                    items={newsItems}
                    currentSlide={currentSlide}
                    onSlideChange={setCurrentSlide}
                    itemsPerSlide={VISIBLE_ITEMS.mobile}
                    className="md:hidden"
                />
            </div>
        </section>
    );
}
