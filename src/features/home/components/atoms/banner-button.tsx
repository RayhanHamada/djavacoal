"use client";

import type { ButtonVariant } from "../../lib/types";

import React from "react";

import { cn } from "@/lib/utils";

interface BannerButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

/**
 * BannerButton component for hero/banner sections
 * Supports primary, secondary, and outline variants
 */
export const BannerButton = React.forwardRef<
    HTMLButtonElement,
    BannerButtonProps
>(function BannerButton({ variant = "primary", className, ...rest }, ref) {
    const variantClasses = {
        primary: "border-white bg-black/40 text-white hover:bg-black/60",
        secondary:
            "border-[#EFA12D] bg-black/40 text-[#EFA12D] hover:bg-black/60",
        outline:
            "border-[#EFA12D] bg-transparent text-[#EFA12D] hover:bg-[#EFA12D]/10",
    };

    return (
        <button
            ref={ref}
            className={cn(
                "rounded-[40px] border px-8 py-4 font-['Josefin_Sans'] text-[15px] font-bold whitespace-nowrap backdrop-blur-sm transition-all duration-300 sm:text-[16px] md:px-10 md:py-5",
                variantClasses[variant],
                className
            )}
            {...rest}
        />
    );
});
