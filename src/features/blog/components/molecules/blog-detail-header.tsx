"use client";

import Image from "next/image";

import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    PinterestShareButton,
    FacebookIcon,
    LinkedinIcon,
    PinterestIcon,
    XIcon,
} from "react-share";

import { DateBadge } from "../atoms";
import { cn } from "@/lib/utils";

interface BlogDetailHeaderProps {
    title: string;
    date: string;
    imageUrl?: string;
    className?: string;
}

export function BlogDetailHeader({
    title,
    date,
    imageUrl = "/images/logo.png",
    className,
}: BlogDetailHeaderProps) {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const iconSize = 32;

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
                    <DateBadge date={date} />
                </div>
                <div className="h-px w-full bg-[#474747]" />
            </div>
            <div className="flex flex-col items-center gap-y-2">
                <div className="flex gap-x-2 self-start">
                    <FacebookShareButton url={url}>
                        <FacebookIcon size={iconSize} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={url}>
                        <XIcon size={iconSize} round />
                    </TwitterShareButton>
                    <LinkedinShareButton url={url}>
                        <LinkedinIcon size={iconSize} round />
                    </LinkedinShareButton>
                    <PinterestShareButton url={url} media={imageUrl}>
                        <PinterestIcon size={iconSize} round />
                    </PinterestShareButton>
                </div>
                <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </div>
    );
}
