import z from "zod/v4";

/**
 * Public API Schemas
 * These schemas define the input/output for public API endpoints
 */

// ============================================
// Product Schemas
// ============================================

/**
 * Schema for product list item (id and name only)
 */
export const PRODUCT_NAME_ITEM_SCHEMA = z.object({
    id: z.number().int().describe("Product ID"),
    name: z.string().describe("Product name"),
});

export type ProductNameItemSchemaType = z.infer<
    typeof PRODUCT_NAME_ITEM_SCHEMA
>;

/**
 * Output schema for listing all products
 */
export const LIST_PUBLIC_PRODUCT_OUTPUT_SCHEMA = z.object({
    products: z
        .array(PRODUCT_NAME_ITEM_SCHEMA)
        .describe("List of products with ID and names only"),
    total: z.number().int().describe("Total number of products"),
});

export type ListPublicProductOutputSchemaType = z.infer<
    typeof LIST_PUBLIC_PRODUCT_OUTPUT_SCHEMA
>;

/**
 * Input schema for getting product by ID
 */
export const GET_PUBLIC_PRODUCT_BY_ID_INPUT_SCHEMA = z.object({
    id: z.number().int().positive().describe("Product ID"),
});

export type GetPublicProductByIdInputSchemaType = z.infer<
    typeof GET_PUBLIC_PRODUCT_BY_ID_INPUT_SCHEMA
>;

/**
 * Schema for product media item
 */
export const PUBLIC_PRODUCT_MEDIA_SCHEMA = z
    .object({
        id: z.number().int(),
        order_index: z.number().int(),
    })
    .and(
        z.discriminatedUnion("media_type", [
            z.object({
                media_type: z.literal("image"),
                image_key: z.string().describe("Image key in R2 storage"),
            }),
            z.object({
                media_type: z.literal("youtube"),
                youtube_video_id: z.string().describe("YouTube video ID"),
                video_custom_thumbnail_key: z
                    .string()
                    .optional()
                    .describe("Custom thumbnail key in R2 storage"),
            }),
        ])
    );

export type PublicProductMediaSchemaType = z.infer<
    typeof PUBLIC_PRODUCT_MEDIA_SCHEMA
>;

/**
 * Schema for product specification
 */
export const PUBLIC_PRODUCT_SPECIFICATION_SCHEMA = z.object({
    id: z.number().int(),
    spec_photo_key: z.string().describe("Specification photo key in R2"),
    order_index: z.number().int(),
});

export type PublicProductSpecificationSchemaType = z.infer<
    typeof PUBLIC_PRODUCT_SPECIFICATION_SCHEMA
>;

/**
 * Schema for product variant
 */
export const PUBLIC_PRODUCT_VARIANT_SCHEMA = z.object({
    id: z.number().int(),
    variant_name: z.string().describe("Variant name"),
    variant_photo_key: z.string().describe("Variant photo key in R2"),
    variant_sizes: z.array(z.string()).describe("Available sizes for variant"),
    order_index: z.number().int(),
});

export type PublicProductVariantSchemaType = z.infer<
    typeof PUBLIC_PRODUCT_VARIANT_SCHEMA
>;

/**
 * Schema for packaging option
 */
export const PUBLIC_PACKAGING_OPTION_SCHEMA = z.object({
    id: z.number().int(),
    name: z.string().describe("Packaging option name"),
    description: z.string().describe("Packaging option description"),
    photo_key: z.string().describe("Packaging option photo key in R2"),
});

export type PublicPackagingOptionSchemaType = z.infer<
    typeof PUBLIC_PACKAGING_OPTION_SCHEMA
>;

/**
 * Output schema for product detail
 */
