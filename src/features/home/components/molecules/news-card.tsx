"use client";

import type { NewsItem } from "../../lib/types";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface NewsCardProps extends NewsItem {
    className?: string;
}

/**
 * NewsCard component for displaying individual news article preview
 * Features title overlay on image with date and arrow CTA
 */
export function NewsCard({
    slug,
    title,
    titleHighlight,
    publishedAt,
    coverImage,
    className,
}: NewsCardProps) {
    const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <article
            className={cn(
                "group relative mx-auto flex w-full max-w-[500px] flex-col justify-center overflow-hidden",
                className
            )}
        >
            {/* Image with Title Overlay */}
            <Link
                href={`/blog/${slug}`}
                className="relative aspect-square overflow-hidden"
            >
                <Image
                    src={coverImage}
                    alt={`${title} ${titleHighlight}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

                {/* Title on Image */}
                <div className="absolute inset-x-0 bottom-0 flex h-[2em] flex-col justify-end p-4 md:p-6">
                    <h3 className="font-['Josefin_Sans'] text-[18px] leading-tight font-bold text-white uppercase drop-shadow-lg md:text-[22px] lg:text-[26px]">
                        {title}{" "}
                        <span className="text-[#EFA12D]">{titleHighlight}</span>
                    </h3>
                </div>
            </Link>

            {/* Date, Title, and Arrow */}
            <div className="flex flex-col gap-2 bg-[#0D0D0D] pt-4 pb-2">
                <span className="font-['Open_Sans'] text-[14px] text-[#9C9C9C] md:text-[15px]">
                    {formattedDate}
                </span>
                <div className="flex items-end justify-between">
                    <h4 className="font-['Josefin_Sans'] text-[16px] leading-tight font-bold text-white uppercase md:text-[18px]">
                        {title}{" "}
                        <span className="text-[#EFA12D]">{titleHighlight}</span>
                    </h4>
                    <Link
                        href={`/blog/${slug}`}
                        className="shrink-0 text-[#EFA12D] transition-transform duration-300 group-hover:translate-x-1"
                        aria-label={`Read more about ${title} ${titleHighlight}`}
                    >
                        <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
