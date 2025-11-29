"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import dayjs from "dayjs";

import {
    clearNewsPreviewData,
    getNewsPreviewData,
    type NewsPreviewData,
} from "../../lib/preview";
import { PreviewLanguageSwitcher } from "../atoms";
import { PreviewDetailSection } from "../organism";

type PreviewLocale = "en" | "ar";

/**
 * NewsPreviewPage - Full page preview for news articles
 *
 * Reads preview data from local storage and displays it using
 * the same layout as the visitor blog detail page.
 *
 * Features:
 * - Language switcher (EN/AR) floating button
 * - Automatic cleanup of preview data on unmount
 * - Error state when no preview data is found
 */
export function NewsPreviewPage() {
    const [previewData, setPreviewData] = useState<NewsPreviewData | null>(
        null
    );
    const [locale, setLocale] = useState<PreviewLocale>("en");
    const [isLoading, setIsLoading] = useState(true);

    // Load preview data from local storage on mount
    useEffect(() => {
        const data = getNewsPreviewData();
        setPreviewData(data);
        setIsLoading(false);

        // Cleanup preview data when leaving the page
        return () => {
            clearNewsPreviewData();
        };
    }, []);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#161616]">
                <div className="text-white">Loading preview...</div>
            </div>
        );
    }

    if (!previewData) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#161616] px-4">
                <div className="text-center">
                    <h1 className="mb-4 text-2xl font-bold text-white">
                        No Preview Data
                    </h1>
                    <p className="mb-6 text-gray-400">
                        Preview data has expired or was not found.
                        <br />
                        Please go back to the editor and click Preview again.
                    </p>
                    <Link
                        href="/dashboard/news"
                        className="rounded-md bg-[#EFA12D] px-6 py-3 font-medium text-black transition-colors hover:bg-[#d8922a]"
                    >
                        Back to News Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // Select content based on current locale
    const title = locale === "en" ? previewData.enTitle : previewData.arTitle;
    const content =
        locale === "en" ? previewData.enContent : previewData.arContent;
    const date = dayjs(previewData.publishedAt).format("DD MMMM YYYY");

    return (
        <div
            className="min-h-screen bg-[#161616]"
            dir={locale === "ar" ? "rtl" : "ltr"}
        >
            {/* Preview Banner */}
            <div className="bg-[#EFA12D] px-4 py-2 text-center text-sm font-medium text-black">
                Preview Mode - This is how your article will look when published
                <Link
                    href="/dashboard/news"
                    className="ml-4 underline hover:no-underline"
                >
                    ← Back to Editor
                </Link>
            </div>

            {/* Blog Hero */}
            <div
                className="bg-gradient-radial relative flex h-[350px] w-full flex-col items-center justify-center gap-[214px] overflow-hidden from-[rgba(219,172,102,1)] from-72% to-[rgba(21,21,21,0.3)] to-39%"
                style={{
                    backgroundImage: "url(/images/bg-banner-header.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <h1 className="px-4 text-center text-2xl font-semibold text-white italic md:text-4xl">
                        {title || "Untitled Article"}
                    </h1>
                </div>
                <div className="absolute bottom-0 left-0 h-px w-full bg-[#474747]" />
            </div>

            {/* Main Content */}
            <PreviewDetailSection
                article={{
                    title: title || "Untitled Article",
                    date,
                    imageUrl: previewData.coverImageUrl || "/images/logo.png",
                    content: content || "<p>No content yet...</p>",
                }}
            />

            {/* Language Switcher */}
            <PreviewLanguageSwitcher
                locale={locale}
                onLocaleChange={setLocale}
            />
        </div>
    );
}
