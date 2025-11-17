import type {
    BlogArticleData,
    SitemapEntry,
    StaticPageData,
} from "@/features/sitemap/lib/types";

import { eq } from "drizzle-orm";

import {
    COMMON_COLUMNS,
    NEWS_COLUMNS,
    NEWS_STATUS,
    PAGE_METADATA_COLUMNS,
} from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { news, pageMetadatas } from "@/adapters/d1/schema";
import { BLOG_SITEMAP_CONFIG } from "@/features/sitemap/lib/constants";
import {
    escapeXml,
    formatLastMod,
    generateSitemapFooter,
    generateSitemapHeader,
} from "@/features/sitemap/server/helpers";

/**
 * Fetches all static page metadata from the database
 */
export async function getStaticPages(
    db: ReturnType<typeof getDB>
): Promise<StaticPageData[]> {
    return await db
        .select({
            path: pageMetadatas[PAGE_METADATA_COLUMNS.PATH],
            priority: pageMetadatas[PAGE_METADATA_COLUMNS.SITEMAP_PRIORITY],
            changefreq: pageMetadatas[PAGE_METADATA_COLUMNS.SITEMAP_CHANGEFREQ],
            updatedAt: pageMetadatas[COMMON_COLUMNS.UPDATED_AT],
        })
        .from(pageMetadatas)
        .orderBy(pageMetadatas[PAGE_METADATA_COLUMNS.PATH]);
}

/**
 * Fetches all published blog articles from the database
 */
export async function getBlogArticles(
    db: ReturnType<typeof getDB>
): Promise<BlogArticleData[]> {
    return await db
        .select({
            slug: news[NEWS_COLUMNS.SLUG],
            updatedAt: news[COMMON_COLUMNS.UPDATED_AT],
        })
        .from(news)
        .where(eq(news[NEWS_COLUMNS.STATUS], NEWS_STATUS.PUBLISHED))
        .orderBy(news[COMMON_COLUMNS.UPDATED_AT]);
}

/**
 * Generates a single sitemap URL entry
 */
export function generateSitemapEntry(entry: SitemapEntry): string {
    let xml = `
    <url>
        <loc>${escapeXml(entry.loc)}</loc>`;

    if (entry.lastmod) {
        xml += `
        <lastmod>${entry.lastmod}</lastmod>`;
    }

    if (entry.changefreq) {
        xml += `
        <changefreq>${escapeXml(entry.changefreq)}</changefreq>`;
    }

    if (entry.priority !== null && entry.priority !== undefined) {
        xml += `
        <priority>${entry.priority.toFixed(1)}</priority>`;
    }

    xml += `
    </url>`;

    return xml;
}

/**
 * Generates complete sitemap XML for static pages
 */
export function generateStaticPagesSitemap(
    pages: StaticPageData[],
    baseURL: string
): string {
    let sitemap = generateSitemapHeader();

    for (const page of pages) {
        const entry: SitemapEntry = {
            loc: new URL(page.path, baseURL).toString(),
            lastmod: formatLastMod(page.updatedAt),
            changefreq: page.changefreq as SitemapEntry["changefreq"],
            priority: page.priority ?? undefined,
        };

        sitemap += generateSitemapEntry(entry);
    }

    sitemap += generateSitemapFooter();
    return sitemap;
}

/**
 * Generates complete sitemap XML for blog articles
 */
export function generateBlogSitemap(
    articles: BlogArticleData[],
    baseURL: string
): string {
    let sitemap = generateSitemapHeader();

    for (const article of articles) {
        const entry: SitemapEntry = {
            loc: new URL(`/blog/${article.slug}`, baseURL).toString(),
            lastmod: formatLastMod(article.updatedAt),
            changefreq: BLOG_SITEMAP_CONFIG.changefreq,
            priority: BLOG_SITEMAP_CONFIG.priority,
        };

        sitemap += generateSitemapEntry(entry);
    }

    sitemap += generateSitemapFooter();
    return sitemap;
}
