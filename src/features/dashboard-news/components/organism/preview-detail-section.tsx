"use client";

import {
    PreviewDetailHeader,
    PreviewRelatedArticlesPlaceholder,
} from "../molecules";
import { BlogContent } from "@/features/blog/components/atoms";

interface PreviewDetailSectionProps {
    /** Article data for preview */
    article: {
        title: string;
        date: string;
        imageUrl?: string;
        content: string;
    };
}

/**
 * PreviewDetailSection - Main preview section for news articles
 *
 * Mirrors the layout of BlogDetailSection from the blog feature
 * to provide accurate visual preview of how the article will look.
 */
export function PreviewDetailSection({ article }: PreviewDetailSectionProps) {
    return (
        <div className="items-center justify-center bg-[#161616]">
            {/* Content Section */}
            <div className="mx-auto max-w-7xl bg-[#161616] px-10 py-12 lg:px-10">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="text-justify lg:col-span-8">
                        {/* Hero/Header Section */}
                        <PreviewDetailHeader
                            title={article.title}
                            date={article.date}
                            imageUrl={article.imageUrl}
                        />
                        {/* Main Content */}
                        <BlogContent content={article.content} />
                    </div>

                    {/* Sidebar - Related articles placeholder */}
                    <aside className="lg:col-span-4">
                        <div className="lg:sticky lg:top-8">
                            <PreviewRelatedArticlesPlaceholder />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
