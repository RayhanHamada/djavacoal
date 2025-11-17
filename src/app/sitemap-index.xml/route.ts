import { SITEMAP_CACHE_HEADERS } from "@/features/sitemap/lib/constants";
import {
    generateSitemapIndexFooter,
    generateSitemapIndexHeader,
} from "@/features/sitemap/server/helpers";

export async function GET(_request: Request) {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseURL) {
        return new Response("Base URL not configured", { status: 500 });
    }

    const staticSitemap = new URL("/static/sitemap.xml", baseURL).toString();
    const blogSitemap = new URL("/blog/sitemap.xml", baseURL).toString();

    const sitemapIndex = `${generateSitemapIndexHeader()}
    <sitemap>
        <loc>${staticSitemap}</loc>
    </sitemap>
    <sitemap>
        <loc>${blogSitemap}</loc>
    </sitemap>${generateSitemapIndexFooter()}`;

    return new Response(sitemapIndex, {
        headers: SITEMAP_CACHE_HEADERS,
    });
}
