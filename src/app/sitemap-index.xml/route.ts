import { getCloudflareContext } from "@opennextjs/cloudflare";

import { getDB } from "@/adapters/d1/db";

export async function GET(_request: Request) {
    const _baseURL = process.env.NEXT_PUBLIC_BASE_URL;

    const { env } = await getCloudflareContext({ async: true });
    const _db = getDB(env.DJAVACOAL_DB);

    // TODO: generate sitemaps for static page, news, products,
    const staticSitemap = new URL("/sitemap.xml", _baseURL).toString();

    let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    sitemapIndex += `
    <sitemap>
        <loc>${staticSitemap}</loc>
    </sitemap>`;

    sitemapIndex += `</sitemapindex>`;

    return new Response(sitemapIndex, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
