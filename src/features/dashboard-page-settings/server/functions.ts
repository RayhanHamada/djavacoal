import "server-only";

import { asc, count, eq, like } from "drizzle-orm";
import { nanoid } from "nanoid";

import { COMMON_COLUMNS, PAGE_METADATA_COLUMNS } from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { pageMetadatas } from "@/adapters/d1/schema";
import { KV_KEYS } from "@/adapters/kv/constants";
import {
    DEFAULT_BUCKET_NAME,
    DEFAULT_OG_IMAGES_PREFIX,
    deleteObject,
    generatePresignedUploadUrl,
    getR2Client,
    PAGE_METADATA_OG_PREFIX,
} from "@/adapters/r2";
import { OG_IMAGE_PLATFORM_IDS } from "@/features/dashboard-page-settings/lib/constants";
import {
    findPageMetadataById,
    isPathAvailable,
} from "@/features/dashboard-page-settings/server/helpers";
import {
    CreatePageMetadataInputSchema,
    DeleteDefaultOgImageInputSchema,
    DeletePageMetadataInputSchema,
    GenerateDefaultOgImageUploadUrlInputSchema,
    GenerateDefaultOgImageUploadUrlOutputSchema,
    GenerateOgImageUploadUrlInputSchema,
    GenerateOgImageUploadUrlOutputSchema,
    GetAllDefaultOgImagesOutputSchema,
    GetDefaultOgImageInputSchema,
    GetDefaultOgImageOutputSchema,
    GetPageMetadataByIdInputSchema,
    GetPageMetadataByIdOutputSchema,
    ListPageMetadataInputSchema,
    ListPageMetadataOutputSchema,
    SaveDefaultOgImageInputSchema,
    UpdatePageMetadataInputSchema,
} from "@/features/dashboard-page-settings/server/schemas";
import base from "@/lib/orpc/server";

/**
 * List page metadata entries with pagination and search
 */
export const listPageMetadata = base
    .input(ListPageMetadataInputSchema)
    .output(ListPageMetadataOutputSchema)
    .handler(async function ({ context: { env }, input }) {
        const db = getDB(env.DJAVACOAL_DB);
        const { search, page, limit } = input;

        // Build where clause for search
        const whereConditions = search
            ? like(pageMetadatas[PAGE_METADATA_COLUMNS.PATH], `%${search}%`)
            : undefined;

        // Fetch page metadata entries
        const items = await db
            .select({
                id: pageMetadatas[COMMON_COLUMNS.ID],
                path: pageMetadatas[PAGE_METADATA_COLUMNS.PATH],
                metadata_title:
                    pageMetadatas[PAGE_METADATA_COLUMNS.METADATA_TITLE],
                metadata_description:
                    pageMetadatas[PAGE_METADATA_COLUMNS.METADATA_DESCRIPTION],
                metadata_keywords:
                    pageMetadatas[PAGE_METADATA_COLUMNS.METADATA_KEYWORDS],
                sitemap_priority:
                    pageMetadatas[PAGE_METADATA_COLUMNS.SITEMAP_PRIORITY],
                sitemap_changefreq:
                    pageMetadatas[PAGE_METADATA_COLUMNS.SITEMAP_CHANGEFREQ],
                og_image_key: pageMetadatas[PAGE_METADATA_COLUMNS.OG_IMAGE_KEY],
                created_at: pageMetadatas[COMMON_COLUMNS.CREATED_AT],
                updated_at: pageMetadatas[COMMON_COLUMNS.UPDATED_AT],
            })
            .from(pageMetadatas)
            .where(whereConditions)
            .orderBy(asc(pageMetadatas[PAGE_METADATA_COLUMNS.PATH]))
            .limit(limit)
            .offset((page - 1) * limit);

        // Get total count
        const totalResult = await db
            .select({ count: count() })
            .from(pageMetadatas)
            .where(whereConditions);

        const total = totalResult[0]?.count ?? 0;

        return {
            items: items.map((item) => ({
                ...item,
                metadata_keywords: (item.metadata_keywords as string[]) ?? [],
                sitemap_priority: (item.sitemap_priority as number) ?? 0.5,
                sitemap_changefreq:
                    (item.sitemap_changefreq as
                        | "always"
                        | "hourly"
                        | "daily"
                        | "weekly"
                        | "monthly"
                        | "yearly"
                        | "never") ?? "weekly",
                og_image_key: (item.og_image_key as string | null) ?? null,
                created_at: new Date(item.created_at ?? 0),
                updated_at: new Date(item.updated_at ?? 0),
            })),
            total,
            page,
            pageSize: limit,
        };
    })
    .callable();

