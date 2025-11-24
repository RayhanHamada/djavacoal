import "server-only";

import {
    BLOG_SETTINGS_OUTPUT_SCHEMA,
    GET_BLOG_SETTINGS_INPUT_SCHEMA,
    UPDATE_BLOG_SETTINGS_INPUT_SCHEMA,
} from "./schemas";
import { KV_KEYS } from "@/adapters/kv/constants";
import base from "@/lib/orpc/server";

/**
 * Default values for blog settings
 */
const DEFAULT_BLOG_SETTINGS = {
    sitemap_changefreq: "daily" as const,
    sitemap_priority: 0.65,
};

/**
 * Get blog settings from KV
 */
export const getBlogSettings = base
    .input(GET_BLOG_SETTINGS_INPUT_SCHEMA)
    .output(BLOG_SETTINGS_OUTPUT_SCHEMA)
    .handler(async function ({ context: { env } }) {
        const [changefreq, priority] = await Promise.all([
            env.DJAVACOAL_KV.get(KV_KEYS.NEWS_SITEMAP_CHANGEFREQ),
            env.DJAVACOAL_KV.get(KV_KEYS.NEWS_SITEMAP_PRIORITY),
        ]);

        return {
            sitemap_changefreq:
                (changefreq as any) ?? DEFAULT_BLOG_SETTINGS.sitemap_changefreq,
            sitemap_priority: priority
                ? parseFloat(priority)
                : DEFAULT_BLOG_SETTINGS.sitemap_priority,
        };
    })
    .callable();

/**
 * Update blog settings in KV
 */
export const updateBlogSettings = base
    .input(UPDATE_BLOG_SETTINGS_INPUT_SCHEMA)
    .output(BLOG_SETTINGS_OUTPUT_SCHEMA)
    .handler(async function ({ context: { env }, input }) {
        await Promise.all([
            env.DJAVACOAL_KV.put(
                KV_KEYS.NEWS_SITEMAP_CHANGEFREQ,
                input.sitemap_changefreq
            ),
            env.DJAVACOAL_KV.put(
                KV_KEYS.NEWS_SITEMAP_PRIORITY,
                input.sitemap_priority.toString()
            ),
        ]);

        return {
            sitemap_changefreq: input.sitemap_changefreq,
            sitemap_priority: input.sitemap_priority,
        };
    })
    .callable();
