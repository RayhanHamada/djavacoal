"use client";

import type { NewsItem } from "../../lib/types";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

/** Default placeholder image when no cover image is available */
const DEFAULT_COVER_IMAGE = "/images/blog/placeholder.png";

/**
 * Split title into two halves for highlighting
 * First half in white, second half in accent color
 */
function splitTitleForHighlight(title: string): {
    firstHalf: string;
    secondHalf: string;
} {
    const words = title.split(" ");
    const midpoint = Math.ceil(words.length / 2);
    return {
        firstHalf: words.slice(0, midpoint).join(" "),
        secondHalf: words.slice(midpoint).join(" "),
    };
}

interface NewsCardProps extends NewsItem {
    className?: string;
}

/**
 * NewsCard component for displaying individual news article preview
 * Features clean image with title below showing half highlighted
 */
export function NewsCard({
    slug,
    title,
    publishedAt,
    coverImage,
    className,
}: NewsCardProps) {
    const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const imageUrl = coverImage ?? DEFAULT_COVER_IMAGE;
    const { firstHalf, secondHalf } = splitTitleForHighlight(title);

    return (
        <article
            className={cn(
                "group relative mx-auto flex w-full max-w-11/12 flex-col justify-center overflow-hidden md:max-w-[500px]",
                className
            )}
        >
            {/* Image without overlay */}
            <Link
                href={`/blog/${slug}`}
                className="relative aspect-square overflow-hidden"
            >
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </Link>

            {/* Date, Title (half highlighted), and Arrow */}
            <div className="flex flex-col gap-2 bg-[#0D0D0D] pt-4 pb-2">
                <span className="font-['Open_Sans'] text-[14px] text-[#9C9C9C] md:text-[15px]">
                    {formattedDate}
                </span>
                <div className="flex justify-between">
                    <h4 className="font-['Josefin_Sans'] text-[16px] leading-tight font-bold text-white uppercase md:text-[18px]">
                        {firstHalf}
                        {secondHalf && (
                            <>
                                {" "}
                                <span className="text-[#EFA12D]">
                                    {secondHalf}
                                </span>
                            </>
                        )}
                    </h4>
                    <Link
                        href={`/blog/${slug}`}
                        className="shrink-0 text-[#EFA12D] transition-transform duration-300 group-hover:translate-x-1"
                        aria-label={`Read more about ${title}`}
                    >
                        <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
