"use client";

import { useState } from "react";

import { BlogListSection } from "@/features/blog/components";
import { useNewsListAPI } from "@/features/public-api/hooks";

export default function BlogPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    const {
        data: newsResponse,
        isLoading,
        error,
    } = useNewsListAPI({
        page: currentPage,
        limit: postsPerPage,
    });

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#161616]">
                <div className="text-white">Loading news articles...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#161616]">
                <div className="text-red-500">
                    Failed to load news articles. Please try again later.
                </div>
            </div>
        );
    }

    const newsData = newsResponse?.data.news;
    const rawPosts = newsData?.data || [];
    const totalPages = newsData?.total_pages || 1;

    // Convert date strings to Date objects
    const posts = rawPosts.map((post) => ({
        ...post,
        published_at: new Date(post.published_at),
    }));

    return (
        <BlogListSection
            posts={posts}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
    );
}
