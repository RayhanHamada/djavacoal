import "server-only";

import { z } from "zod";

/**
 * Schema for creating a new news article
 */
export const CreateNewsInputSchema = z.object({
    slug: z
        .string()
        .min(1, "Slug is required")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must be kebab-case (lowercase letters, numbers, and hyphens only)"
        ),
    imageKey: z.string().optional(),

    metadataTitle: z.string().min(1, "Metadata title is required"),
    metadataDescription: z
        .string()
        .min(1, "Metadata description is required")
        .max(160, "Metadata description must be 160 characters or less"),
    metadataTags: z.array(z.string()).default([]),

    enTitle: z.string().min(1, "English title is required"),
    enContent: z.string().min(1, "English content is required"),

    arTitle: z.string().min(1, "Arabic title is required"),
    arContent: z.string().min(1, "Arabic content is required"),

    publishedAt: z.date(),
    isPublished: z.boolean().default(false),
});

export type CreateNewsInput = z.infer<typeof CreateNewsInputSchema>;

/**
 * Schema for updating an existing news article
 */
export const UpdateNewsInputSchema = z.object({
    id: z.number(),
    imageKey: z.string().optional(),

    metadataDescription: z
        .string()
        .min(1, "Metadata description is required")
        .max(160, "Metadata description must be 160 characters or less"),
    metadataTags: z.array(z.string()).default([]),

    enTitle: z.string().min(1, "English title is required"),
    enContent: z.string().min(1, "English content is required"),

    arTitle: z.string().min(1, "Arabic title is required"),
    arContent: z.string().min(1, "Arabic content is required"),

    publishedAt: z.date(),
    isPublished: z.boolean().default(false),
});

export type UpdateNewsInput = z.infer<typeof UpdateNewsInputSchema>;

/**
 * Output schema for updating a news article
 */
export const UpdateNewsOutputSchema = z.object({
    id: z.number(),
});

export type UpdateNewsOutput = z.infer<typeof UpdateNewsOutputSchema>;

/**
 * Schema for listing news with pagination and filters
 */
export const ListNewsInputSchema = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),

    // Filters
    titleSearch: z.string().optional(),
    tags: z.array(z.string()).default([]),
    status: z.enum(["published", "unpublished", "all"]).default("all"),
    dateFrom: z.date().optional(),
    dateTo: z.date().optional(),
});

export type ListNewsInput = z.infer<typeof ListNewsInputSchema>;

/**
 * Output schema for a single news article
 */
export const NewsArticleSchema = z.object({
    id: z.number(),
    slug: z.string(),
    imageKey: z.string().nullable(),

    metadataTitle: z.string(),
    metadataDescription: z.string(),
    metadataTags: z.array(z.string()),

    enTitle: z.string(),
    arTitle: z.string(),

    isPublished: z.boolean(),
    publishedAt: z.date().nullable(),
    publishedBy: z.string().nullable(),

    createdAt: z.date(),
    createdBy: z.string(),
    updatedAt: z.date(),
    updatedBy: z.string(),
});

export type NewsArticle = z.infer<typeof NewsArticleSchema>;

/**
 * Output schema for listing news
 */
export const ListNewsOutputSchema = z.object({
    items: z.array(NewsArticleSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
});

export type ListNewsOutput = z.infer<typeof ListNewsOutputSchema>;

/**
 * Schema for getting a single news article by ID
 */
export const GetNewsByIdInputSchema = z.object({
    id: z.number(),
});

export type GetNewsByIdInput = z.infer<typeof GetNewsByIdInputSchema>;

/**
 * Output schema for getting a single news article with content
 */
export const NewsArticleWithContentSchema = NewsArticleSchema.extend({
    enContent: z.string(),
    arContent: z.string(),
});

export type NewsArticleWithContent = z.infer<
    typeof NewsArticleWithContentSchema
>;

/**
 * Schema for deleting a news article
 */
export const DeleteNewsInputSchema = z.object({
    id: z.number(),
});

export type DeleteNewsInput = z.infer<typeof DeleteNewsInputSchema>;

/**
 * Schema for toggling publish status
 */
export const TogglePublishInputSchema = z.object({
    id: z.number(),
    isPublished: z.boolean(),
});

export type TogglePublishInput = z.infer<typeof TogglePublishInputSchema>;

/**
 * Schema for checking slug availability
 */
export const CheckSlugAvailabilityInputSchema = z.object({
    slug: z.string().min(1),
    excludeId: z.number().optional(),
});

export type CheckSlugAvailabilityInput = z.infer<
    typeof CheckSlugAvailabilityInputSchema
>;

export const CheckSlugAvailabilityOutputSchema = z.object({
    available: z.boolean(),
});

export type CheckSlugAvailabilityOutput = z.infer<
    typeof CheckSlugAvailabilityOutputSchema
>;

/**
 * Schema for generating presigned URL for news image upload
 */
export const GenerateImageUploadUrlInputSchema = z.object({
    fileName: z.string(),
    contentType: z.string().regex(/^image\/(jpeg|png|gif|webp|svg\+xml)$/),
    fileSize: z
        .number()
        .max(10 * 1024 * 1024, "File size must be less than 10MB"),
});

export type GenerateImageUploadUrlInput = z.infer<
    typeof GenerateImageUploadUrlInputSchema
>;

export const GenerateImageUploadUrlOutputSchema = z.object({
    uploadUrl: z.string(),
    key: z.string(),
});

export type GenerateImageUploadUrlOutput = z.infer<
    typeof GenerateImageUploadUrlOutputSchema
>;

/**
 * Tag schemas
 */
export const CreateTagInputSchema = z.object({
    name: z.string().min(1, "Tag name is required"),
});

export type CreateTagInput = z.infer<typeof CreateTagInputSchema>;

export const TagSchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
});

export type Tag = z.infer<typeof TagSchema>;

export const ListTagsInputSchema = z.object({
    limit: z.number().min(1).max(100).default(10),
});

export type ListTagsInput = z.infer<typeof ListTagsInputSchema>;

export const ListTagsOutputSchema = z.object({
    items: z.array(TagSchema),
});

export type ListTagsOutput = z.infer<typeof ListTagsOutputSchema>;

/**
 * Schema for bulk creating tags
 */
export const BulkCreateTagsInputSchema = z.object({
    names: z.array(z.string().min(1)),
});

export type BulkCreateTagsInput = z.infer<typeof BulkCreateTagsInputSchema>;
