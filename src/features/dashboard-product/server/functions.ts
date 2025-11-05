import "server-only";

import { headers } from "next/headers";

import { count, desc, eq, like, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

import {
    COMMON_COLUMNS,
    PACKAGING_OPTION_COLUMNS,
    PRODUCT_COLUMNS,
    PRODUCT_MEDIA_COLUMNS,
    PRODUCT_MEDIA_TYPE,
    PRODUCT_PACKAGING_OPTION_COLUMNS,
    PRODUCT_SPECIFICATION_COLUMNS,
    PRODUCT_VARIANT_COLUMNS,
} from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import {
    packagingOptions,
    productMedias,
    productPackagingOptions,
    products,
    productSpecifications,
    productVariants,
} from "@/adapters/d1/schema";
import {
    DEFAULT_BUCKET_NAME,
    deleteObject,
    generatePresignedUploadUrl,
    getR2Client,
    PRODUCT_MEDIA_PREFIX,
    PRODUCT_SPECIFICATIONS_PREFIX,
    PRODUCT_VARIANTS_PREFIX,
} from "@/adapters/r2";
import { getAuth } from "@/features/dashboard-auth/lib/better-auth-server";
import {
    CreatePackagingOptionInputSchema,
    CreatePackagingOptionOutputSchema,
    CreateProductInputSchema,
    CreateProductOutputSchema,
    DeletePackagingOptionInputSchema,
    DeleteProductInputSchema,
    GenerateImageUploadUrlInputSchema,
    GenerateImageUploadUrlOutputSchema,
    GenerateProductUploadUrlInputSchema,
    GenerateProductUploadUrlOutputSchema,
    GetPackagingOptionByIdInputSchema,
    GetPackagingOptionByIdOutputSchema,
    GetProductByIdInputSchema,
    ListPackagingOptionsInputSchema,
    ListPackagingOptionsOutputSchema,
    ListProductsInputSchema,
    ListProductsOutputSchema,
    ProductDetail,
    ProductDetailSchema,
    ReorderProductsInputSchema,
    ToggleProductVisibilityInputSchema,
    UpdatePackagingOptionInputSchema,
    UpdateProductInputSchema,
} from "@/features/dashboard-product/server/schemas";
import base from "@/lib/orpc/server";

const PACKAGING_OPTIONS_PREFIX = "packaging-options";

/**
 * List packaging options with pagination and search
 */
export const listPackagingOptions = base
    .input(ListPackagingOptionsInputSchema)
    .output(ListPackagingOptionsOutputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        const { search, page, limit } = input;

        // Build where clause for search (search by English name)
        const whereConditions = search
            ? like(
                  packagingOptions[PACKAGING_OPTION_COLUMNS.EN_NAME],
                  `%${search}%`
              )
            : undefined;

        // Fetch packaging options
        const options = await db
            .select()
            .from(packagingOptions)
            .where(whereConditions)
            .orderBy(desc(packagingOptions[COMMON_COLUMNS.UPDATED_AT]))
            .limit(limit)
            .offset((page - 1) * limit);

        // Get total count
        const totalResult = await db
            .select({ count: count() })
            .from(packagingOptions)
            .where(whereConditions);

        const total = totalResult.at(0)?.count ?? 0;

        return {
            packagingOptions: options.map((option) => ({
                id: option[COMMON_COLUMNS.ID],
                en_name: option[PACKAGING_OPTION_COLUMNS.EN_NAME],
                ar_name: option[PACKAGING_OPTION_COLUMNS.AR_NAME],
                en_description: option[PACKAGING_OPTION_COLUMNS.EN_DESCRIPTION],
                ar_description: option[PACKAGING_OPTION_COLUMNS.AR_DESCRIPTION],
                photo_key: option[PACKAGING_OPTION_COLUMNS.PHOTO_KEY],
                created_at: option[COMMON_COLUMNS.CREATED_AT],
                updated_at: option[COMMON_COLUMNS.UPDATED_AT],
            })),
            total,
            page,
            pageSize: limit,
        };
    })
    .callable();

/**
 * Get a single packaging option by ID
 */
