import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod/v4";

import {
    CREATION_MODE,
    FORM_CONTENT_MIN_LENGTH,
    METADATA_DESCRIPTION_MAX_LENGTH,
    METADATA_DESCRIPTION_MIN_LENGTH,
    METADATA_TITLE_MIN_LENGTH,
    NEWS_STATUS_FILTER_VALUES,
    SLUG_MIN_LENGTH,
    TITLE_MIN_LENGTH,
} from "./constants";
import { NEWS_STATUS } from "@/adapters/d1/constants";

/**
 * Creation mode enum
 * - fresh: typical article creation with draft/publish flow
 * - migration: allows manual publication date setting for re-creating existing articles
 */
export const CreationModeEnum = z.enum([
    CREATION_MODE.FRESH,
    CREATION_MODE.MIGRATION,
]);
export type CreationMode = z.infer<typeof CreationModeEnum>;

/**
 * News status enum
 */
export const NewsStatusEnum = z.enum([
    NEWS_STATUS_FILTER_VALUES.DRAFT,
    NEWS_STATUS_FILTER_VALUES.PUBLISHED,
    NEWS_STATUS_FILTER_VALUES.UNPUBLISHED,
]);
export type NewsStatus = z.infer<typeof NewsStatusEnum>;

export const NewsStatusFilterEnum = z.enum([
    NEWS_STATUS_FILTER_VALUES.ALL,
    NEWS_STATUS_FILTER_VALUES.DRAFT,
    NEWS_STATUS_FILTER_VALUES.PUBLISHED,
    NEWS_STATUS_FILTER_VALUES.UNPUBLISHED,
]);
export type NewsStatusFilter = z.infer<typeof NewsStatusFilterEnum>;

/**
 * Schema for news form data
 */
const NEWS_FORM_SCHEMA = z.object({
    slug: z.string().min(SLUG_MIN_LENGTH, "Slug is required"),
    imageKey: z.string().optional(),
    enTitle: z.string().min(TITLE_MIN_LENGTH, "Title is required"),
    arTitle: z.string().min(TITLE_MIN_LENGTH, "Title is required"),
    enContent: z
        .string()
        .min(
            FORM_CONTENT_MIN_LENGTH,
            "Content must be at least 160 characters"
        ),
    arContent: z.string(),
    metadataTitle: z
        .string()
        .min(METADATA_TITLE_MIN_LENGTH, "Metadata title is required"),
    metadataDescription: z
        .string()
        .min(
            METADATA_DESCRIPTION_MIN_LENGTH,
            "Metadata description is required"
        )
        .max(
            METADATA_DESCRIPTION_MAX_LENGTH,
            "Metadata description must be 160 characters or less"
        ),
    metadataTags: z.array(z.string()).default([]),

    // Creation mode: fresh or migration
    mode: CreationModeEnum.default(CREATION_MODE.FRESH),

    // Status: draft, published, or unpublished
    status: NewsStatusEnum.default(NEWS_STATUS.DRAFT),

    // Publication date (optional, required only when publishing)
    publishedAt: z.date().optional(),

    useAutoMetadataDescription: z.boolean(),
});

export type NewsFormValues = z.infer<typeof NEWS_FORM_SCHEMA>;

/**
 * Schema for news filters
 */
const NEWS_FILTER_SCHEMA = z.object({
    title: z.string(),
    tags: z.array(z.string()),
    status: NewsStatusFilterEnum,
    dateFrom: z.string().nullable(),
    dateTo: z.string().nullable(),
});

export type NewsFiltersValues = z.infer<typeof NEWS_FILTER_SCHEMA>;

export const validateNewsFiltersForm = zod4Resolver(NEWS_FILTER_SCHEMA);
export const validateNewsForm = zod4Resolver(NEWS_FORM_SCHEMA);
