import "server-only";

import { headers } from "next/headers";

import { and, count, desc, eq, gte, like, lte, or, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

import {
    BulkCreateTagsInputSchema,
    ChangeStatusInputSchema,
    CheckSlugAvailabilityInputSchema,
    CheckSlugAvailabilityOutputSchema,
    CreateNewsInputSchema,
    CreateTagInputSchema,
    DeleteNewsInputSchema,
    GenerateImageUploadUrlInputSchema,
    GenerateImageUploadUrlOutputSchema,
    GetNewsByIdInputSchema,
    ListNewsInputSchema,
    ListNewsOutputSchema,
    ListTagsInputSchema,
    ListTagsOutputSchema,
    NewsArticleWithContentSchema,
    TagSchema,
    UpdateNewsInputSchema,
    UpdateNewsOutputSchema,
} from "./schemas";
import {
    COMMON_COLUMNS,
    NEWS_COLUMNS,
    NEWS_STATUS,
    TAG_COLUMNS,
} from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { news, tags } from "@/adapters/d1/schema";
import {
    deleteObject,
    generatePresignedUploadUrl,
    getR2Client,
    getTextContent,
    NEWS_CONTENT_PREFIX,
    NEWS_IMAGES_PREFIX,
    uploadTextContent,
} from "@/adapters/r2";
import { getAuth } from "@/features/admin-auth/lib/better-auth-server";
import base from "@/lib/orpc/server";

/**
 * List news articles with pagination and filters
 */
export const listNews = base
    .input(ListNewsInputSchema)
    .output(ListNewsOutputSchema)
    .handler(async function ({ context: { env }, errors, input }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);

        const header = await headers();
        const user = await auth.api.getSession({
            headers: header,
        });

        if (!user) throw errors.UNAUTHORIZED();

        const {
            page,
            limit,
            titleSearch,
            tags: filterTags,
            status,
            publishedFrom,
            publishedTo,
            createdFrom,
            createdTo,
        } = input;

        // Build where conditions
        const whereConditions = [];

        if (titleSearch) {
            whereConditions.push(
                like(news[NEWS_COLUMNS.EN_TITLE], `%${titleSearch}%`)
            );
        }

        if (status !== "all") {
            whereConditions.push(eq(news[NEWS_COLUMNS.STATUS], status));
        }

        // Apply published date filters only when status is published/unpublished
        if (status === "published" || status === "unpublished") {
            if (publishedFrom) {
                whereConditions.push(
                    gte(news[NEWS_COLUMNS.PUBLISHED_AT], publishedFrom)
                );
            }

            if (publishedTo) {
                whereConditions.push(
                    lte(news[NEWS_COLUMNS.PUBLISHED_AT], publishedTo)
                );
            }
        } else {
            // For "all" and "draft", apply created date filters if provided
            if (createdFrom) {
                whereConditions.push(
                    gte(news[COMMON_COLUMNS.CREATED_AT], createdFrom)
                );
            }

            if (createdTo) {
                whereConditions.push(
                    lte(news[COMMON_COLUMNS.CREATED_AT], createdTo)
                );
            }
        }

        // Add tag filter using SQL
        if (filterTags.length) {
            // Use SQLite JSON functions to check if any tag exists in the JSON array
            // json_each() expands the JSON array, and we check if the value matches any filter tag
            const conditions = filterTags.map(
                (tag) =>
                    sql`EXISTS (
                    SELECT 1 FROM json_each(${news[NEWS_COLUMNS.METADATA_TAG_LIST]})
                    WHERE json_each.value = ${tag}
                )`
            );
            whereConditions.push(or(...conditions));
        }

        const whereClause = whereConditions.length
            ? and(...whereConditions)
            : undefined;

        // Get total count
        const [{ total }] = await db
            .select({ total: count() })
            .from(news)
            .where(whereClause);

        // Get paginated items
        const items = await db
            .select({
                id: news[COMMON_COLUMNS.ID],
                slug: news[NEWS_COLUMNS.SLUG],
                imageKey: news[NEWS_COLUMNS.IMAGE_KEY],
                metadataTitle: news[NEWS_COLUMNS.METADATA_TITLE],
                metadataDescription: news[NEWS_COLUMNS.METADATA_DESCRIPTION],
                metadataTags: news[NEWS_COLUMNS.METADATA_TAG_LIST],
                enTitle: news[NEWS_COLUMNS.EN_TITLE],
                arTitle: news[NEWS_COLUMNS.AR_TITLE],
                status: news[NEWS_COLUMNS.STATUS],
                publishedAt: news[NEWS_COLUMNS.PUBLISHED_AT],
                publishedBy: news[NEWS_COLUMNS.PUBLISHED_BY],
                createdAt: news[COMMON_COLUMNS.CREATED_AT],
                createdBy: news[COMMON_COLUMNS.CREATED_BY],
                updatedAt: news[COMMON_COLUMNS.UPDATED_AT],
                updatedBy: news[COMMON_COLUMNS.UPDATED_BY],
            })
            .from(news)
            .where(whereClause)
            .orderBy(desc(news[COMMON_COLUMNS.CREATED_AT]))
            .limit(limit)
            .offset((page - 1) * limit);

        return {
            items: items.map((item) => ({
                ...item,
                status: item.status ?? NEWS_STATUS.DRAFT,
                publishedAt: item.publishedAt,
                metadataTags: Array.isArray(item.metadataTags)
                    ? item.metadataTags
                    : [],

                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    })
    .callable();

/**
 * Get a single news article by ID with full content
 */
export const getNewsById = base
    .input(GetNewsByIdInputSchema)
    .output(NewsArticleWithContentSchema)
    .handler(async function ({ context: { env }, errors, input: { id } }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);

        const header = await headers();
        const user = await auth.api.getSession({
            headers: header,
        });

        if (!user) throw errors.UNAUTHORIZED();

        const article = await db.query.news.findFirst({
            where(fields, operators) {
                return operators.eq(fields[COMMON_COLUMNS.ID], id);
            },
        });

        if (!article) {
            throw errors.NOT_FOUND({ message: "News article not found" });
        }

        // Get content from R2
        const r2Client = getR2Client({
            endpoint: env.S3_API,
            accessKeyId: env.R2_ACCESS_KEY_ID,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        });

        const [enContent, arContent] = await Promise.all([
            getTextContent(r2Client, article.en_content_key),
            getTextContent(r2Client, article.ar_content_key),
        ]);

        return {
            id: article.id,
            slug: article.slug,
            imageKey: article.image_key,
            metadataTitle: article.metadata_title,
            metadataDescription: article.metadata_description,
            metadataTags: article.metadata_tag_list ?? [],
            enTitle: article.en_title,
            enContent,
            arTitle: article.ar_title,
            arContent,
            status: article.status ?? NEWS_STATUS.DRAFT,
            publishedAt: article.published_at,
            publishedBy: article.published_by,
            createdAt: article.created_at,
            createdBy: article.created_by,
            updatedAt: article.updated_at,
            updatedBy: article.updated_by,
        };
    })
    .callable();

/**
 * Create a new news article
 */
export const createNews = base
    .input(CreateNewsInputSchema)
    .handler(async function ({
        context: { env },
        errors,
        input,
    }): Promise<{ id: number }> {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const user = await auth.api.getSession({
            headers: header,
        });

        if (!user) throw errors.UNAUTHORIZED();

        // Auto-create tags if they don't exist (insert or ignore)
        if (input.metadataTags.length > 0) {
            function sluggify(name: string) {
                return name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "");
            }

            const nameSlugPairs = input.metadataTags.map((name) => ({
                name,
                slug: sluggify(name),
            }));

            await db.insert(tags).values(nameSlugPairs).onConflictDoNothing();
        }

        // Check if slug is available
        const existing = await db.query.news.findFirst({
            where(fields, operators) {
                return operators.eq(fields.slug, input.slug);
            },
        });

        if (existing)
            throw errors.BAD_REQUEST({ message: "Slug already exists" });

        // Generate R2 keys for content
        const enContentKey = `${NEWS_CONTENT_PREFIX}/${nanoid()}-en.html`;
        const arContentKey = `${NEWS_CONTENT_PREFIX}/${nanoid()}-ar.html`;

        // Upload content to R2
        const r2Client = getR2Client({
            endpoint: env.S3_API,
            accessKeyId: env.R2_ACCESS_KEY_ID,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        });

        await Promise.all([
            uploadTextContent(r2Client, enContentKey, input.enContent),
            uploadTextContent(r2Client, arContentKey, input.arContent),
        ]);

        // Insert into database
        const userId = user.user.id;

        // For fresh mode with draft status, publishedAt should be null
        // For fresh mode with published status, use provided publishedAt (for scheduling) or current time
        // For migration mode, always use provided publishedAt
        let publishedAt: Date | null = null;
        let publishedBy: string | null = null;

        if (input.status === NEWS_STATUS.PUBLISHED) {
            if (input.mode === "migration") {
                // Migration mode: use provided date (can be past)
                publishedAt = input.publishedAt ?? new Date();
            } else {
                // Fresh mode: use provided date (can be future for scheduling) or current time
                publishedAt = input.publishedAt ?? new Date();
            }
            publishedBy = userId;
        }

        const [inserted] = await db
            .insert(news)
            .values({
                [NEWS_COLUMNS.SLUG]: input.slug,
                [NEWS_COLUMNS.IMAGE_KEY]: input.imageKey,
                [NEWS_COLUMNS.METADATA_TITLE]: input.metadataTitle,
                [NEWS_COLUMNS.METADATA_DESCRIPTION]: input.metadataDescription,
                [NEWS_COLUMNS.METADATA_TAG_LIST]: input.metadataTags,
                [NEWS_COLUMNS.EN_TITLE]: input.enTitle,
                [NEWS_COLUMNS.EN_CONTENT_KEY]: enContentKey,
                [NEWS_COLUMNS.AR_TITLE]: input.arTitle,
                [NEWS_COLUMNS.AR_CONTENT_KEY]: arContentKey,
                [NEWS_COLUMNS.STATUS]: input.status,
                [NEWS_COLUMNS.PUBLISHED_AT]: publishedAt,
                [NEWS_COLUMNS.PUBLISHED_BY]: publishedBy,
                [COMMON_COLUMNS.CREATED_BY]: userId,
                [COMMON_COLUMNS.UPDATED_BY]: userId,
            })
            .returning({
                id: news[COMMON_COLUMNS.ID],
            });

        return { id: inserted.id };
    })
    .callable();

/**
 * Update an existing news article
 */
export const updateNews = base
    .input(UpdateNewsInputSchema)
    .output(UpdateNewsOutputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();
        const user = await auth.api.getSession({
            headers: header,
        });

        if (!user) throw errors.UNAUTHORIZED();

        // Auto-create tags if they don't exist (insert or ignore)
        if (input.metadataTags.length > 0) {
            function sluggify(name: string) {
                return name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "");
            }

            const nameSlugPairs = input.metadataTags.map((name) => ({
                name,
                slug: sluggify(name),
            }));

            await db.insert(tags).values(nameSlugPairs).onConflictDoNothing();
        }

        // Get existing article
        const existing = await db.query.news.findFirst({
            where(fields, operators) {
                return operators.eq(fields.id, input.id);
            },
        });

        if (!existing)
            throw errors.NOT_FOUND({ message: "News article not found" });

        // Update content in R2
        const r2Client = getR2Client({
            endpoint: env.S3_API,
            accessKeyId: env.R2_ACCESS_KEY_ID,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        });

        await Promise.all([
            uploadTextContent(
                r2Client,
                existing[NEWS_COLUMNS.EN_CONTENT_KEY],
                input.enContent
            ),
            uploadTextContent(
                r2Client,
                existing[NEWS_COLUMNS.AR_CONTENT_KEY],
                input.arContent
            ),
        ]);

        // Update database
        const userId = user.user.id;

        // Handle publication status changes
        let publishedAt: Date | null = input.publishedAt ?? null;
        let publishedBy: string | null = existing[NEWS_COLUMNS.PUBLISHED_BY];

        if (input.status === NEWS_STATUS.PUBLISHED) {
            // If changing to published, set published date and user
            publishedAt = input.publishedAt ?? new Date();
            publishedBy = userId;
        } else if (input.status === NEWS_STATUS.DRAFT) {
            // If changing to draft, clear published date and user
            publishedAt = null;
            publishedBy = null;
        }
        // For unpublished status, keep existing published date and user

        await db
            .update(news)
            .set({
                [NEWS_COLUMNS.IMAGE_KEY]: input.imageKey,
                [NEWS_COLUMNS.METADATA_DESCRIPTION]: input.metadataDescription,
                [NEWS_COLUMNS.METADATA_TAG_LIST]: input.metadataTags,
                [NEWS_COLUMNS.EN_TITLE]: input.enTitle,
                [NEWS_COLUMNS.AR_TITLE]: input.arTitle,
                [NEWS_COLUMNS.STATUS]: input.status,
                [NEWS_COLUMNS.PUBLISHED_AT]: publishedAt,
                [NEWS_COLUMNS.PUBLISHED_BY]: publishedBy,
                [COMMON_COLUMNS.UPDATED_BY]: userId,
                [COMMON_COLUMNS.UPDATED_AT]: new Date(),
            })
            .where(eq(news[COMMON_COLUMNS.ID], input.id));

        return {
            id: input.id,
        };
    })
    .callable();