/**
 * Get a single page metadata entry by ID
 */
export const getPageMetadataById = base
    .input(GetPageMetadataByIdInputSchema)
    .output(GetPageMetadataByIdOutputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const { id } = input;

        const pageMetadata = await findPageMetadataById(db, id);

        if (!pageMetadata) {
            throw errors.NOT_FOUND({
                message: "Page metadata not found",
            });
        }

        return {
            id: pageMetadata[COMMON_COLUMNS.ID] as number,
            path: pageMetadata[PAGE_METADATA_COLUMNS.PATH] as string,
            metadata_title: pageMetadata[
                PAGE_METADATA_COLUMNS.METADATA_TITLE
            ] as string,
            metadata_description: pageMetadata[
                PAGE_METADATA_COLUMNS.METADATA_DESCRIPTION
            ] as string,
            metadata_keywords:
                (pageMetadata[
                    PAGE_METADATA_COLUMNS.METADATA_KEYWORDS
                ] as string[]) ?? [],
            sitemap_priority:
                (pageMetadata[
                    PAGE_METADATA_COLUMNS.SITEMAP_PRIORITY
                ] as number) ?? 0.5,
            sitemap_changefreq:
                (pageMetadata[PAGE_METADATA_COLUMNS.SITEMAP_CHANGEFREQ] as
                    | "always"
                    | "hourly"
                    | "daily"
                    | "weekly"
                    | "monthly"
                    | "yearly"
                    | "never") ?? "weekly",
            og_image_key:
                (pageMetadata[PAGE_METADATA_COLUMNS.OG_IMAGE_KEY] as
                    | string
                    | null) ?? null,
            created_at: new Date(pageMetadata[COMMON_COLUMNS.CREATED_AT] ?? 0),
            updated_at: new Date(pageMetadata[COMMON_COLUMNS.UPDATED_AT] ?? 0),
        };
    })
    .callable();

/**
 * Create a new page metadata entry
 */
export const createPageMetadata = base
    .input(CreatePageMetadataInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const {
            path,
            metadata_title,
            metadata_description,
            metadata_keywords,
            sitemap_priority,
            sitemap_changefreq,
            og_image_key,
        } = input;

        // Check if path already exists
        const available = await isPathAvailable(db, path);
        if (!available) {
            throw errors.BAD_REQUEST({
                message: `Path "${path}" already exists`,
            });
        }

        // Insert new page metadata
        const result = await db
            .insert(pageMetadatas)
            .values({
                [PAGE_METADATA_COLUMNS.PATH]: path,
                [PAGE_METADATA_COLUMNS.METADATA_TITLE]: metadata_title,
                [PAGE_METADATA_COLUMNS.METADATA_DESCRIPTION]:
                    metadata_description,
                [PAGE_METADATA_COLUMNS.METADATA_KEYWORDS]: metadata_keywords,
                [PAGE_METADATA_COLUMNS.SITEMAP_PRIORITY]: sitemap_priority,
                [PAGE_METADATA_COLUMNS.SITEMAP_CHANGEFREQ]: sitemap_changefreq,
                [PAGE_METADATA_COLUMNS.OG_IMAGE_KEY]: og_image_key ?? null,
            })
            .returning({
                id: pageMetadatas[COMMON_COLUMNS.ID],
            });

        return {
            success: true,
            id: result[0]?.id,
        };
    })
    .callable();

/**
 * Update an existing page metadata entry
 */
