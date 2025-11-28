"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { MOCK_NEWS_ITEMS, NEWS_CAROUSEL_INTERVAL } from "../../lib/constants";
import { SectionHeading } from "../atoms";
import { NewsCard } from "../molecules";
import { cn } from "@/lib/utils";

/**
 * NewsListSection - Displays latest news articles in a carousel
 * Features auto-advancing slides with navigation dots
 * Positioned between VisitOurFactorySection and MajorityExportDestinationSection
 */
export function NewsListSection() {
    const t = useTranslations("Home.newsArticles");
    const [currentSlide, setCurrentSlide] = useState(0);

    // TODO: Replace with actual API call when integrating
    // const { data: newsItems } = rpc.dashboardNews.getPublishedNews.useQuery({
    //     page: 1,
    //     limit: 4,
    // });
    const newsItems = MOCK_NEWS_ITEMS;

    // Calculate total slides (2 items per slide on desktop, 1 on mobile)
    const totalSlidesDesktop = Math.ceil(newsItems.length / 2);

    // Auto-slide carousel
    useEffect(() => {
        if (!newsItems.length) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlidesDesktop);
        }, NEWS_CAROUSEL_INTERVAL);

        return () => clearInterval(interval);
    }, [newsItems.length, totalSlidesDesktop]);

    if (!newsItems.length) return null;

    return (
        <section className="relative w-full overflow-hidden bg-[#0D0D0D] py-12 md:py-16">
            {/* Section Title */}
            <SectionHeading
                title={t("title")}
                highlight={t("highlight")}
                variant="center"
            />

            {/* Carousel Container */}
            <div className="relative mx-auto mt-8 max-w-7xl px-4 md:mt-12 md:px-6 lg:px-8">
                {/* Desktop View - 2 cards side by side */}
                <div className="hidden md:block">
                    <div className="relative overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${currentSlide * 100}%)`,
                            }}
                        >
                            {/* Create slide groups of 2 */}
                            {Array.from({
                                length: totalSlidesDesktop,
                            }).map((_, slideIndex) => (
                                <div
                                    key={slideIndex}
                                    className="grid w-full shrink-0 grid-cols-2 gap-6"
                                >
                                    {newsItems
                                        .slice(
                                            slideIndex * 2,
                                            slideIndex * 2 + 2
                                        )
                                        .map((item) => (
                                            <NewsCard key={item.id} {...item} />
                                        ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Navigation Dots */}
                    <div className="mt-8 flex items-center justify-center gap-3">
                        {Array.from({ length: totalSlidesDesktop }).map(
                            (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={cn(
                                        "h-3 w-3 rounded-full transition-all duration-300",
                                        index === currentSlide
                                            ? "bg-[#EFA12D]"
                                            : "bg-[#4F4F4F] hover:bg-[#6F6F6F]"
                                    )}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            )
                        )}
                    </div>
                </div>

                {/* Mobile View - 1 card at a time */}
                <div className="md:hidden">
                    <div className="relative overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${currentSlide * 100}%)`,
                            }}
                        >
                            {newsItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="w-full shrink-0 px-2"
                                >
                                    <NewsCard {...item} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Navigation Dots */}
                    <div className="mt-6 flex items-center justify-center gap-3">
                        {newsItems.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={cn(
                                    "h-3 w-3 rounded-full transition-all duration-300",
                                    index === currentSlide
                                        ? "bg-[#EFA12D]"
                                        : "bg-[#4F4F4F] hover:bg-[#6F6F6F]"
                                )}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
