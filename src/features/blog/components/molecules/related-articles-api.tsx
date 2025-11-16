"use client";

import { useMemo } from "react";

import { RelatedArticles } from "./related-articles";
import { useRelatedArticlesAPI } from "@/features/public-api/hooks";

interface RelatedArticlesApiProps {
    excludeSlug?: string;
    limit?: number;
    title?: string;
    className?: string;
}

export function RelatedArticlesApi({
    excludeSlug,
    limit = 10,
    title = "Newest",
    className,
}: RelatedArticlesApiProps) {
    const {
        data: blogResponse,
        isLoading,
        error,
        hasNextPage,
        fetchNextPage,
    } = useRelatedArticlesAPI({
        limit,
    });
    // Transform the API response data to match the RelatedArticles component interface
    const articles = useMemo(() => {
        const blogs =
            blogResponse?.pages.flatMap((page) => page.data.news.data) || [];
        if (!blogs.length) return [];

        return blogs
            .filter((blog) => blog.slug !== excludeSlug) // Exclude current article
            .map((blog) => ({
                id: blog.id,
                slug: blog.slug,
                title: blog.title,
                date: new Date(blog.published_at).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }),
                imageUrl:
                    blog.cover_image_url ||
                    "/images/blog/default-thumbnail.png",
            }));
    }, [blogResponse, excludeSlug]);

    // Convert API error to standard Error if needed
    const errorObject = error
        ? new Error(error.message || "Failed to load articles")
        : null;

    return (
        <RelatedArticles
            articles={articles}
            title={title}
            className={className}
            isLoading={isLoading}
            error={errorObject}
            hasMore={hasNextPage}
            loadMore={fetchNextPage}
        />
    );
}
