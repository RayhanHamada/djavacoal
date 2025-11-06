"use client";

import Image from "next/image";
import Link from "next/link";

import { DateBadge, ArrowIcon } from "../atoms";
import { cn } from "@/lib/utils";

interface BlogCardProps {
    id: string;
    title: string;
    date: string;
    imageUrl: string;
    className?: string;
}

export function BlogCard({
    id,
    title,
    date,
    imageUrl,
    className,
}: BlogCardProps) {
    return (
        <Link
            href={`/blog-detail?id=${id}`}
            className={cn(
                "group flex max-w-[400px] flex-col gap-2.5",
                className
            )}
        >
            <div className="relative aspect-[377/377] w-full overflow-hidden md:aspect-[377/377]">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="text-secondary flex flex-col gap-1">
                <DateBadge date={date} />
            </div>
            <div className="flex items-start justify-between gap-5">
                <h3 className="font-inter group-hover:text-primary flex-1 text-[21px] leading-[1.21em] font-normal text-white transition-colors">
                    {title}
                </h3>
                <ArrowIcon className="group-hover:text-primary text-secondary mt-2 transition-colors" />
            </div>
        </Link>
    );
}
