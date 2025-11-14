"use client";

import { BlogHero, BlogGrid, Pagination } from "../molecules";
import { cn } from "@/lib/utils";

interface BlogPost {
    id: number;
    slug: string;
    title: string;
    published_at: Date;
    cover_image_url: string | null;
}

interface BlogListSectionProps {
    posts: BlogPost[];
    title?: string;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function BlogListSection({
    posts,
    title = "News & Article",
    currentPage,
    totalPages,
    onPageChange,
    className,
}: BlogListSectionProps) {
    return (
        <div className={cn("flex flex-col bg-[#161616]", className)}>
            <BlogHero title={title} />
            <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-20 bg-[#161616] px-5 py-20 md:px-20 md:py-[100px]">
                <BlogGrid posts={posts} />
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
        </div>
    );
}
