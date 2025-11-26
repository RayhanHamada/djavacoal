/**
 * Form validation constants for dashboard-product feature
 */

/**
 * Allowed MIME types for product image uploads (PNG and JPEG only)
 */
export const PRODUCT_IMAGE_MIME_TYPES: [string, ...string[]] = [
    "image/png",
    "image/jpeg",
    "image/jpg",
];

/**
 * Error message for invalid image MIME type
 */
export const PRODUCT_IMAGE_MIME_ERROR =
    "Supported image formats are PNG and JPEG";

/**
 * Maximum character length for product descriptions
 */
export const PRODUCT_DESCRIPTION_MAX_LENGTH = 1000;

/**
 * Minimum count validation constants
 */
export const MIN_MEDIA_ITEMS = 1;
export const MIN_SPECIFICATIONS = 1;
export const MIN_VARIANTS = 1;
export const MIN_VARIANT_SIZES = 1;

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

/**
 * Upload type options for product assets
 */
export const PRODUCT_UPLOAD_TYPES = [
    PRODUCT_UPLOAD_TYPES_ENUM.MEDIA,
    PRODUCT_UPLOAD_TYPES_ENUM.SPECIFICATION,
    PRODUCT_UPLOAD_TYPES_ENUM.VARIANT,
    PRODUCT_UPLOAD_TYPES_ENUM.VIDEO_THUMBNAIL,
] as const;

/**
 * Regex pattern for allowed image MIME types (for server-side validation)
 */
export const IMAGE_MIME_REGEX = /^image\/(jpeg|png|gif|webp|svg\+xml)$/;

/**
 * Maximum search query length
 */
export const SEARCH_MAX_LENGTH = 100;

/**
 * Product name validation constants
 */
export const PRODUCT_NAME_MIN_LENGTH = 1;

/**
 * Required field error messages
 */
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
