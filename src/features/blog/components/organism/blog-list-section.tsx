"use client";

import { useState } from "react";

import { BlogHero, BlogGrid, Pagination } from "../molecules";
import { cn } from "@/lib/utils";

interface BlogPost {
    id: string;
    title: string;
    date: string;
    imageUrl: string;
}

interface BlogListSectionProps {
    posts: BlogPost[];
    title?: string;
    postsPerPage?: number;
    className?: string;
}

export function BlogListSection({
    posts,
    title = "News & Article",
    postsPerPage = 9,
    className,
}: BlogListSectionProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(posts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

    return (
        <div className={cn("flex flex-col", className)}>
            <BlogHero title={title} />
            <div className="flex flex-col gap-20 px-5 py-20 md:px-20 md:py-[100px]">
                <BlogGrid posts={currentPosts} />
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </div>
    );
}
