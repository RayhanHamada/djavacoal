"use client";
import type { VideoItem } from "../../lib";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { Play } from "lucide-react";

interface VideoCarouselProps {
    items: VideoItem[];
    onThumbnailClick: (item: VideoItem) => void;
}

export function VideoCarousel({ items, onThumbnailClick }: VideoCarouselProps) {
    const [position, setPosition] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setPosition((prev) => {
                const newPosition = prev - 1;
                // Reset when we've scrolled one full set
                if (Math.abs(newPosition) >= items.length * 140) {
                    return 0;
                }
                return newPosition;
            });
        }, 30); // Adjust speed here (lower = faster)

        return () => clearInterval(interval);
    }, [items.length]);

    // Duplicate items for infinite scroll effect
    const duplicatedItems = [...items, ...items, ...items];

    return (
        <div className="relative w-full overflow-hidden bg-gray-900/50 py-4">
            <div
                ref={carouselRef}
                className="flex gap-4 transition-transform duration-0"
                style={{ transform: `translateX(${position}px)` }}
            >
                {duplicatedItems.map((item, index) => (
                    <div
                        key={index}
                        className="group h-32 w-32 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-gray-800 transition-all hover:ring-2 hover:ring-[#EFA12D]"
                        onClick={() => onThumbnailClick(item)}
                    >
                        <div className="relative h-full w-full">
                            <Image
                                src={item.thumbnail}
                                alt={`Thumbnail ${index}`}
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
            </div>
        </div>
    );
}
