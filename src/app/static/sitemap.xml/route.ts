import { getCloudflareContext } from "@opennextjs/cloudflare";

import { getDB } from "@/adapters/d1/db";
import { SITEMAP_CACHE_HEADERS } from "@/features/sitemap/lib/constants";
import {
    generateStaticPagesSitemap,
    getStaticPages,
} from "@/features/sitemap/server/functions";

export async function GET(_request: Request) {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseURL) {
        return new Response("Base URL not configured", { status: 500 });
    }

    try {
        const { env } = await getCloudflareContext({ async: true });
        const db = getDB(env.DJAVACOAL_DB);

        const pages = await getStaticPages(db);
        const sitemap = generateStaticPagesSitemap(pages, baseURL);

        return new Response(sitemap, {
            headers: SITEMAP_CACHE_HEADERS,
        });
    } catch (error) {
        console.error("Error generating static sitemap:", error);
        return new Response("Error generating sitemap", { status: 500 });
    }
}