export const getPackagingOptionById = base
    .input(GetPackagingOptionByIdInputSchema)
    .output(GetPackagingOptionByIdOutputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        const result = await db
            .select()
            .from(packagingOptions)
            .where(eq(packagingOptions[COMMON_COLUMNS.ID], input.id))
            .limit(1);

        const first = result.at(0);
        if (!first) {
            throw errors.NOT_FOUND({
                message: "Packaging option not found",
            });
        }

        return {
            id: first[COMMON_COLUMNS.ID],
            en_name: first[PACKAGING_OPTION_COLUMNS.EN_NAME],
            ar_name: first[PACKAGING_OPTION_COLUMNS.AR_NAME],
            en_description: first[PACKAGING_OPTION_COLUMNS.EN_DESCRIPTION],
            ar_description: first[PACKAGING_OPTION_COLUMNS.AR_DESCRIPTION],
            photo_key: first[PACKAGING_OPTION_COLUMNS.PHOTO_KEY],
            created_at: first[COMMON_COLUMNS.CREATED_AT],
            updated_at: first[COMMON_COLUMNS.UPDATED_AT],
            created_by: first[COMMON_COLUMNS.CREATED_BY],
            updated_by: first[COMMON_COLUMNS.UPDATED_BY],
        };
    })
    .callable();

/**
 * Create a new packaging option
 */
export const createPackagingOption = base
    .input(CreatePackagingOptionInputSchema)
    .output(CreatePackagingOptionOutputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        // Get current user from session
        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        const userId = session.user.id;

        // Insert new packaging option using raw SQL to avoid type issues
        const result = await db
            .insert(packagingOptions)
            .values({
                en_name: input[PACKAGING_OPTION_COLUMNS.EN_NAME],
                ar_name: input[PACKAGING_OPTION_COLUMNS.AR_NAME],
                en_description: input[PACKAGING_OPTION_COLUMNS.EN_DESCRIPTION],
                ar_description: input[PACKAGING_OPTION_COLUMNS.AR_DESCRIPTION],
                photo_key: input[PACKAGING_OPTION_COLUMNS.PHOTO_KEY],
                created_by: userId,
                updated_by: userId,
            })
            .returning({
                id: packagingOptions[COMMON_COLUMNS.ID],
            });

        const first = result.at(0);
        if (!first) {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Failed to create packaging option",
            });
        }

        return {
            id: first.id,
        };
    })
    .callable();

/**
 * Update an existing packaging option
 */
export const updatePackagingOption = base
    .input(UpdatePackagingOptionInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        // Get current user from session
        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED({
                message: "You must be logged in to update a packaging option",
            });
        }

        const userId = session.user.id;

        // Check if packaging option exists
        const existing = await db
            .select()
            .from(packagingOptions)
            .where(eq(packagingOptions[COMMON_COLUMNS.ID], input.id))
            .limit(1);

        const first = existing.at(0);
        if (!first) {
            throw errors.NOT_FOUND();
        }

        // Update packaging option using raw any to avoid type issues
        await db
            .update(packagingOptions)
            .set({
                en_name: input[PACKAGING_OPTION_COLUMNS.EN_NAME],
                ar_name: input[PACKAGING_OPTION_COLUMNS.AR_NAME],
                en_description: input[PACKAGING_OPTION_COLUMNS.EN_DESCRIPTION],
                ar_description: input[PACKAGING_OPTION_COLUMNS.AR_DESCRIPTION],
                photo_key: input[PACKAGING_OPTION_COLUMNS.PHOTO_KEY],
                updated_by: userId,
            } as any)
            .where(eq(packagingOptions[COMMON_COLUMNS.ID], input.id));

        return {
            success: true,
        };
    })
    .callable();

/**
 * Delete a packaging option
 */
export const deletePackagingOption = base
    .input(DeletePackagingOptionInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        // Get current user from session
        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        // Check if packaging option exists
        const existing = await db
            .select()
            .from(packagingOptions)
            .where(eq(packagingOptions[COMMON_COLUMNS.ID], input.id))
            .limit(1);

        if (!existing) {
            throw errors.NOT_FOUND();
        }

        const option = existing.at(0);
        if (!option) {
            throw errors.NOT_FOUND();
        }

        // Delete from R2
        const r2Client = getR2Client({
            endpoint: env.S3_API,
            accessKeyId: env.R2_ACCESS_KEY_ID!,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
        });

        await deleteObject(r2Client, option.photo_key, DEFAULT_BUCKET_NAME);

        // Delete from database
        await db
            .delete(packagingOptions)
            .where(eq(packagingOptions[COMMON_COLUMNS.ID], input.id));

        return {
            success: true,
        };
    })
    .callable();

/**
 * Generate presigned URL for uploading packaging option image
 */
