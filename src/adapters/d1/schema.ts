import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

import {
    ACCOUNT_COLUMNS,
    COMMON_COLUMNS,
    GALLERY_PHOTO_COLUMNS,
    NEWS_COLUMNS,
    SESSION_COLUMNS,
    TABLE_NAMES,
    TAG_COLUMNS,
    USER_COLUMNS,
    VERIFICATION_COLUMNS,
} from "@/adapters/d1/constants";

const ALLOWED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
] as const;

/**
 * default values used in the schema
 */
const DEFAULTS = {
    CURRENT_TIMESTAMP: sql`CURRENT_TIMESTAMP`,
} as const;

/**
 * common fields for all tables
 */
const COMMON_FIELDS = {
    [COMMON_COLUMNS.CREATED_AT]: int({
        mode: "timestamp",
    }).default(DEFAULTS.CURRENT_TIMESTAMP),
    [COMMON_COLUMNS.UPDATED_AT]: int({
        mode: "timestamp",
    }).default(DEFAULTS.CURRENT_TIMESTAMP),
};

/**
 * common authored fields for all tables
 */
const COMMON_AUTHORED_FIELDS = {
    [COMMON_COLUMNS.CREATED_BY]: text()
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
        }),
    [COMMON_COLUMNS.UPDATED_BY]: text()
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
        }),
};

/**
 * table used by better-auth to store users
 */

export const users = sqliteTable(TABLE_NAMES.USERS, {
    /**
     * primary key for the user table
     */
    [COMMON_COLUMNS.ID]: text().primaryKey(),

    [USER_COLUMNS.NAME]: text().notNull(),
    [USER_COLUMNS.EMAIL]: text().notNull().unique(),
    [USER_COLUMNS.EMAIL_VERIFIED]: int({
        mode: "boolean",
    }).default(false),
    [USER_COLUMNS.IMAGE]: text(),
    [USER_COLUMNS.ROLE]: text().default("admin"),
    [USER_COLUMNS.BANNED]: int({
        mode: "boolean",
    }).default(false),
    [USER_COLUMNS.BAN_REASON]: text(),
    [USER_COLUMNS.BAN_EXPIRES]: int({
        mode: "timestamp",
    }),

    ...COMMON_FIELDS,
});

export const sessions = sqliteTable(TABLE_NAMES.SESSIONS, {
    /**
     * primary key for the session table
     */
    [COMMON_COLUMNS.ID]: text().primaryKey(),

    /**
     * references the user table (id)
     */
    [SESSION_COLUMNS.USER_ID]: text()
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
        }),

    [SESSION_COLUMNS.TOKEN]: text().notNull().unique(),
    [SESSION_COLUMNS.EXPIRES_AT]: int({ mode: "timestamp" }).notNull(),
    [SESSION_COLUMNS.IP_ADDRESS]: text(),
    [SESSION_COLUMNS.USER_AGENT]: text(),
    [SESSION_COLUMNS.IMPERSONATED_BY]: text(),

    ...COMMON_FIELDS,
});

export const accounts = sqliteTable(TABLE_NAMES.ACCOUNTS, {
    /**
     * primary key for the account table
     */
    [COMMON_COLUMNS.ID]: text().primaryKey(),

    /**
     * references the user table (id)
     */
    [ACCOUNT_COLUMNS.USER_ID]: text()
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
        }),

    [ACCOUNT_COLUMNS.ACCOUNT_ID]: text().notNull(),
    [ACCOUNT_COLUMNS.PROVIDER_ID]: text().notNull(),
    [ACCOUNT_COLUMNS.ACCESS_TOKEN]: text(),
    [ACCOUNT_COLUMNS.REFRESH_TOKEN]: text(),
    [ACCOUNT_COLUMNS.ACCESS_TOKEN_EXPIRES_AT]: int({
        mode: "timestamp",
    }),
    [ACCOUNT_COLUMNS.REFRESH_TOKEN_EXPIRES_AT]: int({
        mode: "timestamp",
    }),
    [ACCOUNT_COLUMNS.SCOPE]: text(),
    [ACCOUNT_COLUMNS.ID_TOKEN]: text(),
    [ACCOUNT_COLUMNS.PASSWORD]: text(),

    ...COMMON_FIELDS,
});

export const verifications = sqliteTable(TABLE_NAMES.VERIFICATIONS, {
    /**
     * primary key for the verification table
     */
    [COMMON_COLUMNS.ID]: text().primaryKey(),

    [VERIFICATION_COLUMNS.IDENTIFIER]: text().notNull(),
    [VERIFICATION_COLUMNS.VALUE]: text().notNull(),
    [VERIFICATION_COLUMNS.EXPIRES_AT]: int({
        mode: "timestamp",
    }).notNull(),

    ...COMMON_FIELDS,
});

