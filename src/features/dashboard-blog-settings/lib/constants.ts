import {
    SITEMAP_CHANGEFREQ_ENUM,
    SITEMAP_CHANGEFREQ_VALUES,
} from "@/adapters/d1/constants";

/**
 * Default blog sitemap settings
 */
export const DEFAULT_BLOG_CHANGEFREQ = SITEMAP_CHANGEFREQ_VALUES.DAILY;
export const DEFAULT_BLOG_PRIORITY = 0.65 as const;

/**
 * Priority configuration
 */
export const PRIORITY_CONFIG = {
    MIN: 0,
    MAX: 1,
    STEP: 0.05,
    DECIMAL_SCALE: 2,
} as const;

/**
 * UI text constants
 */
export const UI_TEXT = {
    FORM_TITLE: "Blog Sitemap Settings",
    FORM_DESCRIPTION:
        "Configure how blog articles appear in search engine sitemaps",
    INFO_ALERT_TITLE: "About Sitemap Settings",
    INFO_ALERT_MESSAGE:
        "These settings control how blog/news articles appear in the sitemap.xml file, which helps search engines understand your content update frequency and importance.",
    CHANGEFREQ_LABEL: "Change Frequency",
    CHANGEFREQ_DESCRIPTION: "How often blog articles typically get updated",
    CHANGEFREQ_PLACEHOLDER: "Select frequency",
    PRIORITY_LABEL: "Priority",
    PRIORITY_DESCRIPTION:
        "Relative importance (0.0 to 1.0, where 1.0 is most important)",
    SAVE_BUTTON: "Save Settings",
    SUCCESS_TITLE: "Success",
    SUCCESS_MESSAGE: "Blog settings saved successfully",
    ERROR_TITLE: "Error",
    ERROR_MESSAGE: "Failed to save blog settings",
    LOADING_MESSAGE: "Loading settings...",
} as const;

/**
 * Changefreq enum for type safety
 */
export { SITEMAP_CHANGEFREQ_VALUES, SITEMAP_CHANGEFREQ_ENUM };

export type SitemapChangefreq = (typeof SITEMAP_CHANGEFREQ_ENUM)[number];
