"use client";

import type { NewsItem } from "../../lib/types";

import { useCarouselDrag } from "../../hooks";
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
 * NewsCarousel - Swipeable carousel with smooth drag feedback
 * Follows finger/mouse in real-time, snaps on release
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

    const {
        containerRef,
        trackRef,
        isDragging,
        translatePercent,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleMouseLeave,
        handleKeyDown,
    } = useCarouselDrag({
        totalSlides,
        activeSlide,
        itemsPerSlide,
        onSlideChange,
    });

    return (
        <div className={className}>
            <div
                ref={containerRef}
                className={`relative overflow-hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="region"
                aria-label="News carousel"
                aria-roledescription="carousel"
            >
                <div
                    ref={trackRef}
                    className={`flex select-none ${isDragging ? "" : "transition-transform duration-300 ease-out"}`}
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
