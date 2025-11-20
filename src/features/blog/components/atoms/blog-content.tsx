import "./blog-content.css";

import { cn } from "@/lib/utils";

interface BlogContentProps {
    content: string;
    className?: string;
}

export function BlogContent({ content, className }: BlogContentProps) {
    return (
        <div
            className={cn(
                "prose prose-invert max-w-none py-10",
                "font-open-sans text-base leading-[1.36em] font-normal text-[#C6C6C6]",
                "text-wrap [&_p]:text-wrap [&>h1]:mb-4 [&>h2]:mb-4 [&>h3]:mb-4 [&>p]:mb-6",
                className
            )}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
