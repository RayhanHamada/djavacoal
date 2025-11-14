"use client";

import Image from "next/image";
import Link from "next/link";

import { DateBadge, ArrowIcon } from "../atoms";
import { cn } from "@/lib/utils";

interface BlogCardProps {
    id: number;
    slug: string;
    title: string;
    published_at: Date;
    cover_image_url: string | null;
    className?: string;
}

export function BlogCard({
    slug,
    title,
    published_at,
    cover_image_url,
    className,
}: BlogCardProps) {
    // Format date for display
    const formattedDate = published_at.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <Link
            href={`/blog-detail/${slug}`}
            className={cn(
                "group flex max-w-[400px] flex-col gap-2.5",
                className
            )}
        >
            <div className="relative aspect-square w-full overflow-hidden">
                <Image
                    src={cover_image_url || "/images/blog/blog-placeholder.png"}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="text-secondary flex flex-col gap-1">
                <DateBadge date={formattedDate} />
            </div>
            <div className="flex items-start justify-between gap-5">
                <h3 className="font-inter group-hover:text-secondary flex-1 text-[21px] leading-[1.21em] font-normal text-white transition-colors">
                    {title}
                </h3>
                <ArrowIcon className="text-secondary mt-2 transition-colors group-hover:text-white" />
            </div>
        </Link>
    );
}