export const generateImageUploadUrl = base
    .input(GenerateImageUploadUrlInputSchema)
    .output(GenerateImageUploadUrlOutputSchema)
    .handler(async function ({ context: { env }, errors, input }) {
        const auth = getAuth(env);
        const header = await headers();

        // Get current user from session
        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        const { mimeType } = input;

        // Generate unique key for the image
        const key = `${PACKAGING_OPTIONS_PREFIX}/${nanoid()}`;

        // Create R2 client
        const r2Client = getR2Client({
            endpoint: env.S3_API,
            accessKeyId: env.R2_ACCESS_KEY_ID!,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
        });

        // Generate presigned URL
        const uploadUrl = await generatePresignedUploadUrl(r2Client, {
            key,
            contentType: mimeType,
            bucketName: DEFAULT_BUCKET_NAME,
        });

        return {
            uploadUrl,
            key,
        };
    })
    .callable();

// ============================================================================
// PRODUCT FUNCTIONS
// ============================================================================

/**
 * List products with pagination and search
 */
export const listProducts = base
    .input(ListProductsInputSchema)
    .output(ListProductsOutputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        const { page, limit, name_search } = input;

        // Build where conditions
        const whereConditions = name_search
            ? like(products[PRODUCT_COLUMNS.EN_NAME], `%${name_search}%`)
            : undefined;

        // Fetch products with first media
        const productsList = await db
            .select({
                id: products[COMMON_COLUMNS.ID],
                en_name: products[PRODUCT_COLUMNS.EN_NAME],
                ar_name: products[PRODUCT_COLUMNS.AR_NAME],
                is_hidden: products[PRODUCT_COLUMNS.IS_HIDDEN],
                order_index: products[PRODUCT_COLUMNS.ORDER_INDEX],
                created_at: products[COMMON_COLUMNS.CREATED_AT],
                updated_at: products[COMMON_COLUMNS.UPDATED_AT],
            })
            .from(products)
            .where(whereConditions)
            .orderBy(products[PRODUCT_COLUMNS.ORDER_INDEX])
            .limit(limit)
            .offset((page - 1) * limit);

        // Get first media for each product
        const productsWithMedia = await Promise.all(
            productsList.map(async (product) => {
                const firstMedia = await db
                    .select()
                    .from(productMedias)
                    .where(
                        eq(
                            productMedias[PRODUCT_MEDIA_COLUMNS.PRODUCT_ID],
                            product.id
                        )
                    )
                    .orderBy(productMedias[PRODUCT_MEDIA_COLUMNS.ORDER_INDEX])
                    .limit(1);

                const media = firstMedia.at(0);

                return {
                    ...product,
                    first_media_key:
                        media?.media_type === PRODUCT_MEDIA_TYPE.IMAGE
                            ? (media?.image_key ?? null)
                            : null,
                    first_media_type: media?.media_type ?? null,
                    youtube_video_id:
                        media?.media_type === PRODUCT_MEDIA_TYPE.YOUTUBE
                            ? (media?.video_id ?? null)
                            : null,
                };
            })
        );

        // Get total count
        const totalResult = await db
            .select({ count: count() })
            .from(products)
            .where(whereConditions);

        const total = totalResult.at(0)?.count ?? 0;

        return {
            products: productsWithMedia,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    })
    .callable();

/**
 * Get product by ID with all related data
 */
