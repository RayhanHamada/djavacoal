import z from "zod/v4";

import {
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    PACKAGING_DESCRIPTION_MAX_LENGTH,
    PACKAGING_DESCRIPTION_MIN_LENGTH,
    PACKAGING_NAME_MAX_LENGTH,
    PACKAGING_NAME_MIN_LENGTH,
} from "./constants";
import { MAX_FILE_SIZE } from "@/adapters/r2/constants";
import {
    IMAGE_MIME_REGEX,
    MEDIA_TYPE_ENUM,
    PRODUCT_DESCRIPTION_MAX_LENGTH,
    PRODUCT_FIELD_ERRORS,
    PRODUCT_NAME_MIN_LENGTH,
    PRODUCT_UPLOAD_TYPES,
    SEARCH_MAX_LENGTH,
} from "@/features/dashboard-product/utils";

/**
 * Input schema for listing packaging options with pagination and search
 */
export const ListPackagingOptionsInputSchema = z.object({
    /** Search query for packaging option names (searches English name) */
    search: z.string().trim().max(SEARCH_MAX_LENGTH).optional(),
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
 * Output schema for list packaging options response
 */
export const ListPackagingOptionsOutputSchema = z.object({
    packagingOptions: z.array(
        z.object({
            id: z.number(),
            en_name: z.string(),
            ar_name: z.string(),
            en_description: z.string(),
            ar_description: z.string(),
            photo_key: z.string(),
            created_at: z.date(),
            updated_at: z.date(),
        })
    ),
    total: z.number().int(),
    page: z.number().int(),
    pageSize: z.number().int(),
});

/**
 * Input schema for getting a single packaging option by ID
 */
export const GetPackagingOptionByIdInputSchema = z.object({
    id: z.number().int().positive(),
});

/**
 * Output schema for get packaging option by ID
 */
export const GetPackagingOptionByIdOutputSchema = z.object({
    id: z.number(),
    en_name: z.string(),
    ar_name: z.string(),
    en_description: z.string(),
    ar_description: z.string(),
    photo_key: z.string(),
    created_at: z.date(),
    updated_at: z.date(),
    created_by: z.string(),
    updated_by: z.string(),
});

/**
 * Input schema for creating a packaging option
 */
export const CreatePackagingOptionInputSchema = z.object({
    en_name: z
        .string()
        .trim()
        .min(PACKAGING_NAME_MIN_LENGTH)
        .max(PACKAGING_NAME_MAX_LENGTH),
    ar_name: z
        .string()
        .trim()
        .min(PACKAGING_NAME_MIN_LENGTH)
        .max(PACKAGING_NAME_MAX_LENGTH),
    en_description: z
        .string()
        .trim()
        .min(PACKAGING_DESCRIPTION_MIN_LENGTH)
        .max(PACKAGING_DESCRIPTION_MAX_LENGTH),
    ar_description: z
        .string()
        .trim()
        .min(PACKAGING_DESCRIPTION_MIN_LENGTH)
        .max(PACKAGING_DESCRIPTION_MAX_LENGTH),
    photo_key: z.string(),
});

/**
 * Output schema for create packaging option
 */
export const CreatePackagingOptionOutputSchema = z.object({
    id: z.number(),
});

/**
 * Input schema for updating a packaging option
 */
export const UpdatePackagingOptionInputSchema = z.object({
    id: z.number().int().positive(),
    en_name: z
        .string()
        .trim()
        .min(PACKAGING_NAME_MIN_LENGTH)
        .max(PACKAGING_NAME_MAX_LENGTH),
    ar_name: z
        .string()
        .trim()
        .min(PACKAGING_NAME_MIN_LENGTH)
        .max(PACKAGING_NAME_MAX_LENGTH),
    en_description: z
        .string()
        .trim()
        .min(PACKAGING_DESCRIPTION_MIN_LENGTH)
        .max(PACKAGING_DESCRIPTION_MAX_LENGTH),
    ar_description: z
        .string()
        .trim()
        .min(PACKAGING_DESCRIPTION_MIN_LENGTH)
        .max(PACKAGING_DESCRIPTION_MAX_LENGTH),
    photo_key: z.string(),
});

/**
 * Input schema for deleting a packaging option
 */
export const DeletePackagingOptionInputSchema = z.object({
    id: z.number().int().positive(),
});

/**
 * Input schema for generating presigned URL for image upload
 */
export const GenerateImageUploadUrlInputSchema = z.object({
    /** MIME type of the image */
    mimeType: z.string().regex(IMAGE_MIME_REGEX),
    /** File size in bytes */
    size: z.number().int().min(1).max(MAX_FILE_SIZE),
});

/**
 * Output schema for presigned URL response
 */
export const GenerateImageUploadUrlOutputSchema = z.object({
    /** Presigned URL for uploading */
    uploadUrl: z.url(),
    /** Object key in R2 */
    key: z.string(),
});

/**
 * Product-related schemas
 */

/**
 * Schema for product media items
 */
export const ProductMediaItemSchema = z
    .object({
        id: z.number().optional(),
        order_index: z.number(),
    })
    .and(
        z.discriminatedUnion("media_type", [
            z.object({
                media_type: z.literal(MEDIA_TYPE_ENUM.IMAGE),
                image_key: z.string(),
            }),
            z.object({
                media_type: z.literal(MEDIA_TYPE_ENUM.YOUTUBE),
                youtube_video_id: z.string(),
                video_custom_thumbnail_key: z.string().optional(),
            }),
        ])
    );

export type ProductMediaItem = z.infer<typeof ProductMediaItemSchema>;

/**
 * Schema for product specification items
 */
export const ProductSpecificationItemSchema = z.object({
    id: z.number().optional(),
    spec_photo_key: z.string(),
    order_index: z.number(),
});

export type ProductSpecificationItem = z.infer<
    typeof ProductSpecificationItemSchema
>;

/**
 * Schema for product variant items
 */
export const ProductVariantItemSchema = z.object({
    id: z.number().optional(),
    en_variant_name: z
        .string()
        .min(
            PRODUCT_NAME_MIN_LENGTH,
            PRODUCT_FIELD_ERRORS.EN_VARIANT_NAME_REQUIRED
        ),
    ar_variant_name: z
        .string()
        .min(
            PRODUCT_NAME_MIN_LENGTH,
            PRODUCT_FIELD_ERRORS.AR_VARIANT_NAME_REQUIRED
        ),
    variant_photo_key: z.string(),
    variant_sizes: z.array(z.string()).default([]),
    order_index: z.number(),
});

export type ProductVariantItem = z.infer<typeof ProductVariantItemSchema>;

/**
 * Schema for creating a product
 */
export const CreateProductInputSchema = z.object({
    en_name: z
        .string()
        .min(PRODUCT_NAME_MIN_LENGTH, PRODUCT_FIELD_ERRORS.EN_NAME_REQUIRED),
    ar_name: z
        .string()
        .min(PRODUCT_NAME_MIN_LENGTH, PRODUCT_FIELD_ERRORS.AR_NAME_REQUIRED),
    en_description: z
        .string()
        .min(
            PRODUCT_NAME_MIN_LENGTH,
            PRODUCT_FIELD_ERRORS.EN_DESCRIPTION_REQUIRED
        )
        .max(
            PRODUCT_DESCRIPTION_MAX_LENGTH,
            PRODUCT_FIELD_ERRORS.EN_DESCRIPTION_MAX
        ),
    ar_description: z
        .string()
        .min(
            PRODUCT_NAME_MIN_LENGTH,
            PRODUCT_FIELD_ERRORS.AR_DESCRIPTION_REQUIRED
        )
        .max(
            PRODUCT_DESCRIPTION_MAX_LENGTH,
            PRODUCT_FIELD_ERRORS.AR_DESCRIPTION_MAX
        ),
    medias: z.array(ProductMediaItemSchema).default([]),
    specifications: z.array(ProductSpecificationItemSchema).default([]),
    variants: z.array(ProductVariantItemSchema).default([]),
    moq: z
        .string()
        .min(PRODUCT_NAME_MIN_LENGTH, PRODUCT_FIELD_ERRORS.MOQ_REQUIRED),
    production_capacity: z
        .string()
        .min(
            PRODUCT_NAME_MIN_LENGTH,
            PRODUCT_FIELD_ERRORS.PRODUCTION_CAPACITY_REQUIRED
        ),
    packaging_option_ids: z.array(z.number()).default([]),
    is_hidden: z.boolean().default(false),
    order_index: z.number().default(0),
});

export type CreateProductInput = z.infer<typeof CreateProductInputSchema>;

export const CreateProductOutputSchema = z.object({
    id: z.number(),
});

export type CreateProductOutput = z.infer<typeof CreateProductOutputSchema>;

/**
 * Schema for updating a product
 */
export const UpdateProductInputSchema = z.object({
    id: z.number(),
    en_name: z
        .string()
        .min(PRODUCT_NAME_MIN_LENGTH, PRODUCT_FIELD_ERRORS.EN_NAME_REQUIRED),
    ar_name: z
        .string()
        .min(PRODUCT_NAME_MIN_LENGTH, PRODUCT_FIELD_ERRORS.AR_NAME_REQUIRED),
    en_description: z
        .string()
        .min(
            PRODUCT_NAME_MIN_LENGTH,
            PRODUCT_FIELD_ERRORS.EN_DESCRIPTION_REQUIRED
        )
        .max(
            PRODUCT_DESCRIPTION_MAX_LENGTH,
            PRODUCT_FIELD_ERRORS.EN_DESCRIPTION_MAX
        ),
    ar_description: z
        .string()
        .min(
            PRODUCT_NAME_MIN_LENGTH,
            PRODUCT_FIELD_ERRORS.AR_DESCRIPTION_REQUIRED
        )
        .max(
            PRODUCT_DESCRIPTION_MAX_LENGTH,
            PRODUCT_FIELD_ERRORS.AR_DESCRIPTION_MAX
        ),
    medias: z.array(ProductMediaItemSchema).default([]),
    specifications: z.array(ProductSpecificationItemSchema).default([]),
    variants: z.array(ProductVariantItemSchema).default([]),
    moq: z
        .string()
        .min(PRODUCT_NAME_MIN_LENGTH, PRODUCT_FIELD_ERRORS.MOQ_REQUIRED),
    production_capacity: z
        .string()
        .min(
            PRODUCT_NAME_MIN_LENGTH,
            PRODUCT_FIELD_ERRORS.PRODUCTION_CAPACITY_REQUIRED
        ),
    packaging_option_ids: z.array(z.number()).default([]),
    is_hidden: z.boolean().default(false),
    order_index: z.number().default(0),
});

export type UpdateProductInput = z.infer<typeof UpdateProductInputSchema>;

/**
 * Schema for listing products
 */
export const ListProductsInputSchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z
        .number()
        .int()
        .positive()
        .max(MAX_PAGE_SIZE)
        .default(DEFAULT_PAGE_SIZE),
    name_search: z.string().optional(),
});

