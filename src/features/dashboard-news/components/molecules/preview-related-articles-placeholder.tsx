"use client";

import { cn } from "@/lib/utils";

interface PreviewRelatedArticlesPlaceholderProps {
    /** Title for the section */
    title?: string;
    /** Number of placeholder items to show */
    count?: number;
    /** Additional CSS classes */
    className?: string;
}

/**
 * PreviewRelatedArticlesPlaceholder - Placeholder for related articles in preview mode
 *
 * Shows skeleton-like placeholders instead of actual related articles
 * since we don't have real data in preview mode.
 */
export function PreviewRelatedArticlesPlaceholder({
    title = "Newest",
    count = 3,
    className,
}: PreviewRelatedArticlesPlaceholderProps) {
    return (
        <div
            className={cn(
                "flex flex-col gap-5 rounded border border-[#3D3D3D] p-5",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center gap-2.5">
                <svg
                    width="13"
                    height="24"
                    viewBox="0 0 13 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-secondary shrink-0"
                >
                    <line
                        x1="3"
                        y1="5"
                        x2="3"
                        y2="19"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <line
                        x1="10"
                        y1="5"
                        x2="10"
                        y2="19"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                </svg>
                <h3 className="font-inter text-xl leading-[1.21em] font-extrabold text-white">
                    {title}
                </h3>
            </div>

            <div className="h-px w-full bg-[#474747]" />

            {/* Placeholder items */}
            <div className="flex flex-col gap-4">
                {Array.from({ length: count }).map((_, index) => (
                    <div key={index} className="flex flex-col gap-3">
                        {/* Image placeholder */}
                        <div className="relative aspect-video w-full overflow-hidden rounded bg-[#2a2a2a]">
                            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                                Preview Mode
                            </div>
                        </div>
                        {/* Date placeholder */}
                        <div className="h-4 w-24 rounded bg-[#2a2a2a]" />
                        {/* Title placeholder */}
                        <div className="space-y-2">
                            <div className="h-4 w-full rounded bg-[#2a2a2a]" />
                            <div className="h-4 w-3/4 rounded bg-[#2a2a2a]" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Preview mode indicator */}
            <div className="mt-2 rounded bg-[#2a2a2a] p-3 text-center text-sm text-gray-400">
                Related articles are not shown in preview mode
            </div>
        </div>
    );
}
