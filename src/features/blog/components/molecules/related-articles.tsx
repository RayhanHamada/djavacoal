"use client";

import type { RelatedArticle } from "../../lib/types";

import Image from "next/image";
import Link from "next/link";

import { FaSpinner } from "react-icons/fa";

import { getBlogPlaceholderImage } from "../../lib/utils";
import { DateBadge } from "../atoms";
import { cn } from "@/lib/utils";

interface RelatedArticlesProps {
    articles: RelatedArticle[];
    title?: string;
    className?: string;
    isLoading?: boolean;
    error?: Error | null;
    hasMore: boolean;
    loadMore: () => void;
}

/**
 * RelatedArticles - Sidebar component for displaying related blog posts
 * Features infinite scroll with "Show More" button
 */
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
                <div className="flex flex-col gap-4">
                    <div className="relative aspect-square w-full animate-pulse overflow-hidden rounded bg-gray-700"></div>
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-700"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-full animate-pulse rounded bg-gray-700"></div>
                        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-700"></div>
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
            {!error && (
                <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:flex lg:flex-col">
                    {articles.map((article) => {
                        // Show/hide logic based on breakpoint

                        return (
                            <Link
                                href={`/blog/${article.slug}`}
                                key={article.id}
                                className={cn("flex flex-col gap-y-1")}
                            >
                                <div className="relative aspect-square w-full gap-y-4 overflow-hidden lg:aspect-video">
                                    <Image
                                        src={
                                            article.imageUrl ??
                                            getBlogPlaceholderImage()
                                        }
                                        alt={article.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <DateBadge
                                    date={article.date}
                                    className="text-secondary text-sm"
                                />
                                <h4 className="font-inter line-clamp-2 text-base leading-[1.21em] font-normal text-white">
                                    {article.title}
                                </h4>
                            </Link>
                        );
                    })}
                    {isLoading && (
                        <div className="flex flex-col gap-4">
                            <div className="relative aspect-square w-full animate-pulse overflow-hidden rounded bg-gray-700"></div>
                            <div className="h-4 w-20 animate-pulse rounded bg-gray-700"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-full animate-pulse rounded bg-gray-700"></div>
                                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-700"></div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Show More Button - only show if there are articles and no loading/error */}
            {!error && hasMore && articles.length && (
                <button
                    onClick={loadMore}
                    disabled={isLoading}
                    className={cn(
                        "bg-secondary flex items-center justify-center border-t border-[#474747] py-4",
                        "font-inter items-center justify-center text-xl leading-[1.21em] font-bold text-white transition-opacity",
                        hasMore
                            ? "hover:text-primary cursor-pointer"
                            : "cursor-not-allowed opacity-50"
                    )}
                >
                    {isLoading ? (
                        <FaSpinner className="animate-spin" />
                    ) : (
                        "Show More"
                    )}
                </button>
            )}
        </div>
    );
}
