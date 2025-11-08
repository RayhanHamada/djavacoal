import { BlogCard } from "./blog-card";
import { cn } from "@/lib/utils";

interface BlogPost {
    id: string;
    title: string;
    date: string;
    imageUrl: string;
}

interface BlogGridProps {
    posts: BlogPost[];
    className?: string;
}

export function BlogGrid({ posts, className }: BlogGridProps) {
    return (
        <div
            className={cn(
                "grid max-w-[1280px] gap-10 sm:grid-cols-2 lg:grid-cols-3",
                className
            )}
        >
            {posts.map((post) => (
                <BlogCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    date={post.date}
                    imageUrl={post.imageUrl}
                />
            ))}
        </div>
    );
}
