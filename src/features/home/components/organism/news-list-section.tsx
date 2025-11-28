"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { MOCK_NEWS_ITEMS, NEWS_CAROUSEL_INTERVAL } from "../../lib/constants";
import { SectionHeading } from "../atoms";
import { NewsCarousel } from "../molecules";

/** Items per slide for each breakpoint */
const ITEMS_PER_SLIDE = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
} as const;

/**
 * NewsListSection - Displays latest news articles in a responsive carousel
 * Features auto-advancing slides with navigation dots
 * - Mobile: 1 card per slide
 * - Tablet (md-lg): 2 cards per slide
 * - Desktop (xl+): 3 cards per slide
 */
export function NewsListSection() {
    const t = useTranslations("Home.newsArticles");
    const [currentSlide, setCurrentSlide] = useState(0);

    // TODO: Replace with actual API call when integrating
    // const { data: newsItems } = rpc.dashboardNews.getPublishedNews.useQuery({
    //     page: 1,
    //     limit: 6,
    // });
    const newsItems = MOCK_NEWS_ITEMS;

    const totalSlidesMobile = newsItems.length;

    // Auto-advance carousel
    useEffect(() => {
        if (!newsItems.length) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlidesMobile);
        }, NEWS_CAROUSEL_INTERVAL);

        return () => clearInterval(interval);
    }, [newsItems.length, totalSlidesMobile]);

    if (!newsItems.length) return null;

    return (
        <section className="relative w-full overflow-hidden bg-[#0D0D0D] py-12 md:py-16">
            <SectionHeading
                title={t("title")}
                highlight={t("highlight")}
                variant="center"
            />

            <div className="relative mx-auto mt-8 max-w-7xl px-4 md:mt-12 md:px-6 lg:px-8">
                {/* Desktop (xl+) - 3 cards per slide */}
                <NewsCarousel
                    items={newsItems}
                    currentSlide={currentSlide}
                    onSlideChange={setCurrentSlide}
                    itemsPerSlide={ITEMS_PER_SLIDE.desktop}
                    className="hidden xl:block"
                />

                {/* Tablet (md-lg) - 2 cards per slide */}
                <NewsCarousel
                    items={newsItems}
                    currentSlide={currentSlide}
                    onSlideChange={setCurrentSlide}
                    itemsPerSlide={ITEMS_PER_SLIDE.tablet}
                    className="hidden md:block xl:hidden"
                />

                {/* Mobile - 1 card per slide */}
                <NewsCarousel
                    items={newsItems}
                    currentSlide={currentSlide}
                    onSlideChange={setCurrentSlide}
                    itemsPerSlide={ITEMS_PER_SLIDE.mobile}
                    className="md:hidden"
                />
            </div>
        </section>
    );
}
