import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod/v4";

import {
    MEDIA_TYPE_ENUM,
    METADATA_DESCRIPTION_MAX_LENGTH,
    METADATA_KEYWORD_MAX_LENGTH,
    METADATA_KEYWORDS_MAX_COUNT,
    MIN_MEDIA_ITEMS,
    MIN_SPECIFICATIONS,
    MIN_VARIANT_SIZES,
    MIN_VARIANTS,
    PRODUCT_DESCRIPTION_MAX_LENGTH,
    PRODUCT_FIELD_ERRORS,
    PRODUCT_IMAGE_MIME_ERROR,
    PRODUCT_IMAGE_MIME_TYPES,
    PRODUCT_NAME_MIN_LENGTH,
} from "./constants";

/**
 * Schema for packaging option form validation
 */
export const packagingOptionFormSchema = z.object({
    en_name: z.string().min(1, "English name is required"),
    ar_name: z.string().min(1, "Arabic name is required"),
    en_description: z.string().min(1, "English description is required"),
    ar_description: z.string().min(1, "Arabic description is required"),
    photo_key: z.string().optional(),
});

/**
 * Schema for media items (images and YouTube videos)
 */
const mediaItemSchema = z
    .object({
        id: z.string(),
        order_index: z.number(),
    })
    .and(
        z.discriminatedUnion("media_type", [
            z.object({
                media_type: z.literal(MEDIA_TYPE_ENUM.IMAGE),
                image_key: z.string(),
                image_file: z
                    .file()
                    .mime(PRODUCT_IMAGE_MIME_TYPES, PRODUCT_IMAGE_MIME_ERROR)
                    .optional(),
            }),
            z.object({
                media_type: z.literal(MEDIA_TYPE_ENUM.YOUTUBE),
                youtube_video_id: z.string(),
                video_custom_thumbnail_key: z.string().optional(),
                video_custom_thumbnail_file: z
                    .file()
                    .mime(PRODUCT_IMAGE_MIME_TYPES, PRODUCT_IMAGE_MIME_ERROR)
                    .optional(),
            }),
        ])
    );

/**
 * Schema for specification items
 */
const specificationItemSchema = z.object({
    id: z.string(),
    spec_photo_key: z.string(),
    spec_photo_file: z.instanceof(File).optional(),
    order_index: z.number(),
});

/**
 * Schema for variant items
 */
const variantItemSchema = z.object({
    id: z.string(),
    en_variant_name: z.string(),
    ar_variant_name: z.string(),
    variant_photo_key: z.string(),
    variant_sizes: z
        .array(z.string())
        .min(MIN_VARIANT_SIZES, "At least one size is required"),
    variant_photo_file: z
        .file()
        .mime(PRODUCT_IMAGE_MIME_TYPES, PRODUCT_IMAGE_MIME_ERROR)
        .optional(),
    order_index: z.number(),
});

/**
 * Schema for product form validation
 * Includes all fields with proper validation
 */
export const productFormSchema = z.object({
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
    medias: z
        .array(mediaItemSchema)
        .min(MIN_MEDIA_ITEMS, "At least one media item is required")
        .refine(
            (medias) =>
                medias.some(
                    (media) => media.media_type === MEDIA_TYPE_ENUM.IMAGE
                ),
            "At least one image media is required"
        ),
    specifications: z
        .array(specificationItemSchema)
        .min(MIN_SPECIFICATIONS, "At least one specification is required"),
    variants: z
        .array(variantItemSchema)
        .min(MIN_VARIANTS, "At least one variant is required"),
    moq: z
        .string()
        .min(PRODUCT_NAME_MIN_LENGTH, PRODUCT_FIELD_ERRORS.MOQ_REQUIRED),
    production_capacity: z
        .string()
        .min(
            PRODUCT_NAME_MIN_LENGTH,
            PRODUCT_FIELD_ERRORS.PRODUCTION_CAPACITY_REQUIRED
        ),
    packaging_option_ids: z.array(z.string()),
    is_hidden: z.boolean(),
    /** SEO metadata description (max 160 chars, optional) */
    metadata_description: z
        .string()
        .max(
            METADATA_DESCRIPTION_MAX_LENGTH,
            PRODUCT_FIELD_ERRORS.METADATA_DESCRIPTION_MAX
        )
        .optional(),
    /** SEO metadata keywords (max 20 items, each max 30 chars, optional) */
    metadata_keywords: z
        .array(
            z
                .string()
                .max(
                    METADATA_KEYWORD_MAX_LENGTH,
                    PRODUCT_FIELD_ERRORS.METADATA_KEYWORD_MAX_LENGTH
                )
        )
        .max(
            METADATA_KEYWORDS_MAX_COUNT,
            PRODUCT_FIELD_ERRORS.METADATA_KEYWORDS_MAX_COUNT
        )
        .optional(),
});

export const validatePackagingOptionFormSchema = zod4Resolver(
    packagingOptionFormSchema
);

export const validateProductFormSchema = zod4Resolver(productFormSchema);

export type PackagingOptionFormValues = z.infer<
    typeof packagingOptionFormSchema
>;

export type ProductFormValues = z.infer<typeof productFormSchema>;