export const getProductById = base
    .input(GetProductByIdInputSchema)
    .output(ProductDetailSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        // Fetch product
        const productResult = await db
            .select()
            .from(products)
            .where(eq(products[COMMON_COLUMNS.ID], input.id))
            .limit(1);

        const product = productResult.at(0);
        if (!product) {
            throw errors.NOT_FOUND({
                message: "Product not found",
            });
        }

        // Fetch medias
        const mediasResult = await db
            .select()
            .from(productMedias)
            .where(
                eq(productMedias[PRODUCT_MEDIA_COLUMNS.PRODUCT_ID], input.id)
            )
            .orderBy(productMedias[PRODUCT_MEDIA_COLUMNS.ORDER_INDEX]);

        // Fetch specifications
        const specificationsResult = await db
            .select()
            .from(productSpecifications)
            .where(
                eq(
                    productSpecifications[
                        PRODUCT_SPECIFICATION_COLUMNS.PRODUCT_ID
                    ],
                    input.id
                )
            )
            .orderBy(
                productSpecifications[PRODUCT_SPECIFICATION_COLUMNS.ORDER_INDEX]
            );

        // Fetch variants
        const variantsResult = await db
            .select()
            .from(productVariants)
            .where(
                eq(
                    productVariants[PRODUCT_VARIANT_COLUMNS.PRODUCT_ID],
                    input.id
                )
            )
            .orderBy(productVariants[PRODUCT_VARIANT_COLUMNS.ORDER_INDEX]);

        // Fetch packaging options
        const packagingOptionsResult = await db
            .select({
                id: productPackagingOptions[
                    PRODUCT_PACKAGING_OPTION_COLUMNS.PACKAGING_OPTION_ID
                ],
            })
            .from(productPackagingOptions)
            .where(
                eq(
                    productPackagingOptions[
                        PRODUCT_PACKAGING_OPTION_COLUMNS.PRODUCT_ID
                    ],
                    input.id
                )
            );

        const detail: ProductDetail = {
            id: product[COMMON_COLUMNS.ID],
            en_name: product[PRODUCT_COLUMNS.EN_NAME],
            ar_name: product[PRODUCT_COLUMNS.AR_NAME],
            en_description: product[PRODUCT_COLUMNS.EN_DESCRIPTION],
            ar_description: product[PRODUCT_COLUMNS.AR_DESCRIPTION],
            moq: product[PRODUCT_COLUMNS.MOQ],
            production_capacity: product[PRODUCT_COLUMNS.PRODUCTION_CAPACITY],
            is_hidden: product[PRODUCT_COLUMNS.IS_HIDDEN],
            order_index: product[PRODUCT_COLUMNS.ORDER_INDEX],
            created_at: product[COMMON_COLUMNS.CREATED_AT],
            updated_at: product[COMMON_COLUMNS.UPDATED_AT],
            medias: mediasResult.map((m) => ({
                id: m[COMMON_COLUMNS.ID],
                media_type: m[PRODUCT_MEDIA_COLUMNS.MEDIA_TYPE] as
                    | "image"
                    | "youtube",
                image_key:
                    m[PRODUCT_MEDIA_COLUMNS.MEDIA_TYPE] ===
                    PRODUCT_MEDIA_TYPE.IMAGE
                        ? m[PRODUCT_MEDIA_COLUMNS.IMAGE_KEY]!
                        : undefined!,
                youtube_video_id:
                    m[PRODUCT_MEDIA_COLUMNS.MEDIA_TYPE] ===
                    PRODUCT_MEDIA_TYPE.YOUTUBE
                        ? m[PRODUCT_MEDIA_COLUMNS.YOUTUBE_VIDEO_ID]!
                        : undefined!,
                video_custom_thumbnail_key:
                    m[PRODUCT_MEDIA_COLUMNS.VIDEO_CUSTOM_THUMBNAIL_KEY] ??
                    undefined,
                order_index: m[PRODUCT_MEDIA_COLUMNS.ORDER_INDEX],
            })),
            specifications: specificationsResult.map((s) => ({
                id: s[COMMON_COLUMNS.ID],
                spec_photo_key: s[PRODUCT_SPECIFICATION_COLUMNS.SPEC_PHOTO_KEY],
                order_index: s[PRODUCT_SPECIFICATION_COLUMNS.ORDER_INDEX],
            })),
            variants: variantsResult.map((v) => ({
                id: v[COMMON_COLUMNS.ID],
                en_variant_name: v[PRODUCT_VARIANT_COLUMNS.EN_VARIANT_NAME],
                ar_variant_name: v[PRODUCT_VARIANT_COLUMNS.AR_VARIANT_NAME],
                variant_photo_key: v[PRODUCT_VARIANT_COLUMNS.VARIANT_PHOTO_KEY],
                variant_sizes: v[PRODUCT_VARIANT_COLUMNS.VARIANT_SIZES],
                order_index: v[PRODUCT_VARIANT_COLUMNS.ORDER_INDEX],
            })),
            packaging_option_ids: packagingOptionsResult.map((p) => p.id),
        };

        return detail;
    })
    .callable();

/**
 * Create a new product
 */
