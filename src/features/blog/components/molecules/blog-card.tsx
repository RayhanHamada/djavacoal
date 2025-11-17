"use client";

import type { BlogPost } from "../../lib/types";

import Image from "next/image";
import Link from "next/link";

import { formatBlogDate, getBlogPlaceholderImage } from "../../lib/utils";
import { DateBadge, ArrowIcon } from "../atoms";
import { cn } from "@/lib/utils";

interface BlogCardProps extends BlogPost {
    className?: string;
}

/**
 * BlogCard - Individual blog post card component
 * Displays blog post preview with image, date, and title
 */
export function BlogCard({
    slug,
    title,
    published_at,
    cover_image_url,
    className,
}: BlogCardProps) {
    const formattedDate = formatBlogDate(published_at);

    return (
        <Link
            href={`/blog/${slug}`}
            className={cn(
                "group flex max-w-[400px] flex-col gap-2.5",
                className
            )}
        >
            <div className="relative aspect-square w-full overflow-hidden">
                <Image
                    src={cover_image_url || getBlogPlaceholderImage()}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="text-secondary flex flex-col gap-1">
                <DateBadge date={formattedDate} />
            </div>
            <div className="flex items-start justify-between gap-5">
                <h3 className="font-inter group-hover:text-secondary line-clamp-2 flex-1 text-[21px] leading-[1.21em] font-normal text-white transition-colors">
                    {title}
                </h3>
                <ArrowIcon className="text-secondary mt-2 transition-colors group-hover:text-white" />
            </div>
        </Link>
    );
}
