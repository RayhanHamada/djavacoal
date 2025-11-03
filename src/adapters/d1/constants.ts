export const TABLE_NAMES = {
    USERS: "users",
    SESSIONS: "sessions",
    ACCOUNTS: "accounts",
    VERIFICATIONS: "verifications",
    GALLERY_PHOTOS: "gallery_photos",

    NEWS: "news",

    PACKAGING_OPTIONS: "packaging_options",

    PRODUCTS: "products",
    PRODUCT_MEDIAS: "product_medias",
    PRODUCT_SPECIFICATIONS: "product_specifications",
    PRODUCT_VARIANTS: "product_variants",
    PRODUCT_PACKAGING_OPTIONS: "product_packaging_options",

    TAGS: "tags",

    PAGE_METADATAS: "page_metadatas",
    TEAM_MEMBERS: "team_members",
} as const;

export const COMMON_COLUMNS = {
    ID: "id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
} as const;

export const USER_COLUMNS = {
    NAME: "name",
    EMAIL: "email",
    EMAIL_VERIFIED: "email_verified",
    IMAGE: "image",
    ROLE: "role",
    BANNED: "banned",
    BAN_REASON: "ban_reason",
    BAN_EXPIRES: "ban_expires",
} as const;

export const SESSION_COLUMNS = {
    USER_ID: "user_id",
    TOKEN: "token",
    EXPIRES_AT: "expires_at",
    IP_ADDRESS: "ip_address",
    USER_AGENT: "user_agent",
    IMPERSONATED_BY: "impersonated_by",
} as const;

export const ACCOUNT_COLUMNS = {
    USER_ID: "user_id",
    ACCOUNT_ID: "account_id",
    PROVIDER_ID: "provider_id",
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    ACCESS_TOKEN_EXPIRES_AT: "access_token_expires_at",
    REFRESH_TOKEN_EXPIRES_AT: "refresh_token_expires_at",
    SCOPE: "scope",
    ID_TOKEN: "id_token",
    PASSWORD: "password",
} as const;

export const VERIFICATION_COLUMNS = {
    IDENTIFIER: "identifier",
    VALUE: "value",
    EXPIRES_AT: "expires_at",
} as const;

export const GALLERY_PHOTO_COLUMNS = {
    NAME: "name",
    KEY: "key",
    SIZE: "size",
    MIME_TYPE: "mime_type",
} as const;

export const NEWS_COLUMNS = {
    SLUG: "slug",
    IMAGE_KEY: "image_key",

    METADATA_TITLE: "metadata_title",
    METADATA_DESCRIPTION: "metadata_description",
    METADATA_TAG_LIST: "metadata_tag_list",

    AR_TITLE: "ar_title",
    AR_CONTENT_KEY: "ar_content_key",

    EN_TITLE: "en_title",
    EN_CONTENT_KEY: "en_content_key",

    STATUS: "status",
    PUBLISHED_AT: "published_at",
    PUBLISHED_BY: "published_by",
} as const;

export const TAG_COLUMNS = {
    NAME: "name",
    SLUG: "slug",
} as const;

export const PACKAGING_OPTION_COLUMNS = {
    EN_NAME: "en_name",
    AR_NAME: "ar_name",
    EN_DESCRIPTION: "en_description",
    AR_DESCRIPTION: "ar_description",
    PHOTO_KEY: "photo_key",
} as const;

export const PRODUCT_COLUMNS = {
    EN_NAME: "en_name",
    AR_NAME: "ar_name",
    EN_DESCRIPTION: "en_description",
    AR_DESCRIPTION: "ar_description",
    MOQ: "moq",
    PRODUCTION_CAPACITY: "production_capacity",
    IS_HIDDEN: "is_hidden",
    ORDER_INDEX: "order_index",
} as const;

export const PRODUCT_MEDIA_COLUMNS = {
    PRODUCT_ID: "product_id",
    MEDIA_TYPE: "media_type",
    /**
     * if the media is an image, this is the image key in S3
     */
    IMAGE_KEY: "image_key",

    /**
     * if the media is a video, this is the video id from youtube
     */
    YOUTUBE_VIDEO_ID: "video_id",

    /**
     * if the media is a video, this is the custom thumbnail key in S3
     */
    VIDEO_CUSTOM_THUMBNAIL_KEY: "video_custom_thumbnail_key",

    /**
     * order index for sorting
     */
    ORDER_INDEX: "order_index",
} as const;

export const PRODUCT_VARIANT_COLUMNS = {
    PRODUCT_ID: "product_id",
    EN_VARIANT_NAME: "en_variant_name",
    AR_VARIANT_NAME: "ar_variant_name",
    VARIANT_PHOTO_KEY: "variant_photo_key",
    VARIANT_SIZES: "variant_sizes",
    ORDER_INDEX: "order_index",
} as const;

export const PRODUCT_PACKAGING_OPTION_COLUMNS = {
    PRODUCT_ID: "product_id",
    PACKAGING_OPTION_ID: "packaging_option_id",
} as const;

export const PRODUCT_SPECIFICATION_COLUMNS = {
    PRODUCT_ID: "product_id",
    SPEC_PHOTO_KEY: "spec_photo_key",
    ORDER_INDEX: "order_index",
} as const;

export const PAGE_METADATA_COLUMNS = {
    PATH: "path",
    METADATA_TITLE: "metadata_title",
    METADATA_DESCRIPTION: "metadata_description",
    METADATA_KEYWORDS: "metadata_keywords",
    SITEMAP_PRIORITY: "sitemap_priority",
    SITEMAP_CHANGEFREQ: "sitemap_changefreq",
} as const;

export const TEAM_MEMBER_COLUMNS = {
    NAME: "name",
    POSITION: "position",
    PHOTO_KEY: "photo_key",
    ORDER_INDEX: "order_index",
} as const;

/**
 * constants related to table above
 */
export const NEWS_STATUS = {
    DRAFT: "draft",
    PUBLISHED: "published",
    UNPUBLISHED: "unpublished",
} as const;

export const PRODUCT_MEDIA_TYPE = {
    IMAGE: "image",
    YOUTUBE: "youtube",
} as const;

export const PRODUCT_MEDIA_TYPE_ENUM = [
    PRODUCT_MEDIA_TYPE.IMAGE,
    PRODUCT_MEDIA_TYPE.YOUTUBE,
] as const;

export const SITEMAP_PRIORITY_DEFAULT = 0.5;

export const SITEMAP_CHANGEFREQ_VALUES = {
    ALWAYS: "always",
    HOURLY: "hourly",
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
    NEVER: "never",
} as const;

export const SITEMAP_CHANGEFREQ_ENUM = [
    SITEMAP_CHANGEFREQ_VALUES.ALWAYS,
    SITEMAP_CHANGEFREQ_VALUES.HOURLY,
    SITEMAP_CHANGEFREQ_VALUES.DAILY,
    SITEMAP_CHANGEFREQ_VALUES.WEEKLY,
    SITEMAP_CHANGEFREQ_VALUES.MONTHLY,
    SITEMAP_CHANGEFREQ_VALUES.YEARLY,
    SITEMAP_CHANGEFREQ_VALUES.NEVER,
] as const;
