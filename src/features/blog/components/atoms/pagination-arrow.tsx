"use client";

import type { PaginationDirection } from "../../lib/types";

import { PaginationArrowIcon } from "./pagination-arrow-icon";
import { getPaginationArrowLabel } from "../../lib/utils";
import { cn } from "@/lib/utils";

interface PaginationArrowProps {
    direction: PaginationDirection;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

/**
 * PaginationArrow - Client-side pagination arrow button
 * Uses onClick handler for client-side navigation
 */
export function PaginationArrow({
    direction,
    onClick,
    disabled = false,
    className,
}: PaginationArrowProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "hover:text-secondary flex h-[30px] w-[15px] items-center justify-center text-white transition-opacity hover:opacity-70 disabled:opacity-30",
                className
            )}
            aria-label={getPaginationArrowLabel(direction)}
        >
            <PaginationArrowIcon direction={direction} />
        </button>
    );
}
