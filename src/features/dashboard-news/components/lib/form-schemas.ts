import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod/v4";

/**
 * Schema for news form data
 */
const NEWS_FORM_SCHEMA = z.object({
    slug: z.string().min(1, "Slug is required"),
    imageKey: z.string().optional(),
    enTitle: z.string().min(1, "Title is required"),
    arTitle: z.string().min(1, "Title is required"),
    enContent: z.string().min(160, "Content must be at least 160 characters"),
    arContent: z.string(),
    metadataTitle: z.string().min(1, "Metadata title is required"),
    metadataDescription: z
        .string()
        .min(1, "Metadata description is required")
        .max(160, "Metadata description must be 160 characters or less"),
    metadataTags: z.array(z.string()).default([]),
    publishedAt: z.date(),
    useAutoMetadataDescription: z.boolean(),
});

export type NewsFormValues = z.infer<typeof NEWS_FORM_SCHEMA>;

/**
 * Schema for news filters
 */
const NEWS_FILTER_SCHEMA = z.object({
    title: z.string(),
    tags: z.array(z.string()),
    status: z.enum(["all", "published", "unpublished"]),
    dateFrom: z.string().nullable(),
    dateTo: z.string().nullable(),
});

export type NewsFiltersValues = z.infer<typeof NEWS_FILTER_SCHEMA>;

export const validateNewsFiltersForm = zod4Resolver(NEWS_FILTER_SCHEMA);
export const validateNewsForm = zod4Resolver(NEWS_FORM_SCHEMA);
