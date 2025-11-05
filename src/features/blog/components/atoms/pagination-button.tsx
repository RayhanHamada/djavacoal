"use client";

import { cn } from "@/lib/utils";

interface PaginationButtonProps {
    page: number;
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
}

export function PaginationButton({
    page,
    isActive = false,
    onClick,
    className,
}: PaginationButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex h-[50px] w-[50px] items-center justify-center text-xl leading-[1.5em] font-bold transition-colors",
                isActive
                    ? "bg-primary text-background"
                    : "hover:bg-primary/20 border border-[#8C8C8C] bg-[#8C8C8C] text-[#8C8C8C]",
                className
            )}
            aria-current={isActive ? "page" : undefined}
        >
            {page}
        </button>
    );
}
