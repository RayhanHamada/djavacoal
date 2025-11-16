import React from "react";

import { BlogContent } from "../atoms";
import { BlogDetailHeader } from "../molecules";
import { RelatedArticlesApi } from "../molecules";

export interface BlogDetailSectionProps {
    article: {
        title: string;
        date: string;
        author: string;
        imageUrl?: string;
        content: string;
        slug?: string; // Add slug for excluding current article
    };
}

export function BlogDetailSection({ article }: BlogDetailSectionProps) {
    return (
        <div className="items-center justify-center bg-[#161616]">
            {/* Content Section */}
            <div className="mx-auto max-w-7xl bg-[#161616] px-10 py-12 lg:px-10">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="text-justify lg:col-span-8">
                        {/* Hero/Header Section */}
                        <BlogDetailHeader
                            title={article.title}
                            date={article.date}
                            imageUrl={article.imageUrl}
                        />
                        {/* Main Content - 8 columns on desktop */}

                        <BlogContent content={article.content} />
                    </div>

                    {/* Sidebar - 4 columns on desktop */}
                    <aside className="lg:col-span-4">
                        <div className="lg:sticky lg:top-8">
                            <RelatedArticlesApi
                                excludeSlug={article.slug}
                                limit={5}
                            />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
