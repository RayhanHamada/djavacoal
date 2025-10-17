export const TABLE_NAMES = {
    USERS: "users",
    SESSIONS: "sessions",
    ACCOUNTS: "accounts",
    VERIFICATIONS: "verifications",
} as const;

export const COMMON_COLUMNS = {
    ID: "id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
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
