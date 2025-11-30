/**
 * PaginationLinks - Server-side pagination component using Next.js Links
 * Enables SSR-friendly pagination without client-side state
 */
import {
    DEFAULT_BLOG_BASE_URL,
    generatePageNumbers,
    getPaginationUrl,
} from "../../lib/utils";
import { PaginationLinkArrow, PaginationLinkButton } from "../atoms";
import { cn } from "@/lib/utils";

interface PaginationLinksProps {
    /** Current active page number */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** Base URL for pagination links */
    baseUrl?: string;
    /** Additional CSS classes */
    className?: string;
}

/**
 * PaginationLinks - Complete SSR pagination control component
 * Combines PaginationLinkButton and PaginationLinkArrow atoms for URL-based navigation
 */
export function PaginationLinks({
    currentPage,
    totalPages,
    baseUrl = DEFAULT_BLOG_BASE_URL,
    className,
}: PaginationLinksProps) {
    const pages = generatePageNumbers(totalPages);

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    return (
        <nav
            className={cn(
                "flex items-center justify-center gap-5 md:gap-10",
                className
            )}
            aria-label="Blog pagination"
        >
            <PaginationLinkArrow
                direction="prev"
                href={getPaginationUrl(baseUrl, currentPage - 1)}
                disabled={isFirstPage}
            />
            <div className="flex items-center gap-5">
                {pages.map((page) => (
                    <PaginationLinkButton
                        key={page}
                        page={page}
                        isActive={currentPage === page}
                        href={getPaginationUrl(baseUrl, page)}
                    />
                ))}
            </div>
            <PaginationLinkArrow
                direction="next"
                href={getPaginationUrl(baseUrl, currentPage + 1)}
                disabled={isLastPage}
            />
        </nav>
    );
}
