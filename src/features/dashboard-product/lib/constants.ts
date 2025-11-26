/**
 * Dashboard Product Feature Constants
 *
 * Validation limits, MIME types, and configuration for
 * product and packaging option management.
 */

// ============================================
// Pagination
// ============================================

/** Default number of items per page */
export const DEFAULT_PAGE_SIZE = 20;

/** Maximum allowed items per page */
export const MAX_PAGE_SIZE = 100;

// ============================================
// Packaging Option Validation
// ============================================

/** Minimum length for packaging name */
export const PACKAGING_NAME_MIN_LENGTH = 3;

/** Maximum length for packaging name */
export const PACKAGING_NAME_MAX_LENGTH = 100;

/** Minimum length for packaging description */
export const PACKAGING_DESCRIPTION_MIN_LENGTH = 10;

/** Maximum length for packaging description */
export const PACKAGING_DESCRIPTION_MAX_LENGTH = 500;

// ============================================
// Product Validation
// ============================================

/** Minimum length for product name */
export const PRODUCT_NAME_MIN_LENGTH = 1;

/** Maximum character length for product descriptions */
export const PRODUCT_DESCRIPTION_MAX_LENGTH = 1000;

/** Maximum search query length */
export const SEARCH_MAX_LENGTH = 100;

// ============================================
// Minimum Count Validation
// ============================================

/** Minimum number of media items required */
export const MIN_MEDIA_ITEMS = 1;

/** Minimum number of specifications required */
export const MIN_SPECIFICATIONS = 1;

/** Minimum number of variants required */
export const MIN_VARIANTS = 1;

/** Minimum number of sizes per variant required */
export const MIN_VARIANT_SIZES = 1;

// ============================================
// Product Image Upload
// ============================================

/** Allowed MIME types for product image uploads (PNG and JPEG only) */
export const PRODUCT_IMAGE_MIME_TYPES: [string, ...string[]] = [
    "image/png",
    "image/jpeg",
    "image/jpg",
];

/** Error message for invalid image MIME type */
export const PRODUCT_IMAGE_MIME_ERROR =
    "Supported image formats are PNG and JPEG";

/** Regex pattern for allowed image MIME types (for server-side validation) */
export const IMAGE_MIME_REGEX = /^image\/(jpeg|png|gif|webp|svg\+xml)$/;

// ============================================
// Media & Upload Types
// ============================================

export const MEDIA_TYPE_ENUM = {
    IMAGE: "image",
    YOUTUBE: "youtube",
} as const;

export const PRODUCT_UPLOAD_TYPES_ENUM = {
    MEDIA: "media",
    SPECIFICATION: "specification",
    VARIANT: "variant",
    VIDEO_THUMBNAIL: "video-thumbnail",
} as const;

/** Upload type options for product assets */
export const PRODUCT_UPLOAD_TYPES = [
    PRODUCT_UPLOAD_TYPES_ENUM.MEDIA,
    PRODUCT_UPLOAD_TYPES_ENUM.SPECIFICATION,
    PRODUCT_UPLOAD_TYPES_ENUM.VARIANT,
    PRODUCT_UPLOAD_TYPES_ENUM.VIDEO_THUMBNAIL,
] as const;

// ============================================
// Field Error Messages
// ============================================

export const PRODUCT_FIELD_ERRORS = {
    EN_NAME_REQUIRED: "English product name is required",
    AR_NAME_REQUIRED: "Arabic product name is required",
    EN_DESCRIPTION_REQUIRED: "English description is required",
    AR_DESCRIPTION_REQUIRED: "Arabic description is required",
    EN_DESCRIPTION_MAX: `English description must be ${PRODUCT_DESCRIPTION_MAX_LENGTH} characters or less`,
    AR_DESCRIPTION_MAX: `Arabic description must be ${PRODUCT_DESCRIPTION_MAX_LENGTH} characters or less`,
    MOQ_REQUIRED: "MOQ is required",
    PRODUCTION_CAPACITY_REQUIRED: "Production capacity is required",
    EN_VARIANT_NAME_REQUIRED: "English variant name is required",
    AR_VARIANT_NAME_REQUIRED: "Arabic variant name is required",
} as const;
