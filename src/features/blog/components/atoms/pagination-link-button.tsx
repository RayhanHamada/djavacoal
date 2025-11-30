import Link from "next/link";

import { cn } from "@/lib/utils";

interface PaginationLinkButtonProps {
    page: number;
    isActive?: boolean;
    href: string;
    className?: string;
}

/**
 * PaginationLinkButton - Server-side pagination button using Link
 * Displays page number with active state styling for SSR pages
 */
export function PaginationLinkButton({
    page,
    isActive = false,
    href,
    className,
}: PaginationLinkButtonProps) {
    if (isActive) {
        return (
            <span
                className={cn(
                    "flex h-[50px] w-[50px] items-center justify-center text-xl leading-[1.5em] font-bold",
                    "bg-secondary text-[#161616]",
                    className
                )}
                aria-current="page"
            >
                {page}
            </span>
        );
    }

    return (
        <Link
            href={href}
            className={cn(
                "flex h-[50px] w-[50px] items-center justify-center text-xl leading-[1.5em] font-bold transition-colors hover:cursor-pointer hover:bg-white/10",
                "border border-[#8C8C8C] bg-[#161616] text-[#8C8C8C] hover:bg-white/20",
                className
            )}
        >
            {page}
        </Link>
    );
}
