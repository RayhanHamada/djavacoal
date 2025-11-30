"use client";

import type { BlogPost } from "../../lib/types";

import { BlogGrid, BlogGridSkeleton, BlogHero, Pagination } from "../molecules";
import { cn } from "@/lib/utils";

interface BlogListSectionProps {
    /** Array of blog posts to display */
    posts: BlogPost[];
    /** Section title */
    title?: string;
    /** Current page number */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** Callback function when page changes */
    onPageChange: (page: number) => void;
    /** Additional CSS classes */
    className?: string;
    /** Loading state flag */
    isLoading?: boolean;
}

/**
 * BlogListSection - Client-side blog list page organism
 * Combines hero, grid, and state-based pagination for client-side navigation
 */
export function BlogListSection({
    posts,
    title = "News & Article",
    currentPage,
    totalPages,
    onPageChange,
    className,
    isLoading = false,
}: BlogListSectionProps) {
    const showPagination = totalPages > 1;

    return (
        <section className={cn("flex flex-col bg-[#161616]", className)}>
            <BlogHero title={title} />
            <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-20 bg-[#161616] px-5 py-20 md:px-20 md:py-[100px]">
                {isLoading ? (
                    <BlogGridSkeleton />
                ) : (
                    <>
                        <BlogGrid posts={posts} />
                        {showPagination && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={onPageChange}
                            />
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
