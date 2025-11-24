import { relations } from "drizzle-orm";
import { sqliteTable, text, int, real } from "drizzle-orm/sqlite-core";

import {
    ACCOUNT_COLUMNS,
    COMMON_COLUMNS,
    GALLERY_PHOTO_COLUMNS,
    PRODUCT_MEDIA_TYPE_ENUM,
    NEWS_COLUMNS,
    PACKAGING_OPTION_COLUMNS,
    PAGE_METADATA_COLUMNS,
    PRODUCT_COLUMNS,
    PRODUCT_MEDIA_COLUMNS,
    PRODUCT_PACKAGING_OPTION_COLUMNS,
    PRODUCT_SPECIFICATION_COLUMNS,
    PRODUCT_VARIANT_COLUMNS,
    SESSION_COLUMNS,
    SITEMAP_CHANGEFREQ_ENUM,
    TABLE_NAMES,
    TAG_COLUMNS,
    USER_COLUMNS,
    VERIFICATION_COLUMNS,
    TEAM_MEMBER_COLUMNS,
    FAQ_COLUMNS,
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

/**
 * common fields for all tables
 */
const COMMON_FIELDS = {
    [COMMON_COLUMNS.CREATED_AT]: int({
        mode: "timestamp",
    })
        .notNull()
        .$default(() => new Date()),
    [COMMON_COLUMNS.UPDATED_AT]: int({
        mode: "timestamp",
    })
        .notNull()
        .$default(() => new Date())
        .$onUpdateFn(() => new Date()),
} as const;

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
} as const;

/**
 * table definitions
 */
const USER_COLUMN_FIELDS = {
    ...COMMON_FIELDS,

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
} as const;

const SESSION_COLUMN_FIELDS = {
    ...COMMON_FIELDS,

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
} as const;

const ACCOUNT_COLUMN_FIELDS = {
    ...COMMON_FIELDS,

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
} as const;

const VERIFICATION_COLUMN_FIELDS = {
    ...COMMON_FIELDS,

    /**
     * primary key for the verification table
     */
    [COMMON_COLUMNS.ID]: text().primaryKey(),

    [VERIFICATION_COLUMNS.IDENTIFIER]: text().notNull(),
    [VERIFICATION_COLUMNS.VALUE]: text().notNull(),
    [VERIFICATION_COLUMNS.EXPIRES_AT]: int({
        mode: "timestamp",
    }).notNull(),
} as const;

const GALLERY_COLUMN_FIELDS = {
    ...COMMON_FIELDS,

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
} as const;

const NEWS_COLUMN_FIELDS = {
    ...COMMON_AUTHORED_FIELDS,
    ...COMMON_FIELDS,

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
    [NEWS_COLUMNS.METADATA_TAG_LIST]: text({
        mode: "json",
    })
        .notNull()
        .default([])
        .$type<string[]>()
        .$default(() => []),

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
     * publication status: draft, published, or unpublished
     * - draft: article is incomplete or in progress, not yet ready for public view
     * - published: article is live and visible to users
     * - unpublished: article was live but is now hidden, retaining data for potential re-publishing
     */
    [NEWS_COLUMNS.STATUS]: text({
        enum: ["draft", "published", "unpublished"],
    })
        .notNull()
        .$default(() => "draft"),

    /**
     * publication timestamp and author
     */
    [NEWS_COLUMNS.PUBLISHED_AT]: int({
        mode: "timestamp",
    }),
    // keep published_by typed to users.id
    [NEWS_COLUMNS.PUBLISHED_BY]: text().references(() => users.id),
} as const;

const TAG_COLUMN_FIELDS = {
    ...COMMON_FIELDS,

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
} as const;

/**
 * table used for packaging options
 */
const PACKAGING_OPTION_COLUMN_FIELDS = {
    ...COMMON_FIELDS,
    ...COMMON_AUTHORED_FIELDS,

    /**
     * primary key for the packaging_options table
     */
    [COMMON_COLUMNS.ID]: int().primaryKey(),

    [PACKAGING_OPTION_COLUMNS.EN_NAME]: text().notNull(),
    [PACKAGING_OPTION_COLUMNS.AR_NAME]: text().notNull(),
    [PACKAGING_OPTION_COLUMNS.EN_DESCRIPTION]: text().notNull(),
    [PACKAGING_OPTION_COLUMNS.AR_DESCRIPTION]: text().notNull(),
    [PACKAGING_OPTION_COLUMNS.PHOTO_KEY]: text().notNull(),
} as const;

