"use client";

import { PaginationButton, PaginationArrow } from "../atoms";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: PaginationProps) {
    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div
            className={cn(
                "flex items-center justify-center gap-5 md:gap-10",
                className
            )}
        >
            <PaginationArrow
                direction="prev"
                onClick={handlePrev}
                disabled={currentPage === 1}
            />
            <div className="flex items-center gap-5">
                {pages.map((page) => (
                    <PaginationButton
                        key={page}
                        page={page}
                        isActive={currentPage === page}
                        onClick={() => onPageChange(page)}
                    />
                ))}
            </div>
            <PaginationArrow
                direction="next"
                onClick={handleNext}
                disabled={currentPage === totalPages}
            />
        </div>
    );
}
