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
    postsPerPage = 6,
    className,
}: BlogListSectionProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(posts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

    return (
        <div className={cn("flex flex-col bg-[#161616]", className)}>
            <BlogHero title={title} />
            <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-20 bg-[#161616] px-5 py-20 md:px-20 md:py-[100px]">
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