/**
 * table used for products
 */
const PRODUCT_COLUMN_FIELDS = {
    ...COMMON_AUTHORED_FIELDS,
    ...COMMON_FIELDS,

    [COMMON_COLUMNS.ID]: int().primaryKey(),

    [PRODUCT_COLUMNS.EN_NAME]: text().notNull(),
    [PRODUCT_COLUMNS.AR_NAME]: text().notNull(),
    [PRODUCT_COLUMNS.EN_DESCRIPTION]: text().notNull(),
    [PRODUCT_COLUMNS.AR_DESCRIPTION]: text().notNull(),

    [PRODUCT_COLUMNS.MOQ]: text().notNull(),
    [PRODUCT_COLUMNS.PRODUCTION_CAPACITY]: text().notNull(),
    [PRODUCT_COLUMNS.IS_HIDDEN]: int({
        mode: "boolean",
    })
        .notNull()
        .default(false),
    [PRODUCT_COLUMNS.ORDER_INDEX]: int().notNull().default(0),
} as const;

/**
 * table used for product media
 */
const PRODUCT_MEDIA_COLUMN_FIELDS = {
    ...COMMON_FIELDS,

    [COMMON_COLUMNS.ID]: int().primaryKey(),

    [PRODUCT_MEDIA_COLUMNS.PRODUCT_ID]: int()
        .notNull()
        .references(() => products.id, {
            onDelete: "cascade",
        }),

    [PRODUCT_MEDIA_COLUMNS.MEDIA_TYPE]: text({
        enum: PRODUCT_MEDIA_TYPE_ENUM,
    }).notNull(),

    /**
     * if the media is an image, this is the image key in S3
     */
    [PRODUCT_MEDIA_COLUMNS.IMAGE_KEY]: text(),

    /**
     * if the media is a video, this is the video id from youtube
     */
    [PRODUCT_MEDIA_COLUMNS.YOUTUBE_VIDEO_ID]: text(),

    /**
     * if the media is a video, this is an optional custom thumbnail image key in S3
     */
    [PRODUCT_MEDIA_COLUMNS.VIDEO_CUSTOM_THUMBNAIL_KEY]: text(),

    /**
     * order index for sorting media items
     */
    [PRODUCT_MEDIA_COLUMNS.ORDER_INDEX]: int().notNull().default(0),
} as const;

const PRODUCT_SPECIFICATION_COLUMN_FIELDS = {
    ...COMMON_FIELDS,

    [COMMON_COLUMNS.ID]: int().primaryKey(),

    [PRODUCT_SPECIFICATION_COLUMNS.PRODUCT_ID]: int()
        .notNull()
        .references(() => products.id, {
            onDelete: "cascade",
        }),

    /**
     * specification photo key in S3
     */
    [PRODUCT_SPECIFICATION_COLUMNS.SPEC_PHOTO_KEY]: text().notNull(),

    /**
     * order index for sorting specification items
     */
    [PRODUCT_SPECIFICATION_COLUMNS.ORDER_INDEX]: int().notNull().default(0),
} as const;

const PRODUCT_VARIANT_COLUMN_FIELDS = {
    ...COMMON_FIELDS,

    [COMMON_COLUMNS.ID]: int().primaryKey(),

    /**
     * references the product table (id)
     */
    [PRODUCT_VARIANT_COLUMNS.PRODUCT_ID]: int()
        .notNull()
        .references(() => products.id, {
            onDelete: "cascade",
        }),

    /**
     * variant name (e.g., "Flat, Cube, Hexa")
     */
    [PRODUCT_VARIANT_COLUMNS.EN_VARIANT_NAME]: text().notNull(),
    [PRODUCT_VARIANT_COLUMNS.AR_VARIANT_NAME]: text().notNull(),

    /**
     * variant photo key in S3
     */
    [PRODUCT_VARIANT_COLUMNS.VARIANT_PHOTO_KEY]: text().notNull(),

    /**
     * array of available sizes for this variant (e.g., ["Small", "Medium", "Large"])
     */
    [PRODUCT_VARIANT_COLUMNS.VARIANT_SIZES]: text({
        mode: "json",
    })
        .notNull()
        .$type<string[]>()
        .$default(() => []),

    /**
     * order index for sorting variant items
     */
    [PRODUCT_VARIANT_COLUMNS.ORDER_INDEX]: int().notNull().default(0),
};