export const updatePageMetadata = base
    .input(UpdatePageMetadataInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const {
            id,
            path,
            metadata_title,
            metadata_description,
            metadata_keywords,
            sitemap_priority,
            sitemap_changefreq,
            og_image_key,
        } = input;

        // Check if page metadata exists
        const existing = await findPageMetadataById(db, id);
        if (!existing) {
            throw errors.NOT_FOUND({
                message: "Page metadata not found",
            });
        }

        // Check if new path is available (excluding current entry)
        const available = await isPathAvailable(db, path, id);
        if (!available) {
            throw errors.BAD_REQUEST({
                message: `Path "${path}" is already taken`,
            });
        }

        // Update page metadata
        await db
            .update(pageMetadatas)
            .set({
                [PAGE_METADATA_COLUMNS.PATH]: path,
                [PAGE_METADATA_COLUMNS.METADATA_TITLE]: metadata_title,
                [PAGE_METADATA_COLUMNS.METADATA_DESCRIPTION]:
                    metadata_description,
                [PAGE_METADATA_COLUMNS.METADATA_KEYWORDS]: metadata_keywords,
                [PAGE_METADATA_COLUMNS.SITEMAP_PRIORITY]: sitemap_priority,
                [PAGE_METADATA_COLUMNS.SITEMAP_CHANGEFREQ]: sitemap_changefreq,
                [PAGE_METADATA_COLUMNS.OG_IMAGE_KEY]: og_image_key ?? null,
            })
            .where(eq(pageMetadatas[COMMON_COLUMNS.ID], id));

        return {
            success: true,
        };
    })
    .callable();

/**
 * Delete a page metadata entry
 */
export const deletePageMetadata = base
    .input(DeletePageMetadataInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const { id } = input;

        // Check if page metadata exists
        const existing = await findPageMetadataById(db, id);
        if (!existing) {
            throw errors.NOT_FOUND({
                message: "Page metadata not found",
            });
        }

        // Delete page metadata
        await db
            .delete(pageMetadatas)
            .where(eq(pageMetadatas[COMMON_COLUMNS.ID], id));

        return {
            success: true,
        };
    })
    .callable();

/**
 * Generate presigned URL for uploading OG image to R2
 */
export const generateOgImageUploadUrl = base
    .input(GenerateOgImageUploadUrlInputSchema)
    .output(GenerateOgImageUploadUrlOutputSchema)
    .handler(async function ({ input, errors }) {
        const { contentType } = input;

        // Generate unique key with prefix
        const uniqueId = nanoid();
        const key = `${PAGE_METADATA_OG_PREFIX}/${uniqueId}`;

        // Validate required environment variables
        const { S3_API, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
        if (!S3_API || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "R2 storage configuration is incomplete",
            });
        }

        // Create R2 client
        const r2Client = getR2Client({
            endpoint: S3_API,
            accessKeyId: R2_ACCESS_KEY_ID,
            secretAccessKey: R2_SECRET_ACCESS_KEY,
        });

        // Generate presigned URL for PUT operation
        const uploadUrl = await generatePresignedUploadUrl(r2Client, {
            key,
            contentType,
            bucketName: DEFAULT_BUCKET_NAME,
        });

        return {
            uploadUrl,
            key,
        };
    })
    .callable();

// ============================================
// Default OG Image Functions
// ============================================

/**
 * Get KV key for a specific OG image platform
 */
function getOgImageKvKey(
    platformId: "facebook" | "linkedin" | "instagram" | "twitter"
): string {
    const kvKeyMap = {
        facebook: KV_KEYS.OG_DEFAULT_FACEBOOK,
        linkedin: KV_KEYS.OG_DEFAULT_LINKEDIN,
        instagram: KV_KEYS.OG_DEFAULT_INSTAGRAM,
        twitter: KV_KEYS.OG_DEFAULT_TWITTER,
    } as const;
    return kvKeyMap[platformId];
}

/**
 * Build public URL for default OG image
 */
