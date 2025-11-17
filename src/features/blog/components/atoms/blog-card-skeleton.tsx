import { cn } from "@/lib/utils";

interface BlogCardSkeletonProps {
    className?: string;
}

export function BlogCardSkeleton({ className }: BlogCardSkeletonProps) {
    return (
        <div className={cn("flex max-w-[400px] flex-col gap-2.5", className)}>
            {/* Image skeleton */}
            <div className="aspect-square w-full animate-pulse overflow-hidden rounded-sm bg-gray-700/50" />

            {/* Date badge skeleton */}
            <div className="flex flex-col gap-1">
                <div className="h-5 w-20 animate-pulse rounded bg-gray-700/50" />
            </div>

            {/* Title and arrow skeleton */}
            <div className="flex items-start justify-between gap-5">
                <div className="flex-1 space-y-2">
                    <div className="h-6 w-full animate-pulse rounded bg-gray-700/50" />
                    <div className="h-6 w-3/4 animate-pulse rounded bg-gray-700/50" />
                </div>
                <div className="mt-2 h-4 w-4 animate-pulse rounded bg-gray-700/50" />
            </div>
        </div>
    );
}