const PRODUCT_PACKAGING_OPTION_COLUMN_FIELDS = {
    ...COMMON_FIELDS,

    [COMMON_COLUMNS.ID]: int().primaryKey(),

    [PRODUCT_PACKAGING_OPTION_COLUMNS.PRODUCT_ID]: int()
        .notNull()
        .references(() => products.id, {
            onDelete: "cascade",
        }),

    [PRODUCT_PACKAGING_OPTION_COLUMNS.PACKAGING_OPTION_ID]: int()
        .notNull()
        .references(() => packagingOptions.id, {
            onDelete: "cascade",
        }),
} as const;

/**
 * for storing page metadata for SEO purposes
 */
const PAGE_METADATA_COLUMN_FIELDS = {
    ...COMMON_FIELDS,

    [COMMON_COLUMNS.ID]: int().primaryKey(),

    /**
     * the path of the page
     */
    [PAGE_METADATA_COLUMNS.PATH]: text().notNull().unique(),

    /**
     * SEO metadata fields
     */
    [PAGE_METADATA_COLUMNS.METADATA_TITLE]: text().notNull(),

    /**
     * description for SEO
     */
    [PAGE_METADATA_COLUMNS.METADATA_DESCRIPTION]: text().notNull(),

    /**
     * keywords for SEO
     */
    [PAGE_METADATA_COLUMNS.METADATA_KEYWORDS]: text({
        mode: "json",
    })
        .notNull()
        .$type<string[]>()
        .$default(() => []),

    [PAGE_METADATA_COLUMNS.SITEMAP_PRIORITY]: real()
        .notNull()
        .$default(() => 0.5),

    [PAGE_METADATA_COLUMNS.SITEMAP_CHANGEFREQ]: text({
        enum: SITEMAP_CHANGEFREQ_ENUM,
    })
        .notNull()
        .$default(() => "weekly"),
} as const;

const TEAM_MEMBER_COLUMN_FIELDS = {
    ...COMMON_FIELDS,

    [COMMON_COLUMNS.ID]: int().primaryKey(),

    [TEAM_MEMBER_COLUMNS.NAME]: text().notNull(),
    [TEAM_MEMBER_COLUMNS.POSITION]: text().notNull(),
    [TEAM_MEMBER_COLUMNS.PHOTO_KEY]: text().notNull(),
    [TEAM_MEMBER_COLUMNS.ORDER_INDEX]: int().notNull().default(0),
} as const;

export const FAQ_COLUMN_FIELDS = {
    ...COMMON_FIELDS,

    [COMMON_COLUMNS.ID]: int().primaryKey(),

    /**
     * English question
     */
    [FAQ_COLUMNS.EN_QUESTION]: text().notNull(),

    /**
     * Arabic question
     */
    [FAQ_COLUMNS.AR_QUESTION]: text().notNull(),

    /**
     * English answer
     */
    [FAQ_COLUMNS.EN_ANSWER]: text().notNull(),

    /**
     * Arabic answer
     */
    [FAQ_COLUMNS.AR_ANSWER]: text().notNull(),

    /**
     * order index for sorting FAQ items
     */
    [FAQ_COLUMNS.ORDER_INDEX]: int().notNull(),
} as const;

/**
 * table used by better-auth to store users
 */

export const users = sqliteTable(TABLE_NAMES.USERS, USER_COLUMN_FIELDS);

/**
 * table for storing user sessions
 */
export const sessions = sqliteTable(
    TABLE_NAMES.SESSIONS,
    SESSION_COLUMN_FIELDS
);

/**
 * table for storing accounts, a user can have multiple accounts (google, github, username, etc.)
 */
export const accounts = sqliteTable(
    TABLE_NAMES.ACCOUNTS,
    ACCOUNT_COLUMN_FIELDS
);

/**
 * table for storing verifications (e.g., email verification, password reset)
 */
export const verifications = sqliteTable(
    TABLE_NAMES.VERIFICATIONS,
    VERIFICATION_COLUMN_FIELDS
);

/**
 * table for storing gallery photo metadata
 * actual photos are stored in Cloudflare R2
 */
export const galleryPhotos = sqliteTable(
    TABLE_NAMES.GALLERY_PHOTOS,
    GALLERY_COLUMN_FIELDS
);

/**
 * table for storing news articles
 */
export const news = sqliteTable(TABLE_NAMES.NEWS, NEWS_COLUMN_FIELDS);

/**
 * for storing news tags
 */
export const tags = sqliteTable(TABLE_NAMES.TAGS, TAG_COLUMN_FIELDS);

/**
 * for storing packaging options
 */