/**
 * table for storing gallery photo metadata
 * actual photos are stored in Cloudflare R2
 */
export const galleryPhotos = sqliteTable(TABLE_NAMES.GALLERY_PHOTOS, {
    /**
     * primary key for the gallery_photos table
     */
    [COMMON_COLUMNS.ID]: text().primaryKey(),

    /**
     * unique human-readable name for the photo (8-100 characters)
     */
    [GALLERY_PHOTO_COLUMNS.NAME]: text().notNull().unique(),

    /**
     * R2 object key (path in the bucket)
     */
    [GALLERY_PHOTO_COLUMNS.KEY]: text().notNull().unique(),

    /**
     * file size in bytes
     */
    [GALLERY_PHOTO_COLUMNS.SIZE]: int().notNull(),

    /**
     * MIME type of the photo (e.g., image/jpeg, image/png)
     */
    [GALLERY_PHOTO_COLUMNS.MIME_TYPE]: text({
        enum: ALLOWED_IMAGE_MIME_TYPES,
    }).notNull(),

    ...COMMON_FIELDS,
});

/**
 * table for storing news articles
 */
export const news = sqliteTable(TABLE_NAMES.NEWS, {
    /**
     * primary key for the news table
     */
    [COMMON_COLUMNS.ID]: int().primaryKey(),

    /**
     * unique slug for the news article (used in URLs)
     */
    [NEWS_COLUMNS.SLUG]: text().notNull().unique(),

    /**
     * R2 object key for the news image (stored in R2)
     */
    [NEWS_COLUMNS.IMAGE_KEY]: text(),

    /**
     * title for SEO
     */
    [NEWS_COLUMNS.METADATA_TITLE]: text().notNull(),

    /**
     * description for SEO
     */
    [NEWS_COLUMNS.METADATA_DESCRIPTION]: text().notNull(),

    /**
     * keywords for SEO and tags
     */
    [NEWS_COLUMNS.METADATA_TAG_LIST]: text({ mode: "json" })
        .$type<string[]>()
        .default([]),

    /**
     * Arabic data (for now will be mandatory)
     */
    [NEWS_COLUMNS.AR_TITLE]: text().notNull(),
    [NEWS_COLUMNS.AR_CONTENT_KEY]: text().notNull(),

    /**
     * English data
     */
    [NEWS_COLUMNS.EN_TITLE]: text().notNull(),
    [NEWS_COLUMNS.EN_CONTENT_KEY]: text().notNull(),

    /**
     * publication status fields (single publication status)
     */
    [NEWS_COLUMNS.IS_PUBLISHED]: int({
        mode: "boolean",
    }).default(false),

    /**
     * publication timestamp and author
     */
    [NEWS_COLUMNS.PUBLISHED_AT]: int({
        mode: "timestamp",
    }),
    // keep published_by typed to users.id
    [NEWS_COLUMNS.PUBLISHED_BY]: text().references(() => users.id),

    ...COMMON_AUTHORED_FIELDS,
    ...COMMON_FIELDS,
});

export const tags = sqliteTable(TABLE_NAMES.TAGS, {
    /**
     * primary key for the tags table
     */
    [COMMON_COLUMNS.ID]: int().primaryKey(),

    /**
     * name of the tag
     */
    [TAG_COLUMNS.NAME]: text().notNull().unique(),

    /**
     * slug for the tag (used in URLs)
     */
    [TAG_COLUMNS.SLUG]: text().notNull().unique(),

    ...COMMON_FIELDS,
});

/**
 * relations between tables
 */

export const userRelations = relations(users, ({ many }) => ({
    sessions: many(sessions),
    accounts: many(accounts),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions[SESSION_COLUMNS.USER_ID]],
        references: [users[COMMON_COLUMNS.ID]],
    }),
}));

export const accountRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts[ACCOUNT_COLUMNS.USER_ID]],
        references: [users[COMMON_COLUMNS.ID]],
    }),
}));

export const newsRelations = relations(news, ({ one }) => ({
    createdBy: one(users, {
        fields: [news[COMMON_COLUMNS.CREATED_BY]],
        references: [users[COMMON_COLUMNS.ID]],
    }),
    updatedBy: one(users, {
        fields: [news[COMMON_COLUMNS.UPDATED_BY]],
        references: [users[COMMON_COLUMNS.ID]],
    }),
}));
