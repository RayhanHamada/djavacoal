import type { PaginationDirection } from "../../lib/types";

import Link from "next/link";

import { PaginationArrowIcon } from "./pagination-arrow-icon";
import { getPaginationArrowLabel } from "../../lib/utils";
import { cn } from "@/lib/utils";

interface PaginationLinkArrowProps {
    direction: PaginationDirection;
    href: string;
    disabled?: boolean;
    className?: string;
}

/**
 * PaginationLinkArrow - Server-side pagination arrow using Next.js Link
 * Renders as span when disabled, Link when active
 */
export function PaginationLinkArrow({
    direction,
    href,
    disabled = false,
    className,
}: PaginationLinkArrowProps) {
    const ariaLabel = getPaginationArrowLabel(direction);

    const baseClassName = cn(
        "flex h-[30px] w-[15px] items-center justify-center text-white",
        className
    );

    if (disabled) {
        return (
            <span
                className={cn(baseClassName, "opacity-30")}
                aria-label={ariaLabel}
            >
                <PaginationArrowIcon direction={direction} />
            </span>
        );
    }

    return (
        <Link
            href={href}
            className={cn(
                baseClassName,
                "hover:text-secondary transition-opacity hover:opacity-70"
            )}
            aria-label={ariaLabel}
        >
            <PaginationArrowIcon direction={direction} />
        </Link>
    );
}
