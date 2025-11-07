import type { ButtonVariant } from "../../lib/types";

import Link from "next/link";

import { cn } from "@/lib/utils";

interface CTAButtonProps {
    href: string;
    children: React.ReactNode;
    variant?: ButtonVariant;
    className?: string;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
    primary:
        "border-[#EFA12D] bg-[#EFA12D] text-[#151515] hover:bg-transparent hover:text-[#EFA12D]",
    secondary:
        "border-white bg-black/40 text-white backdrop-blur-sm hover:bg-black/60",
    outline:
        "border-[#EFA12D] bg-transparent text-[#EFA12D] hover:bg-[#EFA12D] hover:text-[#151515]",
};

/**
 * CTAButton component for call-to-action links
 * Supports primary, secondary, and outline variants
 */
export function CTAButton({
    href,
    children,
    variant = "primary",
    className,
}: CTAButtonProps) {
    return (
        <Link
            href={href}
            className={cn(
                "inline-block rounded-[40px] border-2 px-8 py-3 font-['Open_Sans'] text-[14px] font-semibold uppercase transition-all duration-300 md:px-10 md:py-4 md:text-[15px]",
                VARIANT_STYLES[variant],
                className
            )}
        >
            {children}
        </Link>
    );
}