export const createProduct = base
    .input(CreateProductInputSchema)
    .output(CreateProductOutputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        const userId = session.user.id;

        // Get max order_index
        const maxOrderResult = await db
            .select({
                maxOrder: sql<number>`MAX(${products[PRODUCT_COLUMNS.ORDER_INDEX]})`,
            })
            .from(products);

        const nextOrder = (maxOrderResult.at(0)?.maxOrder ?? -1) + 1;

        // Insert product
        const productResult = await db
            .insert(products)
            .values({
                en_name: input.en_name,
                ar_name: input.ar_name,
                en_description: input.en_description,
                ar_description: input.ar_description,
                moq: input.moq,
                production_capacity: input.production_capacity,
                is_hidden: input.is_hidden,
                order_index: nextOrder,
                created_by: userId,
                updated_by: userId,
            })
            .returning({ id: products[COMMON_COLUMNS.ID] });

        const product = productResult.at(0);
        if (!product) {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Failed to create product",
            });
        }

        const productId = product.id;

        // Insert medias
        if (input.medias.length) {
            await db.insert(productMedias).values(
                input.medias.map((m) => ({
                    product_id: productId,
                    media_type: m.media_type,
                    image_key:
                        m.media_type === "image" ? m.image_key : undefined,
                    video_id:
                        m.media_type === "youtube"
                            ? m.youtube_video_id
                            : undefined,
                    video_custom_thumbnail_key:
                        m.media_type === "youtube"
                            ? m.video_custom_thumbnail_key
                            : undefined,
                    order_index: m.order_index,
                }))
            );
        }

        // Insert specifications
        if (input.specifications.length) {
            await db.insert(productSpecifications).values(
                input.specifications.map((s) => ({
                    product_id: productId,
                    spec_photo_key: s.spec_photo_key,
                    order_index: s.order_index,
                }))
            );
        }

        // Insert variants
        if (input.variants.length) {
            await db.insert(productVariants).values(
                input.variants.map((v) => ({
                    product_id: productId,
                    en_variant_name: v.en_variant_name,
                    ar_variant_name: v.ar_variant_name,
                    variant_photo_key: v.variant_photo_key,
                    variant_sizes: v.variant_sizes,
                    order_index: v.order_index,
                }))
            );
        }

        // Insert packaging options
        if (input.packaging_option_ids.length) {
            await db.insert(productPackagingOptions).values(
                input.packaging_option_ids.map((id) => ({
                    product_id: productId,
                    packaging_option_id: id,
                }))
            );
        }

        return {
            id: productId,
        };
    })
    .callable();

/**
 * Update an existing product
 */
export const updateProduct = base
    .input(UpdateProductInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        const userId = session.user.id;

        // Check if product exists
        const existing = await db
            .select()
            .from(products)
            .where(eq(products[COMMON_COLUMNS.ID], input.id))
            .limit(1);

        if (!existing.at(0)) {
            throw errors.NOT_FOUND({ message: "Product not found" });
        }

        try {
            // Update product
            await db
                .update(products)
                .set({
                    en_name: input.en_name,
                    ar_name: input.ar_name,
                    en_description: input.en_description,
                    ar_description: input.ar_description,
                    moq: input.moq,
                    production_capacity: input.production_capacity,
                    is_hidden: input.is_hidden,
                    order_index: input.order_index,
                    updated_by: userId,
                })
                .where(eq(products[COMMON_COLUMNS.ID], input.id));

            // Delete existing related data
            await db
                .delete(productMedias)
                .where(
                    eq(
                        productMedias[PRODUCT_MEDIA_COLUMNS.PRODUCT_ID],
                        input.id
                    )
                );
            await db
                .delete(productSpecifications)
                .where(
                    eq(
                        productSpecifications[
                            PRODUCT_SPECIFICATION_COLUMNS.PRODUCT_ID
                        ],
                        input.id
                    )
                );
            await db
                .delete(productVariants)
                .where(
                    eq(
                        productVariants[PRODUCT_VARIANT_COLUMNS.PRODUCT_ID],
                        input.id
                    )
                );
            await db
                .delete(productPackagingOptions)
                .where(
                    eq(
                        productPackagingOptions[
                            PRODUCT_PACKAGING_OPTION_COLUMNS.PRODUCT_ID
                        ],
                        input.id
                    )
                );

            // Re-insert medias
            if (input.medias.length) {
                await db.insert(productMedias).values(
                    input.medias.map((m) => ({
                        product_id: input.id,
                        media_type: m.media_type,
                        image_key:
                            m.media_type === "image" ? m.image_key : undefined,
                        video_id:
                            m.media_type === "youtube"
                                ? m.youtube_video_id
                                : undefined,
                        video_custom_thumbnail_key:
                            m.media_type === "youtube"
                                ? m.video_custom_thumbnail_key
                                : undefined,
                        order_index: m.order_index,
                    }))
                );
            }

            // Re-insert specifications
            if (input.specifications.length) {
                await db.insert(productSpecifications).values(
                    input.specifications.map((s) => ({
                        product_id: input.id,
                        spec_photo_key: s.spec_photo_key,
                        order_index: s.order_index,
                    }))
                );
            }

            console.log(`variant sizes =>> `, input.variants);

            // Re-insert variants
            if (input.variants.length) {
                await db.insert(productVariants).values(
                    input.variants.map((v) => ({
                        product_id: input.id,
                        en_variant_name: v.en_variant_name,
                        ar_variant_name: v.ar_variant_name,
                        variant_photo_key: v.variant_photo_key,
                        variant_sizes: v.variant_sizes,
                        order_index: v.order_index,
                    }))
                );
            }

            // Re-insert packaging options
            if (input.packaging_option_ids.length) {
                await db.insert(productPackagingOptions).values(
                    input.packaging_option_ids.map((id) => ({
                        product_id: input.id,
                        packaging_option_id: id,
                    }))
                );
            }
        } catch {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Failed to update product",
            });
        }

        return {
            success: true,
        };
    })
    .callable();