/**
 * Delete a news article
 */
export const deleteNews = base
    .input(DeleteNewsInputSchema)
    .handler(async function ({ context: { env }, errors, input }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);

        const header = await headers();
        const user = await auth.api.getSession({
            headers: header,
        });

        if (!user) throw errors.UNAUTHORIZED();

        // Get article to delete R2 objects
        const article = await db.query.news.findFirst({
            where(fields, operators) {
                return operators.eq(fields[COMMON_COLUMNS.ID], input.id);
            },
        });

        if (!article) {
            throw errors.NOT_FOUND({ message: "News article not found" });
        }

        // Delete from R2
        const r2Client = getR2Client({
            endpoint: env.S3_API,
            accessKeyId: env.R2_ACCESS_KEY_ID,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        });

        const deletePromises = [
            deleteObject(r2Client, article.en_content_key),
            deleteObject(r2Client, article.ar_content_key),
        ];

        if (article.image_key) {
            deletePromises.push(deleteObject(r2Client, article.image_key));
        }

        await Promise.all(deletePromises);

        // Delete from database
        await db.delete(news).where(eq(news[COMMON_COLUMNS.ID], input.id));
    })
    .callable();

/**
 * Change the status of a news article
 * Handles transitions: draft -> published, published -> unpublished, unpublished -> published
 */
