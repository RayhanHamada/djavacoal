import { z } from "zod";

import { SITEMAP_CHANGEFREQ_ENUM } from "@/adapters/d1/constants";

/**
 * Blog Settings Schemas
 * Uses D1 constants for consistency across the application
 */

export type SitemapChangefreq = (typeof SITEMAP_CHANGEFREQ_ENUM)[number];

/**
 * Input schema for getting blog settings
 */
export const GET_BLOG_SETTINGS_INPUT_SCHEMA = z.object({});

/**
 * Output schema for blog settings
 */
export const BLOG_SETTINGS_OUTPUT_SCHEMA = z.object({
    sitemap_changefreq: z.enum(SITEMAP_CHANGEFREQ_ENUM),
    sitemap_priority: z.number().min(0).max(1),
});

/**
 * Input schema for updating blog settings
 */
export const UPDATE_BLOG_SETTINGS_INPUT_SCHEMA = z.object({
    sitemap_changefreq: z.enum(SITEMAP_CHANGEFREQ_ENUM),
    sitemap_priority: z.number().min(0).max(1),
});

export type BlogSettings = z.infer<typeof BLOG_SETTINGS_OUTPUT_SCHEMA>;
export type UpdateBlogSettingsInput = z.infer<
    typeof UPDATE_BLOG_SETTINGS_INPUT_SCHEMA
>;
