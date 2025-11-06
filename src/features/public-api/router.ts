import z from "zod";

import {
    COMMON_COLUMNS,
    PACKAGING_OPTION_COLUMNS,
    PRODUCT_COLUMNS,
} from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { KV_KEYS } from "@/adapters/kv/constants";
import { COOKIE_NAME, LOCALES } from "@/configs";
import {
    FOOTER_CONTENT_BODY_OUTPUT_SCHEMA,
    HOME_CONTENT_BODY_OUTPUT_SCHEMA,
    LIST_PRODUCT_NAME_QUERY_INPUT_SCHEMA,
    LIST_PRODUCT_NAME_BODY_OUTPUT_SCHEMA,
} from "@/features/public-api/schemas";
import { injectNextCookies } from "@/lib/orpc/middlewares";
import base from "@/lib/orpc/server";

/**
 * Base ORPC instance for public API
 * No authentication required, but injects Cloudflare context
 */
const publicBase = base.use(injectNextCookies);

export const router = {
    /**
     * list product names endpoint
     */
    listProductNames: publicBase
        .route({
            method: "GET",
            path: "/products-names",
            summary: "List product names",
            description: "List product names with localization support",
            inputStructure: "detailed",
            outputStructure: "detailed",
        })
        .input(
            z.object({
                query: LIST_PRODUCT_NAME_QUERY_INPUT_SCHEMA,
            })
        )
        .output(
            z.object({
                body: LIST_PRODUCT_NAME_BODY_OUTPUT_SCHEMA,
            })
        )
        .handler(async function ({
            context: { env, locale },
            input: { query },
        }) {
            const isArabic = locale === LOCALES.AR;

            const db = getDB(env.DJAVACOAL_DB);

            const names = await db.query.products.findMany({
                limit: query?.limit ?? 5,
                columns: {
                    [COMMON_COLUMNS.ID]: true,
                    [PRODUCT_COLUMNS.AR_NAME]: true,
                    [PRODUCT_COLUMNS.EN_NAME]: true,
                },
                orderBy(products, { asc }) {
                    return [asc(products[COMMON_COLUMNS.CREATED_AT])];
                },
            });

            return {
                body: {
                    data: {
                        names: names.map((item) => {
                            const name = isArabic
                                ? item[PRODUCT_COLUMNS.AR_NAME]
                                : item[PRODUCT_COLUMNS.EN_NAME];

                            const slug = item[PRODUCT_COLUMNS.EN_NAME]
                                .replaceAll(" ", "-")
                                .toLowerCase();
                            return {
                                id: item.id,
                                slug,
                                name,
                            };
                        }),
                        meta: {
                            total: names.length,
                        },
                    },
                },
            };
        }),

    footerContent: publicBase
        .route({
            method: "GET",
            path: "/footer-content",
            summary: "Fetch footer content data",
            description:
                "Get footer content including social media links and contact info",
            outputStructure: "detailed",
        })
        .output(
            z.object({
                body: FOOTER_CONTENT_BODY_OUTPUT_SCHEMA,
            })
        )
        .handler(async function ({ context: { env } }) {
            const [
                facebook_link,
                linkedin_link,
                instagram_link,
                tiktok_link,
                maps_link,
                address,
                phone_number,
                email,
            ] = await Promise.all([
                env.DJAVACOAL_KV.get(KV_KEYS.FACEBOOK_LINK),
                env.DJAVACOAL_KV.get(KV_KEYS.LINKEDIN_LINK),
                env.DJAVACOAL_KV.get(KV_KEYS.INSTAGRAM_LINK),
                env.DJAVACOAL_KV.get(KV_KEYS.TIKTOK_LINK),

                env.DJAVACOAL_KV.get(KV_KEYS.MAPS_LINK),
                env.DJAVACOAL_KV.get(KV_KEYS.ADDRESS_LINE),
                env.DJAVACOAL_KV.get(KV_KEYS.WHATSAPP_NUMBER),
                env.DJAVACOAL_KV.get(KV_KEYS.EMAIL_ADDRESS),
            ]);

            return {
                body: {
                    data: {
                        address,
                        email,
                        facebook_link,
                        instagram_link,
                        linkedin_link,
                        maps_link,
                        phone_number,
                        tiktok_link,
                    },
                },
            };
        }),

    homeContent: publicBase
        .route({
            method: "GET",
            path: "/home-content",
            summary: "Fetch home page content data",
            description:
                "Get home page content including slide banners, featured products, and packaging options",
            outputStructure: "detailed",
        })
        .output(
            z.object({
                body: HOME_CONTENT_BODY_OUTPUT_SCHEMA,
            })
        )
        .handler(async function ({
            context: { env, cookie },
            errors: _errors,
        }) {
            const locale = cookie.get(COOKIE_NAME.LOCALE)?.value || LOCALES.EN;
            const db = getDB(env.DJAVACOAL_DB);
            const kv = env.DJAVACOAL_KV;

            /**
             * get from cache if available
             */
            const cachedResponse = await kv.get<Record<string, unknown>>(
                KV_KEYS.HOME_CONTENT_CACHE,
                "json"
            );

            if (cachedResponse) {
                const { success, data } =
                    HOME_CONTENT_BODY_OUTPUT_SCHEMA.safeParse(cachedResponse);

                if (success) {
                    return {
                        body: data,
                    };
                }
            }

            const [
                slide_banners,
                who_we_are_video_url,
                visit_our_factory_photo,
            ] = await Promise.all([
                /**
                 * get slide banners
                 */
                kv
                    .get<string[]>(KV_KEYS.HOME_CAROUSEL_PHOTO, "json")
                    .then((v) => {
                        if (!Array.isArray(v)) return [];

                        return v.map((e: string) =>
                            new URL(e, env.NEXT_PUBLIC_ASSET_URL).toString()
                        );
                    }),

                /**
                 * get who we are video URL
                 */
                kv.get(KV_KEYS.WHO_WE_ARE_VIDEO, "text"),

                /**
                 * get visit our factory photo
                 */
                kv.get(KV_KEYS.VISIT_OUR_FACTORY_PHOTO).then((v) => {
                    if (!v) return null;

                    return new URL(v, env.NEXT_PUBLIC_ASSET_URL).toString();
                }),
            ]);

            const featured_products = await db.query.products
                .findMany({
                    limit: 4,
                    columns: {
                        [COMMON_COLUMNS.ID]: true,
                        [PRODUCT_COLUMNS.EN_NAME]: true,
                        [PRODUCT_COLUMNS.AR_NAME]: true,
                        [PRODUCT_COLUMNS.EN_DESCRIPTION]: true,
                        [PRODUCT_COLUMNS.AR_DESCRIPTION]: true,
                    },
                    with: {
                        medias: {
                            where(fields, operators) {
                                return operators.eq(fields.media_type, "image");
                            },
                            orderBy(fields, operators) {
                                return [operators.asc(fields.order_index)];
                            },
                            limit: 1,
                            columns: {
                                image_key: true,
                            },
                        },
                    },
                })
                .then((items) => {
                    return items.map((item) => {
                        const id = item[COMMON_COLUMNS.ID];

                        const slug = `${item[PRODUCT_COLUMNS.EN_NAME]}-${id}`;

                        const imageKey = item.medias.at(0)!.image_key!;
                        const image_url = new URL(
                            imageKey,
                            env.NEXT_PUBLIC_ASSET_URL
                        ).toString();

                        const name =
                            locale === LOCALES.AR
                                ? item[PRODUCT_COLUMNS.AR_NAME]
                                : item[PRODUCT_COLUMNS.EN_NAME];

                        const description =
                            locale === LOCALES.AR
                                ? item[PRODUCT_COLUMNS.AR_DESCRIPTION]
                                : item[PRODUCT_COLUMNS.EN_DESCRIPTION];

                        return {
                            id,
                            slug,
                            name,
                            description,
                            image_url,
                        };
                    });
                });

            const packaging_options = await db.query.packagingOptions
                .findMany({
                    columns: {
                        [COMMON_COLUMNS.ID]: true,
                        [PACKAGING_OPTION_COLUMNS.EN_NAME]: true,
                        [PACKAGING_OPTION_COLUMNS.AR_NAME]: true,
                        [PACKAGING_OPTION_COLUMNS.EN_DESCRIPTION]: true,
                        [PACKAGING_OPTION_COLUMNS.AR_DESCRIPTION]: true,
                        [PACKAGING_OPTION_COLUMNS.PHOTO_KEY]: true,
                    },
                    limit: 3,
                    orderBy(fields, operators) {
                        return [
                            operators.asc(
                                fields[PACKAGING_OPTION_COLUMNS.EN_NAME]
                            ),
                        ];
                    },
                })
                .then((items) => {
                    return items.map((v) => {
                        const id = v[COMMON_COLUMNS.ID];

                        const slug = `${v[PACKAGING_OPTION_COLUMNS.EN_NAME]}-${id}`;

                        const image_url = new URL(
                            v[PACKAGING_OPTION_COLUMNS.PHOTO_KEY],
                            env.NEXT_PUBLIC_ASSET_URL
                        ).toString();

                        const type =
                            locale === LOCALES.AR
                                ? v[PACKAGING_OPTION_COLUMNS.AR_NAME]
                                : v[PACKAGING_OPTION_COLUMNS.EN_NAME];

                        const description =
                            locale === LOCALES.AR
                                ? v[PACKAGING_OPTION_COLUMNS.AR_DESCRIPTION]
                                : v[PACKAGING_OPTION_COLUMNS.EN_DESCRIPTION];

                        return {
                            id,
                            slug,
                            type,
                            description,
                            image_url,
                        };
                    });
                });

            kv.put(
                KV_KEYS.HOME_CONTENT_CACHE,
                JSON.stringify({
                    data: {
                        slide_banners,
                        who_we_are_video_url,
                        visit_our_factory_photo,
                        featured_products,
                        packaging_options,
                    },
                }),
                {
                    expiration: 60 * 10, // cache for 10 minutes
                }
            );

            return {
                body: {
                    data: {
                        slide_banners,
                        who_we_are_video_url,
                        visit_our_factory_photo,
                        featured_products,
                        packaging_options,
                    },
                },
            };
        }),
};

export type PublicAPIRouter = typeof router;
