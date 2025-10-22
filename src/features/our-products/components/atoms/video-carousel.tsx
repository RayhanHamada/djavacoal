"use client";
import type { VideoItem } from "../../lib";

import { useState } from "react";

import Image from "next/image";

import { Play } from "lucide-react";

interface VideoCarouselProps {
    items: VideoItem[];
    onThumbnailClick: (item: VideoItem) => void;
}

export function VideoCarousel({ items, onThumbnailClick }: VideoCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 4;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const handlePrevious = () => {
        setCurrentIndex((prev) => Math.max(0, prev - itemsPerPage));
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            Math.min(items.length - itemsPerPage, prev + itemsPerPage)
        );
    };

    const visibleItems = items.slice(currentIndex, currentIndex + itemsPerPage);
    const canGoPrevious = currentIndex > 0;
    const canGoNext = currentIndex + itemsPerPage < items.length;
    const currentPage = Math.floor(currentIndex / itemsPerPage);

    return (
        <div className="relative w-full bg-gray-900/50 py-8">
            <div className="container mx-auto px-4">
                <div className="relative flex items-center justify-center">
                    {/* Carousel Items */}
                    <div className="relative flex gap-4 overflow-hidden">
                        {visibleItems.map((item, index) => (
                            <div
                                key={currentIndex + index}
                                className="group h-32 w-32 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-gray-800 transition-all hover:ring-2 hover:ring-[#EFA12D]"
                                onClick={() => onThumbnailClick(item)}
                            >
                                <div className="relative h-full w-full">
                                    <Image
                                        src={item.thumbnail}
                                        alt={`Thumbnail ${currentIndex + index + 1}`}
                                        width={128}
                                        height={128}
                                        className="h-full w-full object-cover"
                                    />
                                    {/* Djavacoal Logo on Thumbnail */}
                                    <div className="absolute top-2 left-2 text-[8px] font-bold tracking-wider text-white opacity-80">
                                        DJAVACOAL
                                    </div>
                                    {/* Play icon overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFA12D]">
                                            <Play className="ml-1 h-6 w-6 fill-white text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Previous Button - Triangle Overlay */}
                        {canGoPrevious && (
                            <button
                                onClick={handlePrevious}
                                className="group/prev absolute top-0 left-0 z-20 flex h-full w-16 cursor-pointer items-center justify-start transition-all hover:w-20"
                                aria-label="Previous videos"
                            >
                                <svg
                                    viewBox="0 0 100 100"
                                    className="h-full w-full opacity-0 transition-all duration-300 group-hover/prev:opacity-90"
                                    preserveAspectRatio="none"
                                >
                                    <polygon
                                        points="100,0 0,50 100,100"
                                        fill="#EFA12D"
                                        className="transition-all duration-300 group-hover/prev:fill-[#D68F1F]"
                                    />
                                    <polygon
                                        points="60,35 35,50 60,65"
                                        fill="white"
                                    />
                                </svg>
                            </button>
                        )}

                        {/* Next Button - Triangle Overlay */}
                        {canGoNext && (
                            <button
                                onClick={handleNext}
                                className="group/next absolute top-0 right-0 z-20 flex h-full w-16 cursor-pointer items-center justify-end transition-all hover:w-20"
                                aria-label="Next videos"
                            >
                                <svg
                                    viewBox="0 0 100 100"
                                    className="h-full w-full opacity-0 transition-all duration-300 group-hover/next:opacity-90"
                                    preserveAspectRatio="none"
                                >
                                    <polygon
                                        points="0,0 100,50 0,100"
                                        fill="#EFA12D"
                                        className="transition-all duration-300 group-hover/next:fill-[#D68F1F]"
                                    />
                                    <polygon
                                        points="40,35 65,50 40,65"
                                        fill="white"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Page Indicators */}
                {totalPages > 1 && (
                    <div className="mt-4 flex justify-center gap-2">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() =>
                                    setCurrentIndex(index * itemsPerPage)
                                }
                                className={`h-2 w-2 rounded-full transition-all ${
                                    index === currentPage
                                        ? "w-6 bg-[#EFA12D]"
                                        : "bg-gray-600 hover:bg-gray-500"
                                }`}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
