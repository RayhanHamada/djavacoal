import React from "react";

import { headers } from "next/headers";
import { notFound } from "next/navigation";

import dayjs from "dayjs";
import { Metadata } from "next";

import { serverPublicAPIClient } from "@/adapters/public-api/server";
import { BlogDetailSection } from "@/features/blog/components/organism";

// Mock article data

// Mock related articles
const mockRelatedArticles = [
    {
        id: "2",
        title: "Innovation in Coal Processing Technology",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-2.png",
    },
    {
        id: "3",
        title: "Safety Standards in Modern Mining Operations",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-3.png",
    },
    {
        id: "4",
        title: "The Future of Energy: Coal's Evolving Role",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-4.png",
    },
    {
        id: "5",
        title: "The Future of Energy: Coal's Evolving Role",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-4.png",
    },
    {
        id: "6",
        title: "The Future of Energy: Coal's Evolving Role",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-4.png",
    },
    {
        id: "7",
        title: "The Future of Energy: Coal's Evolving Role",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-4.png",
    },
    {
        id: "8",
        title: "The Future of Energy: Coal's Evolving Role",
        date: "19 Sep 2025",
        imageUrl: "/images/blog/blog-thumbnail-4.png",
    },
];

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    const { error, data } = await serverPublicAPIClient.GET(
        "/news/{slug}/metadata",
        {
            params: {
                path: {
                    slug,
                },
            },
        }
    );

    if (error) {
        return {};
    }

    const metadata = data.data;

    return {
        title: metadata.meta_title,
        description: metadata.meta_description,
        openGraph: {
            type: "article",
            title: metadata.meta_title,
            description: metadata.meta_description,
            images: metadata.cover_image_url ? [metadata.cover_image_url] : [],
            authors: "Djavacoal Team",
            alternateLocale: ["ar-SA", "en-US"],
            locale: "en-US",
            publishedTime: metadata.published_at,
        },
    };
}

export default async function Page({ params }: Props) {
    const { slug } = await params;

    const { error, data } = await serverPublicAPIClient.GET("/news/{slug}", {
        params: {
            path: {
                slug,
            },
        },
        headers: await headers(),
    });

    if (error || !data?.data) {
        throw notFound();
    }

    const news = data.data;

    return (
        <BlogDetailSection
            article={{
                author: "",
                title: news.title,
                content: news.content,
                imageUrl: news.cover_image_url ?? undefined,
                date: dayjs(news.published_at).format("DD MMMM YYYY"),
            }}
            relatedArticles={mockRelatedArticles}
        />
    );
}
