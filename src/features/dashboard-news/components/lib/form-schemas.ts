import { z } from "zod";

/**
 * Schema for news form data
 */
export const newsFormSchema = z.object({
    slug: z.string().min(1, "Slug is required"),
    imageKey: z.string().optional(),
    enTitle: z.string().min(1, "English title is required"),
    arTitle: z.string().min(1, "Arabic title is required"),
    enContent: z.string().min(1, "English content is required"),
    arContent: z.string().min(1, "Arabic content is required"),
    metadataTitle: z.string().min(1, "Metadata title is required"),
    metadataDescription: z
        .string()
        .min(1, "Metadata description is required")
        .max(160, "Metadata description must be 160 characters or less"),
    metadataTags: z.array(z.string()).min(1, "At least one tag is required"),
    publishedAt: z.date(),
    useAutoMetadataDescription: z.boolean(),
});

export type NewsFormValues = z.infer<typeof newsFormSchema>;

/**
 * Schema for news filters
 */
export const newsFiltersSchema = z.object({
    title: z.string(),
    tags: z.array(z.string()),
    status: z.enum(["all", "published", "unpublished"]),
    dateFrom: z.string().nullable(),
    dateTo: z.string().nullable(),
});

export type NewsFiltersValues = z.infer<typeof newsFiltersSchema>;

/**
 * Initial values for news form
 */
export const getInitialNewsFormValues = (
    initialData?: Partial<NewsFormValues>
): NewsFormValues => ({
    slug: "",
    imageKey: undefined,
    enTitle: "",
    arTitle: "",
    enContent: "",
    arContent: "",
    metadataTitle: "",
    metadataDescription: "",
    metadataTags: [],
    publishedAt: new Date(),
    useAutoMetadataDescription: true,
    ...initialData,
});
