"use client";

import type { BlogPost } from "../../lib/types";

import { BlogHero, BlogGrid, BlogGridSkeleton, Pagination } from "../molecules";
import { cn } from "@/lib/utils";

interface BlogListSectionProps {
    posts: BlogPost[];
    title?: string;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    isLoading?: boolean;
}

/**
 * BlogListSection - Main blog list page organism
 * Combines hero, grid, and pagination for complete blog listing experience
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
    return (
        <div className={cn("flex flex-col bg-[#161616]", className)}>
            <BlogHero title={title} />
            <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-20 bg-[#161616] px-5 py-20 md:px-20 md:py-[100px]">
                {isLoading ? (
                    <BlogGridSkeleton />
                ) : (
                    <>
                        <BlogGrid posts={posts} />
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={onPageChange}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