export type ListProductsInput = z.infer<typeof ListProductsInputSchema>;

/**
 * Schema for product list item
 */
export const ProductListItemSchema = z.object({
    id: z.number(),
    en_name: z.string(),
    ar_name: z.string(),
    first_media_key: z.string().nullable(),
    first_media_type: z
        .enum([MEDIA_TYPE_ENUM.IMAGE, MEDIA_TYPE_ENUM.YOUTUBE])
        .nullable(),
    youtube_video_id: z.string().nullable(),
    is_hidden: z.boolean(),
    order_index: z.number(),
    created_at: z.date(),
    updated_at: z.date(),
});

export type ProductListItem = z.infer<typeof ProductListItemSchema>;

/**
 * Schema for list products output
 */
export const ListProductsOutputSchema = z.object({
    products: z.array(ProductListItemSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
});

export type ListProductsOutput = z.infer<typeof ListProductsOutputSchema>;

/**
 * Schema for getting product by ID
 */
export const GetProductByIdInputSchema = z.object({
    id: z.number(),
});

export type GetProductByIdInput = z.infer<typeof GetProductByIdInputSchema>;

/**
 * Schema for product detail
 */
export const ProductDetailSchema = z.object({
    id: z.number(),
    en_name: z.string(),
    ar_name: z.string(),
    en_description: z.string(),
    ar_description: z.string(),
    moq: z.string(),
    production_capacity: z.string(),
    medias: z.array(ProductMediaItemSchema),
    specifications: z.array(ProductSpecificationItemSchema),
    variants: z.array(ProductVariantItemSchema),
    packaging_option_ids: z.array(z.number()),
    is_hidden: z.boolean(),
    order_index: z.number(),
    created_at: z.date(),
    updated_at: z.date(),
});

export type ProductDetail = z.infer<typeof ProductDetailSchema>;

/**
 * Schema for deleting a product
 */
export const DeleteProductInputSchema = z.object({
    id: z.number(),
});

export type DeleteProductInput = z.infer<typeof DeleteProductInputSchema>;

/**
 * Schema for toggling product visibility
 */
export const ToggleProductVisibilityInputSchema = z.object({
    id: z.number(),
});

export type ToggleProductVisibilityInput = z.infer<
    typeof ToggleProductVisibilityInputSchema
>;

/**
 * Schema for reordering products
 */
export const ReorderProductsInputSchema = z.object({
    product_orders: z.array(
        z.object({
            id: z.number(),
            order_index: z.number(),
        })
    ),
});

export type ReorderProductsInput = z.infer<typeof ReorderProductsInputSchema>;

/**
 * Schema for generating presigned upload URL for product assets
 */
export const GenerateProductUploadUrlInputSchema = z.object({
    file_name: z.string(),
    mime_type: z.string().regex(IMAGE_MIME_REGEX),
    upload_type: z.enum(PRODUCT_UPLOAD_TYPES),
});

export type GenerateProductUploadUrlInput = z.infer<
    typeof GenerateProductUploadUrlInputSchema
>;

export const GenerateProductUploadUrlOutputSchema = z.object({
    upload_url: z.string(),
    key: z.string(),
});

export type GenerateProductUploadUrlOutput = z.infer<
    typeof GenerateProductUploadUrlOutputSchema
>;
