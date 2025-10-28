/**
 * R2 Storage Constants
 */

/**
 * Default R2 bucket name for the application
 */
export const DEFAULT_BUCKET_NAME = "djavacoal";

/**
 * Gallery photos folder prefix in R2
 */
export const GALLERY_PHOTOS_PREFIX = "gallery";

/**
 * News folder prefixes in R2
 */
export const NEWS_IMAGES_PREFIX = "news/images";
export const NEWS_CONTENT_PREFIX = "news/content";

/**
 * Product folder prefixes in R2
 */
export const PRODUCT_MEDIA_PREFIX = "products/media";
export const PRODUCT_SPECIFICATIONS_PREFIX = "products/specifications";
export const PRODUCT_VARIANTS_PREFIX = "products/variants";
export const PRODUCT_DESCRIPTIONS_PREFIX = "products/descriptions";

/**
 * Presigned URL expiration time in seconds (1 hour)
 */
export const PRESIGNED_URL_EXPIRATION = 3600;

/**
 * Maximum file size for uploads (10MB in bytes)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Allowed image MIME types
 */
export const ALLOWED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
] as const;
