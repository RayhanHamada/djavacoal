"use client";

import Image from "next/image";
import Link from "next/link";

import { DateBadge } from "../atoms";
import { cn } from "@/lib/utils";

interface RelatedPost {
    id: number;
    slug: string;
    title: string;
    date: string;
    imageUrl: string;
}

interface RelatedArticlesProps {
    articles: RelatedPost[];
    title?: string;
    className?: string;
    isLoading?: boolean;
    error?: Error | null;
    hasMore: boolean;
    loadMore: () => void;
}

export function RelatedArticles({
    articles,
    title = "Newest",
    className,
    isLoading = false,
    error = null,
    hasMore,
    loadMore,
}: RelatedArticlesProps) {
    // Determine if there are more items to show

    return (
        <div
            className={cn(
                "flex flex-col gap-5 rounded border border-[#3D3D3D] p-5",
                className
            )}
        >
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

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-8">
                    <div className="text-white/70">
                        Loading related articles...
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div className="flex items-center justify-center py-8">
                    <div className="text-red-400">
                        Failed to load related articles
                    </div>
                </div>
            )}

            {/* Articles Grid */}
            {!isLoading && !error && (
                <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:flex lg:flex-col">
                    {articles.map((article) => {
                        // Show/hide logic based on breakpoint

                        return (
                            <Link
                                href={`/blog/${article.slug}`}
                                key={article.id}
                                className={cn("flex-col gap-[7px]")}
                            >
                                <div className="relative aspect-square w-full overflow-hidden">
                                    <Image
                                        src={article.imageUrl}
                                        alt={article.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <DateBadge
                                    date={article.date}
                                    className="text-secondary text-sm"
                                />
                                <h4 className="font-inter text-base leading-[1.21em] font-normal text-white">
                                    {article.title}
                                </h4>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Show More Button - only show if there are articles and no loading/error */}
            {!isLoading && !error && articles.length && (
                <button
                    onClick={loadMore}
                    disabled={!hasMore}
                    className={cn(
                        "bg-secondary flex items-center justify-center border-t border-[#474747] py-4",
                        "font-inter items-center justify-center text-xl leading-[1.21em] font-bold text-white transition-opacity",
                        hasMore
                            ? "hover:text-primary cursor-pointer"
                            : "cursor-not-allowed opacity-50"
                    )}
                >
                    More
                </button>
            )}
        </div>
    );
}
