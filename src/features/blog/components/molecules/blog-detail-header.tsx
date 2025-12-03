"use client";

import { useState } from "react";

import Image from "next/image";

import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    PinterestShareButton,
    WhatsappShareButton,
    FacebookIcon,
    LinkedinIcon,
    PinterestIcon,
    WhatsappIcon,
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
    const [copied, setCopied] = useState(false);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link:", err);
        }
    };

    return (
        <div className={cn("flex flex-col gap-5 md:gap-5", className)}>
            <div className="flex flex-col gap-5">
                <h1 className="font-inter text-left text-2xl leading-[1.21em] font-bold text-white md:text-[32px]">
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
            <div className="flex flex-col items-center gap-y-4">
                <div className="flex flex-wrap items-center gap-2 self-start">
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
                    <WhatsappShareButton url={url} title={title}>
                        <WhatsappIcon size={iconSize} round />
                    </WhatsappShareButton>
                    <button
                        onClick={handleCopyLink}
                        className="flex items-center justify-center rounded-full bg-gray-600 transition-colors hover:bg-gray-500"
                        title={copied ? "Copied!" : "Copy link"}
                        style={{
                            width: `${iconSize}px`,
                            height: `${iconSize}px`,
                        }}
                    >
                        {copied ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white"
                            >
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                        )}
                    </button>
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
