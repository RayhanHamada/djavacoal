"use client";

import { useRef } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { GALLERY_REELS } from "../../lib/constants";
import { ReelCard } from "../atoms";

interface ReelGalleryProps {
    onReelClick: (index: number) => void;
}

export default function ReelGallery({ onReelClick }: ReelGalleryProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (!containerRef.current) return;
        const scrollAmount = direction === "left" ? -350 : 350;
        containerRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <div className="-mx-10">
            <div className="relative w-full">
                <div
                    ref={containerRef}
                    id="reelsContainer"
                    className="scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-transparent -pr-[40px] -pl-[40px] scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth py-4 lg:mx-auto"
                >
                    {GALLERY_REELS.map((videoId, index) => (
                        <ReelCard
                            key={`${videoId}-${index}`}
                            videoId={videoId}
                            index={index}
                            onClick={() => onReelClick(index)}
                        />
                    ))}
                </div>

                {/* Desktop Navigation Arrows */}
                <button
                    className="absolute top-1/2 left-2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#202020]/60 text-white transition hover:bg-[#EFA12D] lg:flex"
                    onClick={() => scroll("left")}
                    aria-label="Scroll reels left"
                >
                    <ChevronLeft size={26} />
                </button>

                <button
                    className="absolute top-1/2 right-2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#202020]/60 text-white transition hover:bg-[#EFA12D] lg:flex"
                    onClick={() => scroll("right")}
                    aria-label="Scroll reels right"
                >
                    <ChevronRight size={26} />
                </button>
            </div>
        </div>
    );
}
