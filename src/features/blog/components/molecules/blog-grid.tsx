import type { BlogPost } from "../../lib/types";

import { BlogCard } from "./blog-card";
import { cn } from "@/lib/utils";

interface BlogGridProps {
    posts: BlogPost[];
    className?: string;
}

/**
 * BlogGrid - Grid layout for blog posts
 * Responsive grid that displays blog post cards
 */
export function BlogGrid({ posts, className }: BlogGridProps) {
    return (
        <div
            className={cn(
                "grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-3",
                className
            )}
        >
            {posts.map((post) => (
                <BlogCard
                    key={post.id}
                    id={post.id}
                    slug={post.slug}
                    title={post.title}
                    published_at={post.published_at}
                    cover_image_url={post.cover_image_url}
                />
            ))}
        </div>
    );
}
