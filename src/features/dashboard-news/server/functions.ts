import "server-only";

import { and, count, desc, eq, gte, like, lte, or } from "drizzle-orm";
import { nanoid } from "nanoid";

import {
    BulkCreateTagsInputSchema,
    CheckSlugAvailabilityInputSchema,
    CheckSlugAvailabilityOutput,
    CheckSlugAvailabilityOutputSchema,
    CreateNewsInputSchema,
    CreateTagInputSchema,
    DeleteNewsInputSchema,
    GenerateImageUploadUrlInputSchema,
    GenerateImageUploadUrlOutput,
    GenerateImageUploadUrlOutputSchema,
    GetNewsByIdInputSchema,
    ListNewsInputSchema,
    ListNewsOutput,
    ListNewsOutputSchema,
    ListTagsInputSchema,
    ListTagsOutput,
    ListTagsOutputSchema,
    NewsArticleWithContent,
    NewsArticleWithContentSchema,
    TagSchema,
    TogglePublishInputSchema,
    UpdateNewsInputSchema,
} from "./schemas";
import {
    COMMON_COLUMNS,
    NEWS_COLUMNS,
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
import base from "@/lib/orpc/server";

/**
 * List news articles with pagination and filters
 */
export const listNews = base
    .input(ListNewsInputSchema)
    .output(ListNewsOutputSchema)
    .handler(async function ({
        context: { env },
        input,
    }): Promise<ListNewsOutput> {
        // TODO: Implement authentication check
        // if (!user) throw errors.UNAUTHORIZED();

        const db = getDB(env.DJAVACOAL_DB);
        const {
            page,
            limit,
            titleSearch,
            tags: _tagFilter,
            status,
            dateFrom,
            dateTo,
        } = input;

        // Build where conditions
        const whereConditions = [];

        if (titleSearch) {
            whereConditions.push(
                like(news[NEWS_COLUMNS.EN_TITLE], `%${titleSearch}%`)
            );
        }

        if (status !== "all") {
            whereConditions.push(
                eq(news[NEWS_COLUMNS.IS_PUBLISHED], status === "published")
            );
        }

        if (dateFrom) {
            whereConditions.push(
                gte(news[NEWS_COLUMNS.PUBLISHED_AT], dateFrom)
            );
        }

        if (dateTo) {
            whereConditions.push(lte(news[NEWS_COLUMNS.PUBLISHED_AT], dateTo));
        }

        // TODO: Implement tag filtering
        // This requires a more complex query or JSON manipulation

        const whereClause =
            whereConditions.length > 0 ? and(...whereConditions) : undefined;

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
                isPublished: news[NEWS_COLUMNS.IS_PUBLISHED],
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
                isPublished: item.isPublished ?? false,
                metadataTags: Array.isArray(item.metadataTags)
                    ? item.metadataTags
                    : [],
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
    .handler(async function ({
        context: { env },
        input,
    }): Promise<NewsArticleWithContent> {
        // TODO: Implement authentication check
        // if (!user) throw errors.UNAUTHORIZED();

        const db = getDB(env.DJAVACOAL_DB);
        const { id } = input;

        const [article] = await db
            .select({
                id: news[COMMON_COLUMNS.ID],
                slug: news[NEWS_COLUMNS.SLUG],
                imageKey: news[NEWS_COLUMNS.IMAGE_KEY],
                metadataTitle: news[NEWS_COLUMNS.METADATA_TITLE],
                metadataDescription: news[NEWS_COLUMNS.METADATA_DESCRIPTION],
                metadataTags: news[NEWS_COLUMNS.METADATA_TAG_LIST],
                enTitle: news[NEWS_COLUMNS.EN_TITLE],
                enContentKey: news[NEWS_COLUMNS.EN_CONTENT_KEY],
                arTitle: news[NEWS_COLUMNS.AR_TITLE],
                arContentKey: news[NEWS_COLUMNS.AR_CONTENT_KEY],
                isPublished: news[NEWS_COLUMNS.IS_PUBLISHED],
                publishedAt: news[NEWS_COLUMNS.PUBLISHED_AT],
                publishedBy: news[NEWS_COLUMNS.PUBLISHED_BY],
                createdAt: news[COMMON_COLUMNS.CREATED_AT],
                createdBy: news[COMMON_COLUMNS.CREATED_BY],
                updatedAt: news[COMMON_COLUMNS.UPDATED_AT],
                updatedBy: news[COMMON_COLUMNS.UPDATED_BY],
            })
            .from(news)
            .where(eq(news[COMMON_COLUMNS.ID], id));

        // TODO: Implement not found error
        // if (!article) throw errors.NOT_FOUND({ message: "News article not found" });

        // Get content from R2
        const r2Client = getR2Client({
            endpoint: env.S3_API,
            accessKeyId: env.R2_ACCESS_KEY_ID,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        });

        const [enContent, arContent] = await Promise.all([
            getTextContent(r2Client, article.enContentKey),
            getTextContent(r2Client, article.arContentKey),
        ]);

        return {
            id: article.id,
            slug: article.slug,
            imageKey: article.imageKey,
            metadataTitle: article.metadataTitle,
            metadataDescription: article.metadataDescription,
            metadataTags: Array.isArray(article.metadataTags)
                ? article.metadataTags
                : [],
            enTitle: article.enTitle,
            enContent,
            arTitle: article.arTitle,
            arContent,
            isPublished: article.isPublished ?? false,
            publishedAt: article.publishedAt,
            publishedBy: article.publishedBy,
            createdAt: article.createdAt,
            createdBy: article.createdBy,
            updatedAt: article.updatedAt,
            updatedBy: article.updatedBy,
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
        input,
    }): Promise<{ id: number }> {
        // TODO: Implement authentication check
        // if (!user) throw errors.UNAUTHORIZED();

        const db = getDB(env.DJAVACOAL_DB);

        // Check if slug is available
        const [_existing] = await db
            .select()
            .from(news)
            .where(eq(news[NEWS_COLUMNS.SLUG], input.slug))
            .limit(1);

        // TODO: Implement conflict error
        // if (existing) throw errors.CONFLICT({ message: "Slug already exists" });

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
        const userId = "user-id-placeholder"; // TODO: Get from user context

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
                [NEWS_COLUMNS.IS_PUBLISHED]: input.isPublished,
                [NEWS_COLUMNS.PUBLISHED_AT]: input.isPublished
                    ? input.publishedAt
                    : null,
                [NEWS_COLUMNS.PUBLISHED_BY]: input.isPublished ? userId : null,
                [COMMON_COLUMNS.CREATED_BY]: userId,
                [COMMON_COLUMNS.UPDATED_BY]: userId,
            })
            .returning({ id: news[COMMON_COLUMNS.ID] });

        return { id: inserted.id };
    })
    .callable();

/**
 * Update an existing news article
 */
export const updateNews = base
    .input(UpdateNewsInputSchema)
    .handler(async function ({
        context: { env },
        input,
    }): Promise<{ id: number }> {
        // TODO: Implement authentication check
        // if (!user) throw errors.UNAUTHORIZED();

        const db = getDB(env.DJAVACOAL_DB);

        // Get existing article
        const [_existing] = await db
            .select({
                enContentKey: news[NEWS_COLUMNS.EN_CONTENT_KEY],
                arContentKey: news[NEWS_COLUMNS.AR_CONTENT_KEY],
            })
            .from(news)
            .where(eq(news[COMMON_COLUMNS.ID], input.id));

        // TODO: Implement not found error
        // if (!existing) throw errors.NOT_FOUND({ message: "News article not found" });

        // Update content in R2
        const r2Client = getR2Client({
            endpoint: env.S3_API,
            accessKeyId: env.R2_ACCESS_KEY_ID,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        });

        await Promise.all([
            uploadTextContent(
                r2Client,
                _existing.enContentKey,
                input.enContent
            ),
            uploadTextContent(
                r2Client,
                _existing.arContentKey,
                input.arContent
            ),
        ]);

        // Update database
        const userId = "user-id-placeholder"; // TODO: Get from user context

        await db
            .update(news)
            .set({
                [NEWS_COLUMNS.IMAGE_KEY]: input.imageKey,
                [NEWS_COLUMNS.METADATA_DESCRIPTION]: input.metadataDescription,
                [NEWS_COLUMNS.METADATA_TAG_LIST]: input.metadataTags,
                [NEWS_COLUMNS.EN_TITLE]: input.enTitle,
                [NEWS_COLUMNS.AR_TITLE]: input.arTitle,
                [NEWS_COLUMNS.IS_PUBLISHED]: input.isPublished,
                [NEWS_COLUMNS.PUBLISHED_AT]: input.isPublished
                    ? input.publishedAt
                    : null,
                [NEWS_COLUMNS.PUBLISHED_BY]: input.isPublished ? userId : null,
                [COMMON_COLUMNS.UPDATED_BY]: userId,
                [COMMON_COLUMNS.UPDATED_AT]: new Date(),
            })
            .where(eq(news[COMMON_COLUMNS.ID], input.id));

        return { id: input.id };
    })
    .callable();

/**
 * Delete a news article
 */
export const deleteNews = base
    .input(DeleteNewsInputSchema)
    .handler(async function ({ context: { env }, input }): Promise<void> {
        // TODO: Implement authentication check
        // if (!user) throw errors.UNAUTHORIZED();

        const db = getDB(env.DJAVACOAL_DB);

        // Get article to delete R2 objects
        const [article] = await db
            .select({
                imageKey: news[NEWS_COLUMNS.IMAGE_KEY],
                enContentKey: news[NEWS_COLUMNS.EN_CONTENT_KEY],
                arContentKey: news[NEWS_COLUMNS.AR_CONTENT_KEY],
            })
            .from(news)
            .where(eq(news[COMMON_COLUMNS.ID], input.id));

        // TODO: Implement not found error
        // if (!article) throw errors.NOT_FOUND({ message: "News article not found" });

        // Delete from R2
        const r2Client = getR2Client({
            endpoint: env.S3_API,
            accessKeyId: env.R2_ACCESS_KEY_ID,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        });

        const deletePromises = [
            deleteObject(r2Client, article.enContentKey),
            deleteObject(r2Client, article.arContentKey),
        ];

        if (article.imageKey) {
            deletePromises.push(deleteObject(r2Client, article.imageKey));
        }

        await Promise.all(deletePromises);

        // Delete from database
        await db.delete(news).where(eq(news[COMMON_COLUMNS.ID], input.id));
    })
    .callable();

/**
 * Toggle publish status of a news article
 */
export const togglePublish = base
    .input(TogglePublishInputSchema)
    .handler(async function ({ context: { env }, input }): Promise<void> {
        // TODO: Implement authentication check
        // if (!user) throw errors.UNAUTHORIZED();

        const db = getDB(env.DJAVACOAL_DB);
        const userId = "user-id-placeholder"; // TODO: Get from user context

        await db
            .update(news)
            .set({
                [NEWS_COLUMNS.IS_PUBLISHED]: input.isPublished,
                [NEWS_COLUMNS.PUBLISHED_AT]: input.isPublished
                    ? new Date()
                    : null,
                [NEWS_COLUMNS.PUBLISHED_BY]: input.isPublished ? userId : null,
                [COMMON_COLUMNS.UPDATED_BY]: userId,
                [COMMON_COLUMNS.UPDATED_AT]: new Date(),
            })
            .where(eq(news[COMMON_COLUMNS.ID], input.id));
    })
    .callable();

/**
 * Check if a slug is available
 */
export const checkSlugAvailability = base
    .input(CheckSlugAvailabilityInputSchema)
    .output(CheckSlugAvailabilityOutputSchema)
    .handler(async function ({
        context: { env },
        input,
    }): Promise<CheckSlugAvailabilityOutput> {
        const db = getDB(env.DJAVACOAL_DB);

        const whereConditions = [eq(news[NEWS_COLUMNS.SLUG], input.slug)];

        if (input.excludeId) {
            whereConditions.push(eq(news[COMMON_COLUMNS.ID], input.excludeId));
        }

        const [_existing] = await db
            .select()
            .from(news)
            .where(
                input.excludeId ? or(...whereConditions) : whereConditions[0]
            )
            .limit(1);

        return {
            available: !_existing,
        };
    })
    .callable();

/**
 * Generate presigned URL for news image upload
 */
export const generateImageUploadUrl = base
    .input(GenerateImageUploadUrlInputSchema)
    .output(GenerateImageUploadUrlOutputSchema)
    .handler(async function ({
        context: { env },
        input,
    }): Promise<GenerateImageUploadUrlOutput> {
        // TODO: Implement authentication check
        // if (!user) throw errors.UNAUTHORIZED();

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
    .handler(async function ({
        context: { env },
        input: { limit },
    }): Promise<ListTagsOutput> {
        const db = getDB(env.DJAVACOAL_DB);

        const items = await db
            .select({
                id: tags[COMMON_COLUMNS.ID],
                name: tags[TAG_COLUMNS.NAME],
                slug: tags[TAG_COLUMNS.SLUG],
                createdAt: tags[COMMON_COLUMNS.CREATED_AT],
                updatedAt: tags[COMMON_COLUMNS.UPDATED_AT],
            })
            .from(tags)
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
    .handler(async function ({ context: { env }, input }) {
        // TODO: Implement authentication check
        // if (!user) throw errors.UNAUTHORIZED();

        const db = getDB(env.DJAVACOAL_DB);

        // Generate slug from name
        const slug = input.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        // Check if slug already exists
        const [_existing] = await db
            .select()
            .from(tags)
            .where(eq(tags[TAG_COLUMNS.SLUG], slug))
            .limit(1);

        // TODO: Implement conflict error
        // if (existing) throw errors.CONFLICT({ message: "Tag already exists" });

        const [inserted] = await db
            .insert(tags)
            .values({
                name: input.name,
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
    .handler(async function ({
        context: { env },
        input,
    }): Promise<ListTagsOutput> {
        // TODO: Implement authentication check
        // if (!user) throw errors.UNAUTHORIZED();

        const db = getDB(env.DJAVACOAL_DB);

        const created = [];

        for (const name of input.names) {
            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

            // Check if exists
            const [_existing] = await db
                .select()
                .from(tags)
                .where(eq(tags[TAG_COLUMNS.SLUG], slug))
                .limit(1);

            if (!_existing) {
                const [inserted] = await db
                    .insert(tags)
                    .values({ name, slug })
                    .returning({
                        id: tags[COMMON_COLUMNS.ID],
                        name: tags[TAG_COLUMNS.NAME],
                        slug: tags[TAG_COLUMNS.SLUG],
                        createdAt: tags[COMMON_COLUMNS.CREATED_AT],
                        updatedAt: tags[COMMON_COLUMNS.UPDATED_AT],
                    });
                created.push(inserted);
            } else {
                // Map snake_case DB fields to camelCase
                created.push({
                    id: _existing.id,
                    name: _existing.name,
                    slug: _existing.slug,
                    createdAt: _existing.created_at,
                    updatedAt: _existing.updated_at,
                });
            }
        }

        return { items: created };
    })
    .callable();