export const PRODUCT_DETAIL_OUTPUT_SCHEMA = z.object({
    id: z.number().int(),
    name: z.string().describe("Product name"),
    description: z.string().describe("Product description"),
    moq: z.string().describe("Minimum Order Quantity"),
    production_capacity: z.string().describe("Production capacity"),
    medias: z
        .array(PUBLIC_PRODUCT_MEDIA_SCHEMA)
        .describe("Product media items"),
    specifications: z
        .array(PUBLIC_PRODUCT_SPECIFICATION_SCHEMA)
        .describe("Product specifications"),
    variants: z
        .array(PUBLIC_PRODUCT_VARIANT_SCHEMA)
        .describe("Product variants"),
    packaging_options: z
        .array(PUBLIC_PACKAGING_OPTION_SCHEMA)
        .describe("Available packaging options"),
    created_at: z.date().describe("Creation timestamp"),
    updated_at: z.date().describe("Last update timestamp"),
});

export type PublicProductDetailSchemaType = z.infer<
    typeof PRODUCT_DETAIL_OUTPUT_SCHEMA
>;

// ============================================
// News Schemas
// ============================================

/**
 * Input schema for listing news with pagination and sorting
 */
export const LIST_PUBLIC_NEWS_INPUT_SCHEMA = z.object({
    page: z
        .number()
        .int()
        .min(1)
        .default(1)
        .describe("Page number (1-indexed)"),
    limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(20)
        .describe("Number of items per page"),
    sort: z
        .enum(["newest", "oldest"])
        .default("newest")
        .describe("Sort by publication date"),
});

export type ListPublicNewsInputSchemaType = z.infer<
    typeof LIST_PUBLIC_NEWS_INPUT_SCHEMA
>;

/**
 * Schema for news list item (without content)
 */
export const PUBLIC_NEWS_LIST_ITEM_SCHEMA = z.object({
    id: z.number().int().describe("News article ID"),
    slug: z.string().describe("URL-friendly slug"),
    image_key: z.string().nullable().describe("Image key in R2 storage"),
    metadata_title: z.string().describe("SEO metadata title"),
    metadata_description: z.string().describe("SEO metadata description"),
    metadata_tags: z.array(z.string()).describe("SEO metadata tags"),
    title: z.string().describe("Article title"),
    published_at: z.date().describe("Publication timestamp"),
    published_by: z.string().nullable().describe("User ID who published"),
});

export type PublicNewsListItemSchemaType = z.infer<
    typeof PUBLIC_NEWS_LIST_ITEM_SCHEMA
>;

/**
 * Output schema for listing news
 */
export const LIST_PUBLIC_NEWS_OUTPUT_SCHEMA = z.object({
    items: z
        .array(PUBLIC_NEWS_LIST_ITEM_SCHEMA)
        .describe("List of news articles"),
    total: z.number().int().describe("Total number of published articles"),
    page: z.number().int().describe("Current page number"),
    limit: z.number().int().describe("Items per page"),
    total_pages: z.number().int().describe("Total number of pages"),
});

export type ListPublicNewsOutputSchemaType = z.infer<
    typeof LIST_PUBLIC_NEWS_OUTPUT_SCHEMA
>;

/**
 * Input schema for getting news by ID
 */
export const GET_PUBLIC_NEWS_BY_ID_INPUT_SCHEMA = z.object({
    id: z.number().int().positive().describe("News article ID"),
});

export type GetPublicNewsByIdInputSchemaType = z.infer<
    typeof GET_PUBLIC_NEWS_BY_ID_INPUT_SCHEMA
>;

/**
 * Output schema for news detail (with content)
 */
export const PUBLIC_NEWS_DETAIL_SCHEMA = z.object({
    id: z.number().int().describe("News article ID"),
    slug: z.string().describe("URL-friendly slug"),
    image_key: z.string().nullable().describe("Image key in R2 storage"),
    metadata_title: z.string().describe("SEO metadata title"),
    metadata_description: z.string().describe("SEO metadata description"),
    metadata_tags: z.array(z.string()).describe("SEO metadata tags"),
    title: z.string().describe("Article title"),
    content: z.string().describe("Full article content (HTML)"),
    published_at: z.date().describe("Publication timestamp"),
    published_by: z.string().nullable().describe("User ID who published"),
    created_at: z.date().describe("Creation timestamp"),
    updated_at: z.date().describe("Last update timestamp"),
});

export type PublicNewsDetailSchemaType = z.infer<
    typeof PUBLIC_NEWS_DETAIL_SCHEMA
>;
