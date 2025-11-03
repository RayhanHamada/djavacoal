"use client";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
    title: string;
    highlight?: string;
    subtitle?: string;
    variant?: "left" | "center";
    className?: string;
}

export default function SectionHeading({
    title,
    highlight,
    subtitle,
    variant = "center",
    className,
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                "flex flex-col gap-3",
                variant === "center"
                    ? "items-center text-center"
                    : "items-start text-left",
                className
            )}
        >
            <h2
                className={cn(
                    "font-['Josefin_Sans'] font-bold uppercase",
                    "text-[28px] text-white md:text-[36px] lg:text-[40px]"
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

            {variant === "left" && (
                <div className="mt-3 h-1 w-[60px] rounded bg-[#EFA12D]" />
            )}
        </div>
    );
}
