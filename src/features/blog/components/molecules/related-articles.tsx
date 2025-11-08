"use client";
import { useState } from "react";

import Image from "next/image";

import { DateBadge } from "../atoms";
import { cn } from "@/lib/utils";

interface RelatedPost {
    id: string;
    title: string;
    date: string;
    imageUrl: string;
}

interface RelatedArticlesProps {
    articles: RelatedPost[];
    title?: string;
    className?: string;
}

export function RelatedArticles({
    articles,
    title = "Newest",
    className,
}: RelatedArticlesProps) {
    const [showCount, setShowCount] = useState({
        sm: 2,
        md: 3,
        lg: 5,
    });

    const handleShowMore = () => {
        setShowCount((prev) => ({
            sm: prev.sm + 2,
            md: prev.md + 2,
            lg: prev.lg + 2,
        }));
    };

    // Determine if there are more items to show
    const hasMoreSm = showCount.sm < articles.length;
    const hasMoreMd = showCount.md < articles.length;
    const hasMoreLg = showCount.lg < articles.length;
    const hasMore = hasMoreSm || hasMoreMd || hasMoreLg;

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
                    className="text-secondary flex-shrink-0"
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
            <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:flex lg:flex-col">
                {articles.map((article, index) => {
                    // Show/hide logic based on breakpoint
                    const showOnSm = index < showCount.sm;
                    const showOnMd = index < showCount.md;
                    const showOnLg = index < showCount.lg;

                    return (
                        <div
                            key={article.id}
                            className={cn(
                                "flex-col gap-[7px]",
                                // Hide on small screens if beyond limit
                                showOnSm ? "flex" : "hidden",
                                // Show on md if within md limit
                                showOnMd ? "md:flex" : "md:hidden",
                                // Show on lg if within lg limit
                                showOnLg ? "lg:flex" : "lg:hidden"
                            )}
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
                                className="text-primary text-sm"
                            />
                            <h4 className="font-inter text-base leading-[1.21em] font-normal text-white">
                                {article.title}
                            </h4>
                        </div>
                    );
                })}
            </div>
            <div className="bg-secondary flex items-center justify-center border-t border-[#474747] py-4">
                <button
                    onClick={handleShowMore}
                    disabled={!hasMore}
                    className={cn(
                        "font-inter items-center justify-center text-xl leading-[1.21em] font-bold text-white transition-opacity",
                        hasMore
                            ? "hover:text-primary cursor-pointer"
                            : "cursor-not-allowed opacity-50"
                    )}
                >
                    More
                </button>
            </div>
        </div>
    );
}
