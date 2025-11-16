import { BlogCardSkeleton } from "../atoms/blog-card-skeleton";
import { cn } from "@/lib/utils";

interface BlogGridSkeletonProps {
    className?: string;
}

export function BlogGridSkeleton({ className }: BlogGridSkeletonProps) {
    return (
        <div
            className={cn(
                "grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-3",
                className
            )}
        >
            {Array.from({ length: 3 }).map((_, index) => (
                <BlogCardSkeleton key={index} />
            ))}
        </div>
    );
}
