"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

interface PreviewDetailHeaderProps {
    /** Article title */
    title: string;
    /** Formatted date string */
    date: string;
    /** Cover image URL (can be blob URL or R2 URL) */
    imageUrl?: string;
    /** Additional CSS classes */
    className?: string;
}

/**
 * PreviewDetailHeader - Header component for news preview
 *
 * Similar to BlogDetailHeader but without social share buttons
 * since sharing doesn't make sense in preview mode.
 */
export function PreviewDetailHeader({
    title,
    date,
    imageUrl = "/images/logo.png",
    className,
}: PreviewDetailHeaderProps) {
    return (
        <div className={cn("flex flex-col gap-5 md:gap-5", className)}>
            <div className="flex flex-col gap-5">
                <h1 className="font-inter text-2xl leading-[1.21em] font-bold text-white md:text-[25px]">
                    {title}
                </h1>
                <div className="flex items-center gap-2">
                    <span className="font-inter text-secondary text-base leading-[1.875em] font-normal">
                        Djavacoal Team
                    </span>
                    <span className="text-white">-</span>
                    <div className="text-base leading-[1.875em] font-normal text-white">
                        {date}
                    </div>
                </div>
                <div className="h-px w-full bg-[#474747]" />
            </div>

            <div className="flex flex-col items-center gap-y-2">
                {/* Preview mode indicator instead of social share buttons */}
                <div className="flex gap-x-2 self-start">
                    <div className="rounded-full bg-[#EFA12D] px-4 py-1 text-sm font-medium text-black">
                        Preview Mode
                    </div>
                </div>
                <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        unoptimized={imageUrl.startsWith("blob:")}
                    />
                </div>
            </div>
        </div>
    );
}
