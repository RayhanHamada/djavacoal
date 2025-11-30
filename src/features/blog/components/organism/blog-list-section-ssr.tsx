import type { BlogPost } from "../../lib/types";

import { BlogGrid, BlogHero, PaginationLinks } from "../molecules";
import { cn } from "@/lib/utils";

interface BlogListSectionSSRProps {
    /** Array of blog posts to display */
    posts: BlogPost[];
    /** Section title */
    title?: string;
    /** Current page number */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** Additional CSS classes */
    className?: string;
}

/**
 * BlogListSectionSSR - Server-side rendered blog list page organism
 * Combines hero, grid, and URL-based pagination for SSR-friendly blog listing
 */
export function BlogListSectionSSR({
    posts,
    title = "News & Article",
    currentPage,
    totalPages,
    className,
}: BlogListSectionSSRProps) {
    const showPagination = totalPages > 1;

    return (
        <section className={cn("flex flex-col bg-[#161616]", className)}>
            <BlogHero title={title} />
            <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-20 bg-[#161616] px-5 py-20 md:px-20 md:py-[100px]">
                <BlogGrid posts={posts} />
                {showPagination && (
                    <PaginationLinks
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                )}
            </div>
        </section>
    );
}
