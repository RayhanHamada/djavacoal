/**
 * Pagination constants
 */
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

/**
 * Validation constants for page metadata fields
 */
export const PATH_MIN_LENGTH = 1;
export const PATH_MAX_LENGTH = 255;

export const METADATA_TITLE_MIN_LENGTH = 1;
export const METADATA_TITLE_MAX_LENGTH = 60;

export const METADATA_DESCRIPTION_MIN_LENGTH = 1;
export const METADATA_DESCRIPTION_MAX_LENGTH = 160;

export const METADATA_KEYWORD_MIN_LENGTH = 1;
export const METADATA_KEYWORD_MAX_LENGTH = 50;
export const MAX_KEYWORDS = 20;

/**
 * Sitemap constants
 */
export const SITEMAP_PRIORITY_MIN = 0.0;
export const SITEMAP_PRIORITY_MAX = 1.0;
export const SITEMAP_PRIORITY_DEFAULT = 0.5;

/**
 * Common sitemap priority values with labels
 */
export const SITEMAP_PRIORITY_OPTIONS = [
    { value: 1.0, label: "1.0 - Highest (Homepage)" },
    { value: 0.8, label: "0.8 - High (Main Pages)" },
    { value: 0.5, label: "0.5 - Default (Content)" },
    { value: 0.3, label: "0.3 - Low (Secondary)" },
] as const;

export const SITEMAP_CHANGEFREQ_DEFAULT = "weekly" as const;