export const changeStatus = base
    .input(ChangeStatusInputSchema)
    .handler(async function ({ context: { env }, errors, input }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);

        const header = await headers();
        const user = await auth.api.getSession({
            headers: header,
        });

        if (!user) throw errors.UNAUTHORIZED();

        const userId = user.user.id;

        // Get current article to check existing status
        const existing = await db.query.news.findFirst({
            where(fields, operators) {
                return operators.eq(fields.id, input.id);
            },
        });

        if (!existing) {
            throw errors.NOT_FOUND({ message: "News article not found" });
        }

        // Validate status transitions
        if (
            existing.status === NEWS_STATUS.DRAFT &&
            input.status === NEWS_STATUS.UNPUBLISHED
        ) {
            throw errors.BAD_REQUEST({
                message:
                    "Cannot unpublish a draft article. Article must be published first.",
            });
        }

        let publishedAt: Date | null = existing.published_at;
        let publishedBy: string | null = existing.published_by;

        if (input.status === NEWS_STATUS.PUBLISHED) {
            // Publishing: set published date and user if not already set
            if (!publishedAt) {
                publishedAt = new Date();
                publishedBy = userId;
            }
        } else if (input.status === NEWS_STATUS.DRAFT) {
            // Back to draft: clear published info
            publishedAt = null;
            publishedBy = null;
        }
        // For unpublished: keep existing published date/user

        await db
            .update(news)
            .set({
                [NEWS_COLUMNS.STATUS]: input.status,
                [NEWS_COLUMNS.PUBLISHED_AT]: publishedAt,
                [NEWS_COLUMNS.PUBLISHED_BY]: publishedBy,
                [COMMON_COLUMNS.UPDATED_BY]: userId,
                [COMMON_COLUMNS.UPDATED_AT]: new Date(),
            })
            .where(eq(news[COMMON_COLUMNS.ID], input.id));
    })
    .callable();

