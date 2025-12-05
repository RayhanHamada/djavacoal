"use client";

import type { NewsItem } from "../../lib/types";

import Link from "next/link";

import { NewsCardContent, NewsCardImage } from "../atoms";
import { cn } from "@/lib/utils";

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
    return (
        <Link href={`/blog/${slug}`}>
            <article
                className={cn(
                    "group relative mx-auto flex w-full max-w-11/12 flex-col justify-center overflow-hidden md:max-w-[500px]",
                    className
                )}
            >
                <NewsCardImage coverImage={coverImage} alt={title} />
                <NewsCardContent title={title} publishedAt={publishedAt} />
            </article>
        </Link>
    );
}
