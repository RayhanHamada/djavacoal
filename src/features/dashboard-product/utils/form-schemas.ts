import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod/v4";

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
                media_type: z.literal("image"),
                image_key: z.string(),
                image_file: z
                    .file()
                    .mime(
                        ["image/png", "image/jpeg", "image/jpg"],
                        "Supported image formats for image item are PNG and JPEG"
                    )
                    .optional(),
            }),
            z.object({
                media_type: z.literal("youtube"),
                youtube_video_id: z.string(),
                video_custom_thumbnail_key: z.string().optional(),
                video_custom_thumbnail_file: z
                    .file()
                    .mime(
                        ["image/png", "image/jpeg", "image/jpg"],
                        "Supported image formats for video custom thumbnail are PNG and JPEG"
                    )
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
    variant_sizes: z.array(z.string()).min(1, "At least one size is required"),
    variant_photo_file: z
        .file()
        .mime(
            ["image/png", "image/jpeg", "image/jpg"],
            "Supported image formats for variant items are PNG and JPEG"
        )
        .optional(),
    order_index: z.number(),
});

/**
 * Schema for product form validation
 * Includes all fields with proper validation
 */
export const productFormSchema = z.object({
    en_name: z.string().min(1, "English name is required"),
    ar_name: z.string().min(1, "Arabic name is required"),
    en_description: z
        .string()
        .min(1, "English description is required")
        .max(1000, "English description must be 1000 characters or less"),
    ar_description: z
        .string()
        .min(1, "Arabic description is required")
        .max(1000, "Arabic description must be 1000 characters or less"),
    medias: z
        .array(mediaItemSchema)
        .min(1, "At least one media item is required")
        .refine(
            (medias) => medias.at(0)?.media_type === "image",
            "The first media item must be an image"
        )
        .refine(
            (medias) => medias.some((media) => media.media_type === "image"),
            "At least one image media is required"
        ),
    specifications: z
        .array(specificationItemSchema)
        .min(1, "At least one specification is required"),
    variants: z
        .array(variantItemSchema)
        .min(1, "At least one variant is required"),
    moq: z.string().min(1, "MOQ is required"),
    production_capacity: z.string().min(1, "Production capacity is required"),
    packaging_option_ids: z.array(z.string()),
    is_hidden: z.boolean(),
});

export const validatePackagingOptionFormSchema = zod4Resolver(
    packagingOptionFormSchema
);

export const validateProductFormSchema = zod4Resolver(productFormSchema);

export type PackagingOptionFormValues = z.infer<
    typeof packagingOptionFormSchema
>;

export type ProductFormValues = z.infer<typeof productFormSchema>;
