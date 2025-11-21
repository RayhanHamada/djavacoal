import "server-only";

import { z } from "zod";

import {
    CONTENT_MIN_LENGTH,
    METADATA_DESCRIPTION_MAX_LENGTH,
    METADATA_DESCRIPTION_MIN_LENGTH,
    METADATA_TITLE_MIN_LENGTH,
    MAX_FILE_SIZE,
    MAX_PAGE_SIZE,
    SLUG_ERROR_MESSAGE,
    SLUG_MIN_LENGTH,
    SLUG_PATTERN,
    STATUS_TRANSITION_ERRORS,
    TAG_NAME_MIN_LENGTH,
    TITLE_MIN_LENGTH,
    CREATION_MODE,
    NEWS_STATUS_FILTER_VALUES,
} from "./constants";
import { NEWS_STATUS } from "@/adapters/d1/constants";

/**
 * News status enum
 */
export const NewsStatusEnum = z.enum([
    NEWS_STATUS.DRAFT,
    NEWS_STATUS.PUBLISHED,
    NEWS_STATUS.UNPUBLISHED,
]);
export type NewsStatus = z.infer<typeof NewsStatusEnum>;

/**
 * Creation mode enum
 * - fresh: typical article creation with draft/publish flow, supports scheduled publishing
 * - migration: allows manual publication date setting for re-creating existing articles
 */
export const CreationModeEnum = z.enum([
    CREATION_MODE.FRESH,
    CREATION_MODE.MIGRATION,
]);
export type CreationMode = z.infer<typeof CreationModeEnum>;

export const NewsStatusFilterEnum = z.enum([
    NEWS_STATUS_FILTER_VALUES.DRAFT,
    NEWS_STATUS_FILTER_VALUES.PUBLISHED,
    NEWS_STATUS_FILTER_VALUES.UNPUBLISHED,
    NEWS_STATUS_FILTER_VALUES.ALL,
]);

/**
 * Schema for creating a new news article
 */
export const CreateNewsInputSchema = z
    .object({
        slug: z
            .string()
            .min(SLUG_MIN_LENGTH, "Slug is required")
            .regex(SLUG_PATTERN, SLUG_ERROR_MESSAGE),
        imageKey: z.string().optional(),

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

        enTitle: z.string().min(TITLE_MIN_LENGTH, "English title is required"),
        enContent: z
            .string()
            .min(CONTENT_MIN_LENGTH, "English content is required"),

        arTitle: z.string().min(TITLE_MIN_LENGTH, "Arabic title is required"),
        arContent: z
            .string()
            .min(CONTENT_MIN_LENGTH, "Arabic content is required"),

        // Creation mode determines how publication date is handled
        mode: CreationModeEnum.default(CREATION_MODE.FRESH),

        // Status can be draft or published (not unpublished on create)
        status: NewsStatusEnum.refine(
            (val) => val !== NEWS_STATUS.UNPUBLISHED,
            STATUS_TRANSITION_ERRORS.UNPUBLISHED_ON_CREATE
        ).default(NEWS_STATUS.DRAFT),

        // Publication date: for fresh mode (future dates allowed for scheduling)
        // or migration mode (any past/future date)
        publishedAt: z.date().optional(),
    })
    .refine(
        (data) => {
            // If status is published, publishedAt is required
            if (data.status === NEWS_STATUS.PUBLISHED && !data.publishedAt) {
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
            .min(
                METADATA_DESCRIPTION_MIN_LENGTH,
                "Metadata description is required"
            )
            .max(
                METADATA_DESCRIPTION_MAX_LENGTH,
                "Metadata description must be 160 characters or less"
            ),
        metadataTags: z.array(z.string()).default([]),

        enTitle: z.string().min(TITLE_MIN_LENGTH, "English title is required"),
        enContent: z
            .string()
            .min(CONTENT_MIN_LENGTH, "English content is required"),

        arTitle: z.string().min(TITLE_MIN_LENGTH, "Arabic title is required"),
        arContent: z
            .string()
            .min(CONTENT_MIN_LENGTH, "Arabic content is required"),

        // Status can be updated to any state
        status: NewsStatusEnum.default("draft"),

        // Publication date is optional in update (can be cleared)
        publishedAt: z.date().optional(),
    })
    .refine(
        (data) => {
            // If status is published, publishedAt is required
            if (data.status === NEWS_STATUS.PUBLISHED && !data.publishedAt) {
                return false;
            }
            return true;
        },
        {
            message: STATUS_TRANSITION_ERRORS.PUBLISHED_REQUIRES_DATE,
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
    limit: z.number().min(1).max(MAX_PAGE_SIZE).default(20),

    // Filters
    titleSearch: z.string().optional(),
    tags: z.array(z.string()).default([]),
    status: NewsStatusFilterEnum.default(NEWS_STATUS_FILTER_VALUES.ALL),
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
    slug: z.string().min(SLUG_MIN_LENGTH),
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
    fileSize: z.number().max(MAX_FILE_SIZE, "File size must be less than 10MB"),
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
    name: z.string().min(TAG_NAME_MIN_LENGTH, "Tag name is required"),
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
    limit: z.number().min(1).default(MAX_PAGE_SIZE),
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
    names: z.array(z.string().min(TAG_NAME_MIN_LENGTH)),
});

export type BulkCreateTagsInput = z.infer<typeof BulkCreateTagsInputSchema>;

/**
 * Schema for removing news article image
 */
export const RemoveNewsImageInputSchema = z.object({
    id: z.number(),
});

export type RemoveNewsImageInput = z.infer<typeof RemoveNewsImageInputSchema>;
