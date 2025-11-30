import type { PaginationDirection } from "../../lib/types";

import { cn } from "@/lib/utils";

interface PaginationArrowIconProps {
    direction: PaginationDirection;
    className?: string;
}

/**
 * PaginationArrowIcon - Chevron arrow SVG for pagination navigation
 * Rotates 180 degrees when direction is "prev"
 */
export function PaginationArrowIcon({
    direction,
    className,
}: PaginationArrowIconProps) {
    return (
        <svg
            width="15"
            height="30"
            viewBox="0 0 15 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(direction === "prev" && "rotate-180", className)}
            aria-hidden="true"
        >
            <path
                d="M1.9375 7.04297L11.0742 15.9141L1.9375 24.7852"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
