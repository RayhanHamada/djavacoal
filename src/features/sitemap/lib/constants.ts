/**
 * Default cache control headers for sitemap responses
 * Caches for 1 hour (3600 seconds) for optimal performance
 */
export const SITEMAP_CACHE_HEADERS = {
    "Content-Type": "application/xml",
    "Cache-Control": "public, max-age=3600, s-maxage=3600",
} as const;

/**
 * Blog/news articles sitemap configuration
 */
export const BLOG_SITEMAP_CONFIG = {
    priority: 0.65,
    changefreq: "daily",
} as const;

/**
 * Products sitemap configuration
 */
export const PRODUCTS_SITEMAP_CONFIG = {
    priority: 0.8,
    changefreq: "weekly",
} as const;