/**
 * @deprecated Use changeStatus instead
 */
export const togglePublish = changeStatus;

/**
 * Check if a slug is available
 */
export const checkSlugAvailability = base
    .input(CheckSlugAvailabilityInputSchema)
    .output(CheckSlugAvailabilityOutputSchema)
    .handler(async function ({ context: { env }, errors, input }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);

        const header = await headers();
        const user = await auth.api.getSession({
            headers: header,
        });

        if (!user) throw errors.UNAUTHORIZED();

        const whereConditions = [eq(news[NEWS_COLUMNS.SLUG], input.slug)];

        if (input.excludeId) {
            whereConditions.push(eq(news[COMMON_COLUMNS.ID], input.excludeId));
        }

        const existing = await db.query.news.findFirst({
            where() {
                return and(...whereConditions);
            },
        });

        return {
            available: !existing,
        };
    })
    .callable();

/**
 * Generate presigned URL for news image upload
 */
export const generateImageUploadUrl = base
    .input(GenerateImageUploadUrlInputSchema)
    .output(GenerateImageUploadUrlOutputSchema)
    .handler(async function ({ context: { env }, errors, input }) {
        const auth = getAuth(env);
        const header = await headers();
        const user = await auth.api.getSession({
            headers: header,
        });

        if (!user) throw errors.UNAUTHORIZED();

        const r2Client = getR2Client({
            endpoint: env.S3_API,
            accessKeyId: env.R2_ACCESS_KEY_ID,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        });

        const key = `${NEWS_IMAGES_PREFIX}/${nanoid()}-${input.fileName}`;
        const uploadUrl = await generatePresignedUploadUrl(r2Client, {
            key,
            contentType: input.contentType,
        });

        return {
            uploadUrl,
            key,
        };
    })
    .callable();

