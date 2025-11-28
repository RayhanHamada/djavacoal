import type { NewsItem } from "../../lib/types";

import { CarouselDots } from "../atoms";
import { NewsCard } from "./news-card";

interface NewsCarouselProps {
    /** News items to display */
    items: NewsItem[];
    /** Current active slide index */
    currentSlide: number;
    /** Callback when slide changes */
    onSlideChange: (index: number) => void;
    /** Number of items visible at once */
    itemsPerSlide: number;
    /** Additional CSS classes */
    className?: string;
}

/**
 * NewsCarousel - Sliding carousel for news items
 * Slides one item at a time while showing multiple items in view
 */
export function NewsCarousel({
    items,
    currentSlide,
    onSlideChange,
    itemsPerSlide,
    className,
}: NewsCarouselProps) {
    const totalSlides = Math.max(1, items.length - itemsPerSlide + 1);
    const activeSlide = currentSlide % totalSlides;

    // Each item takes up 1/itemsPerSlide of the visible container width
    // So translating by 1 item = 100/itemsPerSlide percent of the container
    const translatePercent = (activeSlide * 100) / itemsPerSlide;

    return (
        <div className={className}>
            <div className="relative overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${translatePercent}%)` }}
                >
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="shrink-0 px-3"
                            style={{ width: `${100 / itemsPerSlide}%` }}
                        >
                            <NewsCard {...item} />
                        </div>
                    ))}
                </div>
            </div>

            <CarouselDots
                totalSlides={totalSlides}
                currentSlide={activeSlide}
                onSlideChange={onSlideChange}
                className="mt-8"
            />
        </div>
    );
}
