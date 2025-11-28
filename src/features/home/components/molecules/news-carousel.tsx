import type { NewsItem } from "../../lib/types";

import { CarouselDots } from "../atoms";
import { NewsCard } from "./news-card";

interface NewsCarouselProps {
    items: NewsItem[];
    currentSlide: number;
    onSlideChange: (index: number) => void;
    itemsPerSlide: number;
    className?: string;
}

/**
 * NewsCarousel component for displaying news items in a sliding carousel
 * Supports configurable items per slide for responsive layouts
 */
export function NewsCarousel({
    items,
    currentSlide,
    onSlideChange,
    itemsPerSlide,
    className,
}: NewsCarouselProps) {
    const totalSlides = Math.ceil(items.length / itemsPerSlide);
    const normalizedSlide = currentSlide % totalSlides;

    // Generate grid columns class based on items per slide
    const gridColsClass =
        {
            1: "grid-cols-1",
            2: "grid-cols-2",
            3: "grid-cols-3",
        }[itemsPerSlide] ?? "grid-cols-1";

    return (
        <div className={className}>
            <div className="relative overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${normalizedSlide * 100}%)`,
                    }}
                >
                    {Array.from({ length: totalSlides }).map(
                        (_, slideIndex) => (
                            <div
                                key={slideIndex}
                                className={`grid w-full shrink-0 gap-6 ${gridColsClass}`}
                            >
                                {items
                                    .slice(
                                        slideIndex * itemsPerSlide,
                                        slideIndex * itemsPerSlide +
                                            itemsPerSlide
                                    )
                                    .map((item) => (
                                        <NewsCard key={item.id} {...item} />
                                    ))}
                            </div>
                        )
                    )}
                </div>
            </div>

            <CarouselDots
                totalSlides={totalSlides}
                currentSlide={normalizedSlide}
                onSlideChange={onSlideChange}
                className="mt-8"
            />
        </div>
    );
}
