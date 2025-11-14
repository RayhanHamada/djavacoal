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
                "flex h-[50px] w-[50px] items-center justify-center text-xl leading-[1.5em] font-bold transition-colors hover:cursor-pointer hover:bg-white/10",
                isActive
                    ? "bg-secondary text-[#161616]"
                    : "border border-[#8C8C8C] bg-[#161616] text-[#8C8C8C] hover:bg-white/20",
                className
            )}
            aria-current={isActive ? "page" : undefined}
        >
            {page}
        </button>
    );
}
