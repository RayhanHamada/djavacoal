import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import { getDB } from "@/adapters/d1/db";
import {
    products,
    productMedias,
    productSpecifications,
    productVariants,
    productPackagingOptions,
    packagingOptions,
    news,
} from "@/adapters/d1/schema";
import { getR2Client, getTextContent } from "@/adapters/r2";
import {
    GET_PUBLIC_PRODUCT_BY_ID_INPUT_SCHEMA,
    LIST_PUBLIC_NEWS_INPUT_SCHEMA,
    LIST_PUBLIC_NEWS_OUTPUT_SCHEMA,
    LIST_PUBLIC_PRODUCT_OUTPUT_SCHEMA,
    PRODUCT_DETAIL_OUTPUT_SCHEMA,
} from "@/features/public-api/server/schemas";
import base from "@/lib/orpc/server";

/**
 * Base ORPC instance for public API
 * No authentication required, but injects Cloudflare context
 */
const publicBase = base;

/**
 * GET /api/public/products
 * Returns list of all products (id and name only)
 */
export const listProducts = publicBase
    .output(LIST_PUBLIC_PRODUCT_OUTPUT_SCHEMA)
    .handler(async ({ context: { env } }) => {
        const db = getDB(env.DJAVACOAL_DB);

        const allProducts = await db
            .select({
                id: products.id,
                name: products.en_name,
            })
            .from(products)
            .where(eq(products.is_hidden, false))
            .orderBy(asc(products.order_index));

        return {
            products: allProducts,
            total: allProducts.length,
        };
    })
    .callable();

/**
 * GET /api/public/products/:id
 * Returns detailed product information by ID
 */
export const getProductById = publicBase
    .input(GET_PUBLIC_PRODUCT_BY_ID_INPUT_SCHEMA)
    .output(PRODUCT_DETAIL_OUTPUT_SCHEMA)
    .handler(async ({ context: { env }, input: { id } }) => {
        const db = getDB(env.DJAVACOAL_DB);

        // Get product details
        const product = await db.query.products.findFirst({
            where: eq(products.id, id),
        });

        if (!product || product.is_hidden) {
            throw new Error("Product not found");
        }

        // Get product media
        const medias = await db
            .select()
            .from(productMedias)
            .where(eq(productMedias.product_id, id))
            .orderBy(asc(productMedias.order_index));

        // Get product specifications
        const specifications = await db
            .select()
            .from(productSpecifications)
            .where(eq(productSpecifications.product_id, id))
            .orderBy(asc(productSpecifications.order_index));

        // Get product variants
        const variants = await db
            .select()
            .from(productVariants)
            .where(eq(productVariants.product_id, id))
            .orderBy(asc(productVariants.order_index));

        // Get packaging options for this product
        const productPackaging = await db
            .select({
                packaging: packagingOptions,
            })
            .from(productPackagingOptions)
            .innerJoin(
                packagingOptions,
                eq(
                    productPackagingOptions.packaging_option_id,
                    packagingOptions.id
                )
            )
            .where(eq(productPackagingOptions.product_id, id));

        // Transform medias to match discriminated union schema
        const transformedMedias = medias.map((m) => {
            if (m.media_type === "image") {
                return {
                    id: m.id,
                    media_type: m.media_type,
                    image_key: m.image_key!,
                    order_index: m.order_index,
                };
            }

            return {
                id: m.id,
                media_type: m.media_type,
                youtube_video_id: m.video_id!,
                video_custom_thumbnail_key:
                    m.video_custom_thumbnail_key ?? undefined,
                order_index: m.order_index,
            };
        });

        return {
            id: product.id,
            name: product.en_name,
            description: product.en_description,
            moq: product.moq,
            production_capacity: product.production_capacity,
            medias: transformedMedias,
            specifications: specifications.map((s) => ({
                id: s.id,
                spec_photo_key: s.spec_photo_key,
                order_index: s.order_index,
            })),
            variants: variants.map((v) => ({
                id: v.id,
                variant_name: v.en_variant_name,
                variant_photo_key: v.variant_photo_key,
                variant_sizes: v.variant_sizes,
                order_index: v.order_index,
            })),
            packaging_options: productPackaging.map((p) => ({
                id: p.packaging.id,
                name: p.packaging.en_name,
                description: p.packaging.en_description,
                photo_key: p.packaging.photo_key,
            })),
            created_at: product.created_at!,
            updated_at: product.updated_at!,
        };
    })
    .callable();

/**
 * GET /api/public/news
 * Returns paginated list of published news (without content)
 */
export const listNews = publicBase
    .input(LIST_PUBLIC_NEWS_INPUT_SCHEMA)
    .output(LIST_PUBLIC_NEWS_OUTPUT_SCHEMA)
    .handler(async ({ context: { env }, input }) => {
        const db = getDB(env.DJAVACOAL_DB);
        const { page, limit, sort } = input;

        const offset = (page - 1) * limit;

        // Get published news only, sorted by publication date
        const newsItems = await db
            .select({
                id: news.id,
                slug: news.slug,
                image_key: news.image_key,
                metadata_title: news.metadata_title,
                metadata_description: news.metadata_description,
                metadata_tag_list: news.metadata_tag_list,
                en_title: news.en_title,
                ar_title: news.ar_title,
                published_at: news.published_at,
                published_by: news.published_by,
            })
            .from(news)
            .where(eq(news.status, "published"))
            .orderBy(
                sort === "newest"
                    ? desc(news.published_at)
                    : asc(news.published_at)
            )
            .limit(limit)
            .offset(offset);

        // Get total count
        const totalResult = await db
            .select({
                count: news.id,
            })
            .from(news)
            .where(eq(news.status, "published"));

        const total = totalResult.length;
        const totalPages = Math.ceil(total / limit);

        return {
            items: newsItems.map((item) => ({
                id: item.id,
                slug: item.slug,
                image_key: item.image_key,
                metadata_title: item.metadata_title,
                metadata_description: item.metadata_description,
                metadata_tags: (item.metadata_tag_list as string[]) || [],
                en_title: item.en_title,
                ar_title: item.ar_title,
                published_at: item.published_at!,
                published_by: item.published_by,
            })),
            total,
            page,
            limit,
            total_pages: totalPages,
        };
    })
    .callable();

/**
 * GET /api/public/news/:id
 * Returns detailed news information by ID (with content fetched from R2)
 */
export const getNewsById = publicBase
    .input(GetPublicNewsByIdInputSchema)
    .output(PublicNewsDetailSchema)
    .handler(async ({ context: { env }, input: { id } }) => {
        const db = getDB(env.DJAVACOAL_DB);

        // Get news article
        const article = await db.query.news.findFirst({
            where: eq(news.id, id),
        });

        if (!article || article.status !== "published") {
            throw new Error("News article not found");
        }

        // Create R2 client and fetch content
        const r2Client = getR2Client({
            endpoint: env.S3_API,
            accessKeyId: env.R2_ACCESS_KEY_ID!,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
        });

        const enContent = await getTextContent(
            r2Client,
            article.en_content_key
        );
        const arContent = await getTextContent(
            r2Client,
            article.ar_content_key
        );

        return {
            id: article.id,
            slug: article.slug,
            image_key: article.image_key,
            metadata_title: article.metadata_title,
            metadata_description: article.metadata_description,
            metadata_tags: (article.metadata_tag_list as string[]) || [],
            en_title: article.en_title,
            ar_title: article.ar_title,
            en_content: enContent,
            ar_content: arContent,
            published_at: article.published_at!,
            published_by: article.published_by,
            created_at: article.created_at!,
            updated_at: article.updated_at!,
        };
    })
    .callable();
