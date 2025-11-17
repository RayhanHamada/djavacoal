import { getCloudflareContext } from "@opennextjs/cloudflare";

import { COMMON_COLUMNS, PAGE_METADATA_COLUMNS } from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { pageMetadatas } from "@/adapters/d1/schema";

function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export async function GET(_request: Request) {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseURL) {
        return new Response("Base URL not configured", { status: 500 });
    }

    try {
        const { env } = await getCloudflareContext({ async: true });
        const db = getDB(env.DJAVACOAL_DB);

        const pages = await db
            .select({
                path: pageMetadatas[PAGE_METADATA_COLUMNS.PATH],
                priority: pageMetadatas[PAGE_METADATA_COLUMNS.SITEMAP_PRIORITY],
                changefreq:
                    pageMetadatas[PAGE_METADATA_COLUMNS.SITEMAP_CHANGEFREQ],
                updatedAt: pageMetadatas[COMMON_COLUMNS.UPDATED_AT],
            })
            .from(pageMetadatas)
            .orderBy(pageMetadatas[PAGE_METADATA_COLUMNS.PATH]);

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        for (const page of pages) {
            const loc = new URL(page.path, baseURL).toString();
            const lastmod = page.updatedAt
                ? new Date(page.updatedAt).toISOString()
                : undefined;

            sitemap += `
    <url>
        <loc>${escapeXml(loc)}</loc>`;

            if (lastmod) {
                sitemap += `
        <lastmod>${lastmod}</lastmod>`;
            }

            if (page.changefreq) {
                sitemap += `
        <changefreq>${escapeXml(page.changefreq)}</changefreq>`;
            }

            if (page.priority !== null && page.priority !== undefined) {
                sitemap += `
        <priority>${page.priority.toFixed(1)}</priority>`;
            }

            sitemap += `
    </url>`;
        }

        sitemap += `
</urlset>`;

        return new Response(sitemap, {
            headers: {
                "Content-Type": "application/xml",
                "Cache-Control": "public, max-age=3600, s-maxage=3600",
            },
        });
    } catch (error) {
        console.error("Error generating static sitemap:", error);
        return new Response("Error generating sitemap", { status: 500 });
    }
}
