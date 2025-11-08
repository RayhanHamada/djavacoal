"use client";

import { cn } from "@/lib/utils";

interface PaginationArrowProps {
    direction: "prev" | "next";
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

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
            aria-label={direction === "prev" ? "Previous page" : "Next page"}
        >
            <svg
                width="15"
                height="30"
                viewBox="0 0 15 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={cn(direction === "prev" ? "rotate-180" : "")}
            >
                <path
                    d="M1.9375 7.04297L11.0742 15.9141L1.9375 24.7852"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
}