function buildDefaultOgImageUrl(r2Key: string): string {
    const assetUrl = process.env.NEXT_PUBLIC_ASSET_URL || "";
    return `${assetUrl}${r2Key}`;
}

/**
 * Generate presigned URL for uploading default OG image to R2
 */
export const generateDefaultOgImageUploadUrl = base
    .input(GenerateDefaultOgImageUploadUrlInputSchema)
    .output(GenerateDefaultOgImageUploadUrlOutputSchema)
    .handler(async function ({ input, errors }) {
        const { platformId, contentType } = input;

        // Generate unique key with prefix
        const uniqueId = nanoid();
        const key = `${DEFAULT_OG_IMAGES_PREFIX}/${platformId}/${uniqueId}`;

        // Validate required environment variables
        const { S3_API, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
        if (!S3_API || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "R2 storage configuration is incomplete",
            });
        }

        // Create R2 client
        const r2Client = getR2Client({
            endpoint: S3_API,
            accessKeyId: R2_ACCESS_KEY_ID,
            secretAccessKey: R2_SECRET_ACCESS_KEY,
        });

        // Generate presigned URL for PUT operation
        const uploadUrl = await generatePresignedUploadUrl(r2Client, {
            key,
            contentType,
            bucketName: DEFAULT_BUCKET_NAME,
        });

        return {
            uploadUrl,
            key,
        };
    })
    .callable();

/**
 * Save default OG image key to KV
 */
export const saveDefaultOgImage = base
    .input(SaveDefaultOgImageInputSchema)
    .handler(async function ({ context: { env }, input }) {
        const { platformId, r2Key } = input;

        const kvKey = getOgImageKvKey(platformId);
        await env.DJAVACOAL_KV.put(kvKey, r2Key);

        return {
            success: true,
        };
    })
    .callable();

/**
 * Get default OG image for a specific platform
 */
export const getDefaultOgImage = base
    .input(GetDefaultOgImageInputSchema)
    .output(GetDefaultOgImageOutputSchema)
    .handler(async function ({ context: { env }, input }) {
        const { platformId } = input;

        const kvKey = getOgImageKvKey(platformId);
        const r2Key = await env.DJAVACOAL_KV.get(kvKey);

        return {
            r2Key: r2Key ?? null,
            url: r2Key ? buildDefaultOgImageUrl(r2Key) : null,
        };
    })
    .callable();

/**
 * Get all default OG images for all platforms
 */
export const getAllDefaultOgImages = base
    .output(GetAllDefaultOgImagesOutputSchema)
    .handler(async function ({ context: { env } }) {
        const images = await Promise.all(
            OG_IMAGE_PLATFORM_IDS.map(async (platformId) => {
                const kvKey = getOgImageKvKey(platformId);
                const r2Key = await env.DJAVACOAL_KV.get(kvKey);

                return {
                    platformId,
                    r2Key: r2Key ?? null,
                    url: r2Key ? buildDefaultOgImageUrl(r2Key) : null,
                };
            })
        );

        return { images };
    })
    .callable();

/**
 * Delete default OG image for a specific platform
 */
export const deleteDefaultOgImage = base
    .input(DeleteDefaultOgImageInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const { platformId } = input;

        const kvKey = getOgImageKvKey(platformId);
        const existingR2Key = await env.DJAVACOAL_KV.get(kvKey);

        if (!existingR2Key) {
            throw errors.NOT_FOUND({
                message: `No OG image found for ${platformId}`,
            });
        }

        // Validate required environment variables
        const { S3_API, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
        if (!S3_API || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "R2 storage configuration is incomplete",
            });
        }

        // Create R2 client
        const r2Client = getR2Client({
            endpoint: S3_API,
            accessKeyId: R2_ACCESS_KEY_ID,
            secretAccessKey: R2_SECRET_ACCESS_KEY,
        });

        // Delete from R2
        await deleteObject(r2Client, existingR2Key, DEFAULT_BUCKET_NAME);

        // Delete from KV
        await env.DJAVACOAL_KV.delete(kvKey);

        return {
            success: true,
        };
    })
    .callable();