/**
 * Delete a product
 */
export const deleteProduct = base
    .input(DeleteProductInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        // Check if product exists
        const existing = await db
            .select()
            .from(products)
            .where(eq(products[COMMON_COLUMNS.ID], input.id))
            .limit(1);

        if (!existing.at(0)) {
            throw errors.NOT_FOUND({ message: "Product not found" });
        }

        // TODO: Delete R2 objects (medias, specifications, variants)
        // This is a cascading delete in the database schema
        // so related records will be deleted automatically

        // Delete product
        await db
            .delete(products)
            .where(eq(products[COMMON_COLUMNS.ID], input.id));

        return {
            success: true,
        };
    })
    .callable();

/**
 * Toggle product visibility
 */
export const toggleProductVisibility = base
    .input(ToggleProductVisibilityInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        // Get current visibility state
        const existing = await db
            .select({ is_hidden: products[PRODUCT_COLUMNS.IS_HIDDEN] })
            .from(products)
            .where(eq(products[COMMON_COLUMNS.ID], input.id))
            .limit(1);

        const product = existing.at(0);
        if (!product) {
            throw errors.NOT_FOUND({ message: "Product not found" });
        }

        // Toggle visibility
        await db
            .update(products)
            .set({
                is_hidden: !product.is_hidden,
            })
            .where(eq(products[COMMON_COLUMNS.ID], input.id));

        return {
            success: true,
            is_hidden: !product.is_hidden,
        };
    })
    .callable();

/**
 * Reorder products
 */
export const reorderProducts = base
    .input(ReorderProductsInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        // Update order for each product
        await Promise.all(
            input.product_orders.map(async ({ id, order_index }) => {
                await db
                    .update(products)
                    .set({ order_index })
                    .where(eq(products[COMMON_COLUMNS.ID], id));
            })
        );

        return {
            success: true,
        };
    })
    .callable();

/**
 * Generate presigned URL for product asset upload
 */
export const generateProductUploadUrl = base
    .input(GenerateProductUploadUrlInputSchema)
    .output(GenerateProductUploadUrlOutputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        const { upload_type, mime_type } = input;

        // Determine prefix based on upload type
        let prefix = PRODUCT_MEDIA_PREFIX;
        if (upload_type === "specification") {
            prefix = PRODUCT_SPECIFICATIONS_PREFIX;
        } else if (upload_type === "variant") {
            prefix = PRODUCT_VARIANTS_PREFIX;
        } else if (upload_type === "video-thumbnail") {
            prefix = `${PRODUCT_MEDIA_PREFIX}/thumbnails`;
        }

        // Generate unique key
        const key = `${prefix}/${nanoid()}`;

        // Create R2 client
        const r2Client = getR2Client({
            endpoint: env.S3_API,
            accessKeyId: env.R2_ACCESS_KEY_ID!,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
        });

        // Generate presigned URL
        const upload_url = await generatePresignedUploadUrl(r2Client, {
            key,
            contentType: mime_type,
            bucketName: DEFAULT_BUCKET_NAME,
        });

        return {
            upload_url,
            key,
        };
    })
    .callable();
