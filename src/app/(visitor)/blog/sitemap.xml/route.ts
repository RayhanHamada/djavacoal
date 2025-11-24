import { getCloudflareContext } from "@opennextjs/cloudflare";

import { getDB } from "@/adapters/d1/db";
import { KV_KEYS } from "@/adapters/kv/constants";
import { SITEMAP_CACHE_HEADERS } from "@/features/sitemap/lib/constants";
import {
    generateBlogSitemap,
    getBlogArticles,
} from "@/features/sitemap/server/functions";

export async function GET(_request: Request) {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseURL) {
        return new Response("Base URL not configured", { status: 500 });
    }

    try {
        const { env } = await getCloudflareContext({ async: true });
        const db = getDB(env.DJAVACOAL_DB);

        // Fetch blog settings from KV
        const [changefreq, priority] = await Promise.all([
            env.DJAVACOAL_KV.get(KV_KEYS.NEWS_SITEMAP_CHANGEFREQ),
            env.DJAVACOAL_KV.get(KV_KEYS.NEWS_SITEMAP_PRIORITY),
        ]);

        const blogSettings = {
            changefreq: (changefreq as any) || "daily",
            priority: priority ? parseFloat(priority) : 0.65,
        };

        const articles = await getBlogArticles(db);
        const sitemap = generateBlogSitemap(articles, baseURL, blogSettings);

        return new Response(sitemap, {
            headers: SITEMAP_CACHE_HEADERS,
        });
    } catch (error) {
        console.error("Error generating blog sitemap:", error);
        return new Response("Error generating sitemap", { status: 500 });
    }
}
