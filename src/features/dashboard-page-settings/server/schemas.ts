import z from "zod/v4";

import {
    DEFAULT_PAGE_SIZE,
    MAX_KEYWORDS,
    MAX_PAGE_SIZE,
    METADATA_DESCRIPTION_MAX_LENGTH,
    METADATA_DESCRIPTION_MIN_LENGTH,
    METADATA_KEYWORD_MAX_LENGTH,
    METADATA_KEYWORD_MIN_LENGTH,
    METADATA_TITLE_MAX_LENGTH,
    METADATA_TITLE_MIN_LENGTH,
    PATH_MAX_LENGTH,
    PATH_MIN_LENGTH,
} from "./constants";

/**
 * Input schema for listing page metadata with pagination and search
 */
export const ListPageMetadataInputSchema = z.object({
    /** Search query for page paths */
    search: z.string().trim().max(100).optional(),
    /** Page number (1-indexed) */
    page: z.number().int().min(1).default(1),
    /** Number of items per page */
    limit: z
        .number()
        .int()
        .min(1)
        .max(MAX_PAGE_SIZE)
        .default(DEFAULT_PAGE_SIZE),
});

/**
 * Output schema for list page metadata response
 */
export const ListPageMetadataOutputSchema = z.object({
    items: z.array(
        z.object({
            id: z.number(),
            path: z.string(),
            metadata_title: z.string(),
            metadata_description: z.string(),
            metadata_keywords: z.array(z.string()),
            created_at: z.date(),
            updated_at: z.date(),
        })
    ),
    total: z.number().int(),
    page: z.number().int(),
    pageSize: z.number().int(),
});

/**
 * Input schema for getting a single page metadata by ID
 */
export const GetPageMetadataByIdInputSchema = z.object({
    id: z.number().int().positive(),
});

/**
 * Output schema for get page metadata by ID
 */
export const GetPageMetadataByIdOutputSchema = z.object({
    id: z.number(),
    path: z.string(),
    metadata_title: z.string(),
    metadata_description: z.string(),
    metadata_keywords: z.array(z.string()),
    created_at: z.date(),
    updated_at: z.date(),
});

/**
 * Input schema for creating a page metadata entry
 */
export const CreatePageMetadataInputSchema = z.object({
    path: z
        .string()
        .trim()
        .min(PATH_MIN_LENGTH, "Path is required")
        .max(
            PATH_MAX_LENGTH,
            `Path must be at most ${PATH_MAX_LENGTH} characters`
        )
        .regex(/^\//, "Path must start with /"),
    metadata_title: z
        .string()
        .trim()
        .min(METADATA_TITLE_MIN_LENGTH, "Metadata title is required")
        .max(
            METADATA_TITLE_MAX_LENGTH,
            `Metadata title must be at most ${METADATA_TITLE_MAX_LENGTH} characters`
        ),
    metadata_description: z
        .string()
        .trim()
        .min(
            METADATA_DESCRIPTION_MIN_LENGTH,
            "Metadata description is required"
        )
        .max(
            METADATA_DESCRIPTION_MAX_LENGTH,
            `Metadata description must be at most ${METADATA_DESCRIPTION_MAX_LENGTH} characters`
        ),
    metadata_keywords: z
        .array(
            z
                .string()
                .trim()
                .min(METADATA_KEYWORD_MIN_LENGTH)
                .max(METADATA_KEYWORD_MAX_LENGTH)
        )
        .max(MAX_KEYWORDS, `Maximum ${MAX_KEYWORDS} keywords allowed`)
        .default([]),
});

/**
 * Input schema for updating a page metadata entry
 */
export const UpdatePageMetadataInputSchema = z.object({
    id: z.number().int().positive(),
    path: z
        .string()
        .trim()
        .min(PATH_MIN_LENGTH, "Path is required")
        .max(
            PATH_MAX_LENGTH,
            `Path must be at most ${PATH_MAX_LENGTH} characters`
        )
        .regex(/^\//, "Path must start with /"),
    metadata_title: z
        .string()
        .trim()
        .min(METADATA_TITLE_MIN_LENGTH, "Metadata title is required")
        .max(
            METADATA_TITLE_MAX_LENGTH,
            `Metadata title must be at most ${METADATA_TITLE_MAX_LENGTH} characters`
        ),
    metadata_description: z
        .string()
        .trim()
        .min(
            METADATA_DESCRIPTION_MIN_LENGTH,
            "Metadata description is required"
        )
        .max(
            METADATA_DESCRIPTION_MAX_LENGTH,
            `Metadata description must be at most ${METADATA_DESCRIPTION_MAX_LENGTH} characters`
        ),
    metadata_keywords: z
        .array(
            z
                .string()
                .trim()
                .min(METADATA_KEYWORD_MIN_LENGTH)
                .max(METADATA_KEYWORD_MAX_LENGTH)
        )
        .max(MAX_KEYWORDS, `Maximum ${MAX_KEYWORDS} keywords allowed`)
        .default([]),
});

/**
 * Input schema for deleting a page metadata entry
 */
export const DeletePageMetadataInputSchema = z.object({
    id: z.number().int().positive(),
});
