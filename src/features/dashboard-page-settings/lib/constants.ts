/**
 * Dashboard Page Settings Feature Constants
 *
 * Validation limits and configuration for page metadata management.
 */

// ============================================
// Pagination
// ============================================

/** Default number of items per page */
export const DEFAULT_PAGE_SIZE = 20;

/** Maximum allowed items per page */
export const MAX_PAGE_SIZE = 100;

// ============================================
// Path Validation
// ============================================

/** Minimum length for page path */
export const PATH_MIN_LENGTH = 1;

/** Maximum length for page path */
export const PATH_MAX_LENGTH = 255;

// ============================================
// Metadata Title Validation
// ============================================

/** Minimum length for metadata title */
export const METADATA_TITLE_MIN_LENGTH = 1;

/** Maximum length for metadata title (SEO recommended max) */
export const METADATA_TITLE_MAX_LENGTH = 60;

// ============================================
// Metadata Description Validation
// ============================================

/** Minimum length for metadata description */
export const METADATA_DESCRIPTION_MIN_LENGTH = 1;

/** Maximum length for metadata description (SEO recommended max) */
export const METADATA_DESCRIPTION_MAX_LENGTH = 160;

// ============================================
// Keywords Validation
// ============================================

/** Minimum length for individual keyword */
export const METADATA_KEYWORD_MIN_LENGTH = 1;

/** Maximum length for individual keyword */
export const METADATA_KEYWORD_MAX_LENGTH = 50;

/** Maximum number of keywords allowed */
export const MAX_KEYWORDS = 20;

// ============================================
// Sitemap Configuration
// ============================================

/** Minimum sitemap priority value */
export const SITEMAP_PRIORITY_MIN = 0.0;

/** Maximum sitemap priority value */
export const SITEMAP_PRIORITY_MAX = 1.0;

/** Default sitemap priority value */
export const SITEMAP_PRIORITY_DEFAULT = 0.5;

/** Default sitemap change frequency */
export const SITEMAP_CHANGEFREQ_DEFAULT = "weekly" as const;

/** Common sitemap priority values with labels for UI select */
export const SITEMAP_PRIORITY_OPTIONS = [
    { value: 1.0, label: "1.0 - Highest (Homepage)" },
    { value: 0.8, label: "0.8 - High (Main Pages)" },
    { value: 0.5, label: "0.5 - Default (Content)" },
    { value: 0.3, label: "0.3 - Low (Secondary)" },
] as const;
