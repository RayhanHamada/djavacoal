import "server-only";

import { asc, count, eq, like } from "drizzle-orm";

import { COMMON_COLUMNS, PAGE_METADATA_COLUMNS } from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { pageMetadatas } from "@/adapters/d1/schema";
import {
    findPageMetadataById,
    isPathAvailable,
} from "@/features/dashboard-page-settings/server/helpers";
import {
    CreatePageMetadataInputSchema,
    DeletePageMetadataInputSchema,
    GetPageMetadataByIdInputSchema,
    GetPageMetadataByIdOutputSchema,
    ListPageMetadataInputSchema,
    ListPageMetadataOutputSchema,
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
