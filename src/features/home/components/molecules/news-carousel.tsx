"use client";

import type { NewsItem } from "../../lib/types";

import { useCallback, useRef, useState } from "react";

import { CarouselDots } from "../atoms";
import { NewsCard } from "./news-card";

/** Minimum swipe distance (px) to trigger slide change */
const SWIPE_THRESHOLD = 50;

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

    // Drag state
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const startXRef = useRef(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);

    // Base transform percentage for current slide
    const baseTranslate = (activeSlide * 100) / itemsPerSlide;

    // Convert pixel drag offset to percentage of container width
    const getOffsetPercent = useCallback(() => {
        if (!containerRef.current || dragOffset === 0) return 0;
        const containerWidth = containerRef.current.offsetWidth;
        return (dragOffset / containerWidth) * 100;
    }, [dragOffset]);

    // Final transform: base position + drag offset
    const translatePercent = baseTranslate - getOffsetPercent();

    // Navigate to slide with bounds checking
    const goToSlide = useCallback(
        (direction: "prev" | "next") => {
            if (direction === "prev" && activeSlide > 0) {
                onSlideChange(activeSlide - 1);
            } else if (direction === "next" && activeSlide < totalSlides - 1) {
                onSlideChange(activeSlide + 1);
            }
        },
        [activeSlide, totalSlides, onSlideChange]
    );

    // Start drag
    const handleDragStart = useCallback((clientX: number) => {
        startXRef.current = clientX;
        setIsDragging(true);
        setDragOffset(0);
    }, []);

    // Update drag offset in real-time
    const handleDragMove = useCallback(
        (clientX: number) => {
            if (!isDragging) return;
            const diff = clientX - startXRef.current;
            setDragOffset(diff);
        },
        [isDragging]
    );

    // End drag and snap to nearest slide
    const handleDragEnd = useCallback(() => {
        if (!isDragging) return;

        const finalOffset = dragOffset;
        setIsDragging(false);
        setDragOffset(0);

        // Determine if we should change slides
        if (Math.abs(finalOffset) > SWIPE_THRESHOLD) {
            goToSlide(finalOffset < 0 ? "next" : "prev");
        }
    }, [isDragging, dragOffset, goToSlide]);

    // Touch handlers
    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX),
        [handleDragStart]
    );

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX),
        [handleDragMove]
    );

    const handleTouchEnd = useCallback(() => handleDragEnd(), [handleDragEnd]);

    // Mouse handlers
    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            handleDragStart(e.clientX);
        },
        [handleDragStart]
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => handleDragMove(e.clientX),
        [handleDragMove]
    );

    const handleMouseUp = useCallback(() => handleDragEnd(), [handleDragEnd]);

    const handleMouseLeave = useCallback(() => {
        if (isDragging) handleDragEnd();
    }, [isDragging, handleDragEnd]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "ArrowLeft") goToSlide("prev");
            else if (e.key === "ArrowRight") goToSlide("next");
        },
        [goToSlide]
    );

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
