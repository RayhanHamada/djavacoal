import type {
    BlogArticleData,
    ProductData,
    SitemapEntry,
    StaticPageData,
} from "@/features/sitemap/lib/types";

import { eq } from "drizzle-orm";

import {
    COMMON_COLUMNS,
    NEWS_COLUMNS,
    NEWS_STATUS,
    PAGE_METADATA_COLUMNS,
    PRODUCT_COLUMNS,
} from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { news, pageMetadatas, products } from "@/adapters/d1/schema";
import {
    BLOG_SITEMAP_CONFIG,
    PRODUCTS_SITEMAP_CONFIG,
} from "@/features/sitemap/lib/constants";
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
 * Fetches all non-hidden products from the database
 */
export async function getProducts(
    db: ReturnType<typeof getDB>
): Promise<ProductData[]> {
    return await db
        .select({
            id: products[COMMON_COLUMNS.ID],
            updatedAt: products[COMMON_COLUMNS.UPDATED_AT],
        })
        .from(products)
        .where(eq(products[PRODUCT_COLUMNS.IS_HIDDEN], false))
        .orderBy(products[PRODUCT_COLUMNS.ORDER_INDEX]);
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
    baseURL: string,
    settings?: { changefreq: string; priority: number }
): string {
    let sitemap = generateSitemapHeader();

    const config = settings || BLOG_SITEMAP_CONFIG;

    for (const article of articles) {
        const entry: SitemapEntry = {
            loc: new URL(`/blog/${article.slug}`, baseURL).toString(),
            lastmod: formatLastMod(article.updatedAt),
            changefreq: config.changefreq as SitemapEntry["changefreq"],
            priority: config.priority,
        };

        sitemap += generateSitemapEntry(entry);
    }

    sitemap += generateSitemapFooter();
    return sitemap;
}

/**
 * Generates complete sitemap XML for products
 */
export function generateProductsSitemap(
    productsData: ProductData[],
    baseURL: string,
    settings?: { changefreq: string; priority: number }
): string {
    let sitemap = generateSitemapHeader();

    const config = settings || PRODUCTS_SITEMAP_CONFIG;

    for (const product of productsData) {
        const entry: SitemapEntry = {
            loc: new URL(`/our-products/${product.id}`, baseURL).toString(),
            lastmod: formatLastMod(product.updatedAt),
            changefreq: config.changefreq as SitemapEntry["changefreq"],
            priority: config.priority,
        };

        sitemap += generateSitemapEntry(entry);
    }

    sitemap += generateSitemapFooter();
    return sitemap;
}
