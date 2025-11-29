import { forwardRef } from "react";

import { cn } from "@/lib/utils";

interface BlogContentProps {
    content: string;
    className?: string;
}

export const BlogContent = forwardRef<HTMLDivElement, BlogContentProps>(
    function _({ content, className }, ref) {
        return (
            <div
                ref={ref}
                className={cn(
                    "prose prose-invert max-w-none py-10",
                    "font-open-sans text-base leading-[1.36em] font-normal text-[#C6C6C6]",
                    "text-wrap [&_p]:overflow-clip [&_p]:text-wrap [&>h1]:mb-4 [&>h2]:mb-4 [&>h3]:mb-4 [&>p]:mb-6",
                    "[&>h2]:text-2xl [&>h3]:text-xl [&>h4]:text-lg",
                    "[&>h2]:font-semibold [&>h3]:font-semibold [&>h4]:font-semibold",
                    "[&_li]:mb-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6",
                    "[&_blockquote]:mb-6 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-600 [&_blockquote]:pl-4 [&_blockquote]:text-gray-400 [&_blockquote]:italic",
                    "[&_a]:text-blue-400 [&_a]:underline [&_a:hover]:text-blue-500",
                    className
                )}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        );
    }
);
