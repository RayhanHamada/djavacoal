import "server-only";

import { z } from "zod";

/**
 * News status enum
 */
export const NewsStatusEnum = z.enum(["draft", "published", "unpublished"]);
export type NewsStatus = z.infer<typeof NewsStatusEnum>;

/**
 * Creation mode enum
 * - fresh: typical article creation with draft/publish flow, supports scheduled publishing
 * - migration: allows manual publication date setting for re-creating existing articles
 */
export const CreationModeEnum = z.enum(["fresh", "migration"]);
export type CreationMode = z.infer<typeof CreationModeEnum>;

/**
 * Schema for creating a new news article
 */
export const CreateNewsInputSchema = z
    .object({
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

        // Creation mode determines how publication date is handled
        mode: CreationModeEnum.default("fresh"),

        // Status can be draft or published (not unpublished on create)
        status: NewsStatusEnum.refine(
            (val) => val !== "unpublished",
            "Cannot create article with unpublished status"
        ).default("draft"),

        // Publication date: for fresh mode (future dates allowed for scheduling)
        // or migration mode (any past/future date)
        publishedAt: z.date().optional(),
    })
    .refine(
        (data) => {
            // If status is published, publishedAt is required
            if (data.status === "published" && !data.publishedAt) {
                return false;
            }
            return true;
        },
        {
            message: "Publication date is required when status is published",
            path: ["publishedAt"],
        }
    );

export type CreateNewsInput = z.infer<typeof CreateNewsInputSchema>;

/**
 * Schema for updating an existing news article
 */
export const UpdateNewsInputSchema = z
    .object({
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

        // Status can be updated to any state
        status: NewsStatusEnum.default("draft"),

        // Publication date is optional in update (can be cleared)
        publishedAt: z.date().optional(),
    })
    .refine(
        (data) => {
            // If status is published, publishedAt is required
            if (data.status === "published" && !data.publishedAt) {
                return false;
            }
            return true;
        },
        {
            message: "Publication date is required when status is published",
            path: ["publishedAt"],
        }
    );

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
    status: z.enum(["draft", "published", "unpublished", "all"]).default("all"),
    // Published date filters (apply when status is published or unpublished)
    // Nullable to handle cleared filters from the UI (null is coerced to undefined)
    publishedFrom: z
        .date()
        .nullable()
        .optional()
        .transform((val) => val ?? undefined),
    publishedTo: z
        .date()
        .nullable()
        .optional()
        .transform((val) => val ?? undefined),
    // Created date filters (apply when status is all or draft)
    // Nullable to handle cleared filters from the UI (null is coerced to undefined)
    createdFrom: z
        .date()
        .nullable()
        .optional()
        .transform((val) => val ?? undefined),
    createdTo: z
        .date()
        .nullable()
        .optional()
        .transform((val) => val ?? undefined),
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

    status: NewsStatusEnum,
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
 * Schema for changing article status
 * Transitions:
 * - draft -> published (publish the article)
 * - published -> unpublished (hide the article)
 * - unpublished -> published (re-publish the article)
 * - draft -> unpublished (not allowed, article must be published first)
 */
export const ChangeStatusInputSchema = z.object({
    id: z.number(),
    status: NewsStatusEnum,
});

export type ChangeStatusInput = z.infer<typeof ChangeStatusInputSchema>;

/**
 * @deprecated Use ChangeStatusInputSchema instead
 */
export const TogglePublishInputSchema = ChangeStatusInputSchema;
export type TogglePublishInput = ChangeStatusInput;

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
    limit: z.number().min(1).default(100),
    search: z.string().optional(),
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