/**
 * List all tags
 */
export const listTags = base
    .input(ListTagsInputSchema)
    .output(ListTagsOutputSchema)
    .handler(async function ({ context: { env }, input: { limit, search } }) {
        const db = getDB(env.DJAVACOAL_DB);

        // Build where condition for search
        const whereCondition = search
            ? like(tags[TAG_COLUMNS.NAME], `%${search}%`)
            : undefined;

        const items = await db
            .select({
                id: tags[COMMON_COLUMNS.ID],
                name: tags[TAG_COLUMNS.NAME],
                slug: tags[TAG_COLUMNS.SLUG],
                createdAt: tags[COMMON_COLUMNS.CREATED_AT],
                updatedAt: tags[COMMON_COLUMNS.UPDATED_AT],
            })
            .from(tags)
            .where(whereCondition)
            .limit(limit)
            .orderBy(tags[TAG_COLUMNS.NAME]);

        return { items };
    })
    .callable();

/**
 * Create a new tag
 */
export const createTag = base
    .input(CreateTagInputSchema)
    .output(TagSchema)
    .handler(async function ({ context: { env }, errors, input: { name } }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();
        const user = await auth.api.getSession({
            headers: header,
        });

        if (!user) throw errors.UNAUTHORIZED();

        // Generate slug from name
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        // Check if slug already exists
        const existing = await db.query.tags.findFirst({
            where(fields, operators) {
                return operators.eq(fields[TAG_COLUMNS.SLUG], slug);
            },
        });

        if (existing) {
            throw errors.BAD_REQUEST({ message: "Tag already exists" });
        }

        const [inserted] = await db
            .insert(tags)
            .values({
                name,
                slug,
            })
            .returning({
                id: tags[COMMON_COLUMNS.ID],
                name: tags[TAG_COLUMNS.NAME],
                slug: tags[TAG_COLUMNS.SLUG],
                createdAt: tags[COMMON_COLUMNS.CREATED_AT],
                updatedAt: tags[COMMON_COLUMNS.UPDATED_AT],
            });

        return inserted;
    })
    .callable();

/**
 * Bulk create tags (for form submission)
 */
export const bulkCreateTags = base
    .input(BulkCreateTagsInputSchema)
    .output(ListTagsOutputSchema)
    .handler(async function ({ context: { env }, errors, input: { names } }) {
        const auth = getAuth(env);
        const header = await headers();
        const user = await auth.api.getSession({
            headers: header,
        });

        if (!user) throw errors.UNAUTHORIZED();

        const db = getDB(env.DJAVACOAL_DB);

        // const created = [];

        function sluggify(name: string) {
            return name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
        }

        const nameSlugPairs = names.map((name) => ({
            name,
            slug: sluggify(name),
        }));

        const created = await db
            .insert(tags)
            .values(nameSlugPairs)
            .onConflictDoNothing()
            .returning({
                id: tags[COMMON_COLUMNS.ID],
                name: tags[TAG_COLUMNS.NAME],
                slug: tags[TAG_COLUMNS.SLUG],
                createdAt: tags[COMMON_COLUMNS.CREATED_AT],
                updatedAt: tags[COMMON_COLUMNS.UPDATED_AT],
            });

        return { items: created };
    })
    .callable();
