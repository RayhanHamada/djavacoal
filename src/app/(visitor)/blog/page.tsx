import { headers } from "next/headers";

import { serverPublicAPIClient } from "@/adapters/public-api/server";
import { BlogListSectionSSR } from "@/features/blog/components";

/** Number of posts to display per page */
const POSTS_PER_PAGE = 9;

type Props = {
    searchParams: Promise<{
        page?: string;
    }>;
};

/**
 * Parse page number from search params
 * @param pageParam - Raw page parameter from URL
 * @returns Validated page number (minimum 1)
 */
function parsePageNumber(pageParam?: string) {
    const parsed = parseInt(pageParam || "1", 10);
    return Math.max(1, isNaN(parsed) ? 1 : parsed);
}

export default async function BlogPage({ searchParams }: Props) {
    const { page: pageParam } = await searchParams;
    const currentPage = parsePageNumber(pageParam);

    const { data: newsResponseData, error } = await serverPublicAPIClient.GET(
        "/news",
        {
            params: {
                query: {
                    page: currentPage,
                    limit: POSTS_PER_PAGE,
                },
            },
            headers: await headers(),
        }
    );

    if (error || !newsResponseData?.data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#161616]">
                <div className="text-red-500">
                    Failed to load news articles. Please try again later.
                </div>
            </div>
        );
    }

    const { news: newsData } = newsResponseData.data;
    const rawPosts = newsData.data || [];
    const totalPages = newsData.total_pages || 1;

    // Transform API response to BlogPost type with Date objects
    const posts = rawPosts.map((post) => ({
        ...post,
        published_at: new Date(post.published_at),
    }));

    return (
        <BlogListSectionSSR
            posts={posts}
            currentPage={currentPage}
            totalPages={totalPages}
        />
    );
}