export const packagingOptions = sqliteTable(
    TABLE_NAMES.PACKAGING_OPTIONS,
    PACKAGING_OPTION_COLUMN_FIELDS
);

/**
 * for storing products
 */
export const products = sqliteTable(
    TABLE_NAMES.PRODUCTS,
    PRODUCT_COLUMN_FIELDS
);

export const productMedias = sqliteTable(
    TABLE_NAMES.PRODUCT_MEDIAS,
    PRODUCT_MEDIA_COLUMN_FIELDS
);

export const productPackagingOptions = sqliteTable(
    TABLE_NAMES.PRODUCT_PACKAGING_OPTIONS,
    PRODUCT_PACKAGING_OPTION_COLUMN_FIELDS
);

export const productSpecifications = sqliteTable(
    TABLE_NAMES.PRODUCT_SPECIFICATIONS,
    PRODUCT_SPECIFICATION_COLUMN_FIELDS
);

export const productVariants = sqliteTable(
    TABLE_NAMES.PRODUCT_VARIANTS,
    PRODUCT_VARIANT_COLUMN_FIELDS
);

export const pageMetadatas = sqliteTable(
    TABLE_NAMES.PAGE_METADATAS,
    PAGE_METADATA_COLUMN_FIELDS
);

/**
 * table for storing team members
 */
export const teams = sqliteTable(
    TABLE_NAMES.TEAM_MEMBERS,
    TEAM_MEMBER_COLUMN_FIELDS
);

export const faqs = sqliteTable(TABLE_NAMES.FAQS, FAQ_COLUMN_FIELDS);

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

export const packagingOptionRelations = relations(
    packagingOptions,
    ({ one }) => ({
        createdBy: one(users, {
            fields: [packagingOptions[COMMON_COLUMNS.CREATED_BY]],
            references: [users[COMMON_COLUMNS.ID]],
        }),
        updatedBy: one(users, {
            fields: [packagingOptions[COMMON_COLUMNS.UPDATED_BY]],
            references: [users[COMMON_COLUMNS.ID]],
        }),
    })
);

export const productMediaRelations = relations(productMedias, ({ one }) => ({
    product: one(products, {
        fields: [productMedias[PRODUCT_MEDIA_COLUMNS.PRODUCT_ID]],
        references: [products[COMMON_COLUMNS.ID]],
    }),
}));

export const productRelations = relations(products, ({ one, many }) => ({
    createdBy: one(users, {
        fields: [products[COMMON_COLUMNS.CREATED_BY]],
        references: [users[COMMON_COLUMNS.ID]],
    }),
    updatedBy: one(users, {
        fields: [products[COMMON_COLUMNS.UPDATED_BY]],
        references: [users[COMMON_COLUMNS.ID]],
    }),
    medias: many(productMedias),
    packagingOptions: many(productPackagingOptions),
    specifications: many(productSpecifications),
    variants: many(productVariants),
}));

export const productSpecificationRelations = relations(
    productSpecifications,
    ({ one }) => ({
        product: one(products, {
            fields: [
                productSpecifications[PRODUCT_SPECIFICATION_COLUMNS.PRODUCT_ID],
            ],
            references: [products[COMMON_COLUMNS.ID]],
        }),
    })
);

export const productVariantRelations = relations(
    productVariants,
    ({ one }) => ({
        product: one(products, {
            fields: [productVariants[PRODUCT_VARIANT_COLUMNS.PRODUCT_ID]],
            references: [products[COMMON_COLUMNS.ID]],
        }),
    })
);

export const productPackagingOptionRelations = relations(
    productPackagingOptions,
    ({ one }) => ({
        product: one(products, {
            fields: [
                productPackagingOptions[
                    PRODUCT_PACKAGING_OPTION_COLUMNS.PRODUCT_ID
                ],
            ],
            references: [products[COMMON_COLUMNS.ID]],
        }),
        packagingOption: one(packagingOptions, {
            fields: [
                productPackagingOptions[
                    PRODUCT_PACKAGING_OPTION_COLUMNS.PACKAGING_OPTION_ID
                ],
            ],
            references: [packagingOptions[COMMON_COLUMNS.ID]],
        }),
    })
);

export const galleryPhotoRelations = relations(galleryPhotos, () => ({}));

export const verificationRelations = relations(verifications, () => ({}));

export const tagRelations = relations(tags, () => ({}));

export const pageMetadataRelations = relations(pageMetadatas, () => ({}));

export const teamMemberRelations = relations(teams, () => ({}));

export const faqRelations = relations(faqs, () => ({}));
