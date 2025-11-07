"use client";

import type { SectionVariant } from "../../lib/types";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
    title: string;
    highlight?: string;
    subtitle?: string;
    variant?: SectionVariant;
    className?: string;
}

/**
 * SectionHeading component for consistent section titles across the homepage
 * Supports left-aligned and center-aligned variants with optional highlights and subtitles
 */
export function SectionHeading({
    title,
    highlight,
    subtitle,
    variant = "center",
    className,
}: SectionHeadingProps) {
    const isCenter = variant === "center";

    return (
        <div
            className={cn(
                "flex flex-col gap-3",
                isCenter ? "items-center text-center" : "items-start text-left",
                className
            )}
        >
            <h2
                className={cn(
                    "font-['Josefin_Sans'] font-bold text-white uppercase",
                    "text-[28px] md:text-[36px] lg:text-[40px]"
                )}
            >
                {title}{" "}
                {highlight && (
                    <span className="text-[#EFA12D]">{highlight}</span>
                )}
            </h2>

            {subtitle && (
                <p
                    className={cn(
                        "max-w-2xl font-['Open_Sans'] leading-relaxed text-[#C6C6C6]",
                        "text-[14px] md:text-[16px]"
                    )}
                >
                    {subtitle}
                </p>
            )}

            {!isCenter && (
                <div className="mt-3 h-1 w-[60px] rounded bg-[#EFA12D]" />
            )}
        </div>
    );
}
