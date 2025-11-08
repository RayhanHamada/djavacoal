import { Locale } from "next-intl";
import z from "zod";

import {
    COMMON_COLUMNS,
    PACKAGING_OPTION_COLUMNS,
    PRODUCT_COLUMNS,
    PRODUCT_MEDIA_COLUMNS,
    TEAM_MEMBER_COLUMNS,
} from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { KV_KEYS } from "@/adapters/kv/constants";
import { COOKIE_NAME, LOCALES } from "@/configs";
import {
    FOOTER_CONTENT_BODY_OUTPUT_SCHEMA,
    HOME_CONTENT_BODY_OUTPUT_SCHEMA,
    LIST_PRODUCT_NAME_QUERY_INPUT_SCHEMA,
    LIST_PRODUCT_NAME_BODY_OUTPUT_SCHEMA,
    ABOUT_COMPANY_BODY_OUTPUT_SCHEMA,
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

                            const slug = `${item[PRODUCT_COLUMNS.EN_NAME]
                                .replaceAll(" ", "-")
                                .toLowerCase()}-${item[COMMON_COLUMNS.ID]}`;
                            return {
                                id: item[COMMON_COLUMNS.ID],
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
            const locale = (cookie.get(COOKIE_NAME.LOCALE)?.value ||
                LOCALES.EN) as Locale;
            const db = getDB(env.DJAVACOAL_DB);
            const kv = env.DJAVACOAL_KV;

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
                kv.get(KV_KEYS.VISIT_OUR_FACTORY_PHOTO, "json").then((v) => {
                    if (!v) return null;
                    if (!Array.isArray(v)) return null;
                    if (!v.length) return null;
                    const [first] = v;
                    console.log(v);

                    return new URL(first, env.NEXT_PUBLIC_ASSET_URL).toString();
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
                    where(fields, operators) {
                        return operators.eq(
                            fields[PRODUCT_COLUMNS.IS_HIDDEN],
                            false
                        );
                    },
                    with: {
                        medias: {
                            where(fields, operators) {
                                return operators.eq(
                                    fields[PRODUCT_MEDIA_COLUMNS.MEDIA_TYPE],
                                    "image"
                                );
                            },
                            orderBy(fields, operators) {
                                return [
                                    operators.asc(
                                        fields[
                                            PRODUCT_MEDIA_COLUMNS.ORDER_INDEX
                                        ]
                                    ),
                                ];
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

                        const enName = item[PRODUCT_COLUMNS.EN_NAME]
                            .toLowerCase()
                            .replaceAll(" ", "-");
                        const slug = `${enName}-${id}`;

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

                        const enName = v[PACKAGING_OPTION_COLUMNS.EN_NAME]
                            .toLowerCase()
                            .replaceAll(" ", "-");
                        const slug = `${enName}-${id}`;

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

    aboutCompanyContent: publicBase
        .route({
            method: "GET",
            path: "/about-company-content",
            summary: "Fetch about company content data",
            description: "Get about company page content",
            outputStructure: "detailed",
        })
        .output(
            z.object({
                body: ABOUT_COMPANY_BODY_OUTPUT_SCHEMA,
            })
        )
        .handler(async function ({ context: { env } }) {
            const db = getDB(env.DJAVACOAL_DB);
            const kv = env.DJAVACOAL_KV;

            const [
                our_factory_photo,
                reels,
                factory_galleries,
                product_galleries,
                about_us_video_url,
            ] = await Promise.all([
                kv.get(KV_KEYS.VISIT_OUR_FACTORY_PHOTO, "json").then((v) => {
                    if (!v) return null;
                    if (!Array.isArray(v)) return null;
                    if (!v.length) return null;
                    const [first] = v;

                    return new URL(first, env.NEXT_PUBLIC_ASSET_URL).toString();
                }),

                kv
                    .get(KV_KEYS.REELS, "json")
                    .then((v) => {
                        if (!v) return [];
                        if (!Array.isArray(v)) return [];
                        if (!v.length) return [];

                        return (
                            v as Array<{ videoId: string; url: string }>
                        ).map((item) => ({
                            id: item.videoId,
                            video_url: item.url,
                        }));
                    })
                    .catch(() => []),

                kv
                    .get(KV_KEYS.FACTORY_GALLERY_PHOTOS, "json")
                    .then((v) => {
                        if (!v) return [];
                        if (!Array.isArray(v)) return [];
                        if (!v.length) return [];

                        return v.map((item: string) =>
                            new URL(item, env.NEXT_PUBLIC_ASSET_URL).toString()
                        );
                    })
                    .catch(() => [] as string[]),

                kv
                    .get(KV_KEYS.PRODUCT_GALLERY_PHOTOS, "json")
                    .then((v) => {
                        if (!v) return [];
                        if (!Array.isArray(v)) return [];
                        if (!v.length) return [];

                        return v.map((item: string) =>
                            new URL(item, env.NEXT_PUBLIC_ASSET_URL).toString()
                        );
                    })
                    .catch(() => [] as string[]),

                kv.get(KV_KEYS.WHO_WE_ARE_VIDEO),
            ]);

            const team_members = await db.query.teams
                .findMany({
                    columns: {
                        [COMMON_COLUMNS.ID]: true,
                        [TEAM_MEMBER_COLUMNS.NAME]: true,
                        [TEAM_MEMBER_COLUMNS.POSITION]: true,
                        [TEAM_MEMBER_COLUMNS.PHOTO_KEY]: true,
                    },
                    orderBy(fields, operators) {
                        return [
                            operators.asc(
                                fields[TEAM_MEMBER_COLUMNS.ORDER_INDEX]
                            ),
                        ];
                    },
                })
                .then((items) => {
                    return items.map((item) => {
                        const id = item[COMMON_COLUMNS.ID];
                        const name = item[TEAM_MEMBER_COLUMNS.NAME];
                        const position = item[TEAM_MEMBER_COLUMNS.POSITION];
                        const imageKey = item[TEAM_MEMBER_COLUMNS.PHOTO_KEY];
                        const photo_url = new URL(
                            imageKey,
                            env.NEXT_PUBLIC_ASSET_URL
                        ).toString();

                        return {
                            id,
                            name,
                            position,
                            photo_url,
                        };
                    });
                })
                .catch(() => []);

            return {
                body: {
                    data: {
                        our_factory_photo,
                        reels,
                        team_members,
                        factory_galleries,
                        product_galleries,
                        about_us_video_url,
                    },
                },
            };
        }),
};

export type PublicAPIRouter = typeof router;
