"use client";

import React from "react";

import { BlogContent } from "../atoms";
import { BlogDetailHeader } from "../molecules";
import { RelatedArticles } from "../molecules";

export interface BlogDetailSectionProps {
    article: {
        title: string;
        date: string;
        author: string;
        imageUrl: string;
        content: string;
    };
    relatedArticles: Array<{
        id: string;
        title: string;
        date: string;
        imageUrl: string;
    }>;
}

export function BlogDetailSection({
    article,
    relatedArticles,
}: BlogDetailSectionProps) {
    return (
        <div className="min-h-screen bg-[#161616]">
            {/* Hero/Header Section */}
            <BlogDetailHeader
                title={article.title}
                date={article.date}
                author={article.author}
                imageUrl={article.imageUrl}
            />

            {/* Content Section */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Main Content - 8 columns on desktop */}
                    <div className="lg:col-span-8">
                        <BlogContent content={article.content} />
                    </div>

                    {/* Sidebar - 4 columns on desktop */}
                    <aside className="lg:col-span-4">
                        <div className="lg:sticky lg:top-8">
                            <RelatedArticles articles={relatedArticles} />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
