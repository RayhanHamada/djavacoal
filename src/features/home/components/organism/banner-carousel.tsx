"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { CAROUSEL_INTERVAL } from "../../lib/constants";
import { cn } from "@/lib/utils";

interface BannerCarouselProps {
    slides: string[];
}

/**
 * BannerCarousel - Client-side carousel component
 * Handles auto-advance and manual navigation
 */
export function BannerCarousel({ slides }: BannerCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-slide carousel
    useEffect(() => {
        if (!slides.length) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, CAROUSEL_INTERVAL);

        return () => clearInterval(interval);
    }, [slides]);

    if (!slides.length) return null;

    return (
        <>
            {/* Image Carousel */}
            <div className="absolute inset-0">
                {slides.map((slide, index) => (
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
            </div>

            {/* Carousel Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-5 md:bottom-10">
                {Array.from({ length: slides.length }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={cn(
                            `h-3.5 w-3.5 rounded-full border border-[#EFA12D] transition-all duration-300`,
                            index === currentSlide
                                ? "bg-[#EFA12D]"
                                : "bg-transparent hover:bg-[#EFA12D]/50"
                        )}
                    />
                ))}
            </div>
        </>
    );
}
