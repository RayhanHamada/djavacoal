export const TABLE_NAMES = {
    USERS: "users",
    SESSIONS: "sessions",
    ACCOUNTS: "accounts",
    VERIFICATIONS: "verifications",
    GALLERY_PHOTOS: "gallery_photos",

    NEWS: "news",
    NEWS_METADATA: "news_metadatas",
    NEWS_TITLE: "news_titles",
    NEWS_CONTENT: "news_contents",

    TAGS: "tags",
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

    IS_PUBLISHED: "is_published",
    PUBLISHED_AT: "published_at",
    PUBLISHED_BY: "published_by",
} as const;

export const TAG_COLUMNS = {
    NAME: "name",
    SLUG: "slug",
} as const;
