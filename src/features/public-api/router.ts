import { and, isNotNull, lte } from "drizzle-orm";
import { Locale } from "next-intl";
import z from "zod";

import {
    COMMON_COLUMNS,
    NEWS_COLUMNS,
    NEWS_STATUS,
    PACKAGING_OPTION_COLUMNS,
    PRODUCT_COLUMNS,
    PRODUCT_MEDIA_COLUMNS,
    PRODUCT_MEDIA_TYPE,
    PRODUCT_SPECIFICATION_COLUMNS,
    PRODUCT_VARIANT_COLUMNS,
    TEAM_MEMBER_COLUMNS,
} from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { news } from "@/adapters/d1/schema";
import { KV_KEYS } from "@/adapters/kv/constants";
import { getR2Client, getTextContent } from "@/adapters/r2";
import { COOKIE_NAME, LOCALES } from "@/configs";
import {
    FOOTER_CONTENT_BODY_OUTPUT_SCHEMA,
    HOME_CONTENT_BODY_OUTPUT_SCHEMA,
    LIST_PRODUCT_NAME_QUERY_INPUT_SCHEMA,
    LIST_PRODUCT_NAME_BODY_OUTPUT_SCHEMA,
    ABOUT_COMPANY_BODY_OUTPUT_SCHEMA,
    PACKAGING_INFO_CONTENT_BODY_OUTPUT_SCHEMA,
    PRODUCT_DETAIL_BODY_OUTPUT_SCHEMA,
    PRODUCT_DETAIL_PATH_INPUT_SCHEMA,
    NEWS_LIST_QUERY_INPUT_SCHEMA,
    NEWS_LIST_BODY_OUTPUT_SCHEMA,
    NEWS_DETAIL_PARAMS_INPUT_SCHEMA,
    NEWS_DETAIL_BODY_OUTPUT_SCHEMA,
    NEWS_METADATA_PARAMS_INPUT_SCHEMA,
    NEWS_METADATA_BODY_OUTPUT_SCHEMA,
    CONTACT_US_BODY_OUTPUT_SCHEMA,
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
                    return [asc(products[PRODUCT_COLUMNS.ORDER_INDEX])];
                },
                where(fields, operators) {
                    return operators.eq(
                        fields[PRODUCT_COLUMNS.IS_HIDDEN],
                        false
                    );
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

    getFooterContent: publicBase
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

    getHomeContent: publicBase
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
                            new URL(
                                e,
                                process.env.NEXT_PUBLIC_ASSET_URL
                            ).toString()
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

                    return new URL(
                        first,
                        process.env.NEXT_PUBLIC_ASSET_URL
                    ).toString();
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
                            process.env.NEXT_PUBLIC_ASSET_URL
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
                            process.env.NEXT_PUBLIC_ASSET_URL
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

    getAboutCompanyContent: publicBase
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

                    return new URL(
                        first,
                        process.env.NEXT_PUBLIC_ASSET_URL
                    ).toString();
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
                            new URL(
                                item,
                                process.env.NEXT_PUBLIC_ASSET_URL
                            ).toString()
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
                            new URL(
                                item,
                                process.env.NEXT_PUBLIC_ASSET_URL
                            ).toString()
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
                            process.env.NEXT_PUBLIC_ASSET_URL
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

    getPackagingInfoContent: publicBase
        .route({
            method: "GET",
            path: "/packaging-info-content",
            summary: "Fetch packaging info content data",
            description: "Get packaging info page content",
            outputStructure: "detailed",
        })
        .output(
            z.object({
                body: PACKAGING_INFO_CONTENT_BODY_OUTPUT_SCHEMA,
            })
        )
        .handler(async function ({ context: { env, locale } }) {
            const isArabic = locale === LOCALES.AR;
            const db = getDB(env.DJAVACOAL_DB);
            const packaging_options = await db.query.packagingOptions
                .findMany({
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
                        const image_url = new URL(
                            v[PACKAGING_OPTION_COLUMNS.PHOTO_KEY],
                            process.env.NEXT_PUBLIC_ASSET_URL
                        ).toString();

                        const enName = v[PACKAGING_OPTION_COLUMNS.EN_NAME];
                        const slug = enName.toLowerCase().replaceAll(" ", "-");

                        const type = isArabic
                            ? v[PACKAGING_OPTION_COLUMNS.AR_NAME]
                            : v[PACKAGING_OPTION_COLUMNS.EN_NAME];

                        const description = isArabic
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

            const body = PACKAGING_INFO_CONTENT_BODY_OUTPUT_SCHEMA.parse({
                data: {
                    packaging_options,
                },
            });

            return {
                body,
            };
        }),

    getProductDetail: publicBase
        .route({
            method: "GET",
            path: "/products/{id}",
            summary: "Fetch product detail data",
            description: "Get product detail by product ID",
            inputStructure: "detailed",
            outputStructure: "detailed",
        })
        .input(
            z.object({
                params: PRODUCT_DETAIL_PATH_INPUT_SCHEMA,
            })
        )
        .output(
            z.object({
                body: PRODUCT_DETAIL_BODY_OUTPUT_SCHEMA,
            })
        )
        .handler(async function ({
            context: { env, locale },
            errors,
            input: { params },
        }) {
            const isArabic = locale === LOCALES.AR;
            console.log(locale);
            const db = getDB(env.DJAVACOAL_DB);

            const product = await db.query.products.findFirst({
                where(fields, operators) {
                    return operators.and(
                        operators.eq(fields[COMMON_COLUMNS.ID], params.id),
                        operators.eq(fields[PRODUCT_COLUMNS.IS_HIDDEN], false)
                    );
                },

                with: {
                    packagingOptions: {
                        columns: {},
                        with: {
                            packagingOption: true,
                        },
                    },
                    medias: {
                        orderBy(fields, operators) {
                            return [
                                operators.asc(
                                    fields[PRODUCT_MEDIA_COLUMNS.ORDER_INDEX]
                                ),
                            ];
                        },
                    },
                    variants: {
                        orderBy(fields, operators) {
                            return [
                                operators.asc(
                                    fields[PRODUCT_VARIANT_COLUMNS.ORDER_INDEX]
                                ),
                            ];
                        },
                    },
                    specifications: {
                        orderBy(fields, operators) {
                            return [
                                operators.asc(
                                    fields[
                                        PRODUCT_SPECIFICATION_COLUMNS
                                            .ORDER_INDEX
                                    ]
                                ),
                            ];
                        },
                    },
                },
            });

            if (!product) {
                throw errors.NOT_FOUND();
            }

            const slug = product[PRODUCT_COLUMNS.EN_NAME]
                .replaceAll(" ", "-")
                .toLowerCase();

            const medias = product.medias.map((media) => {
                const id = media[COMMON_COLUMNS.ID];
                const type = media[PRODUCT_MEDIA_COLUMNS.MEDIA_TYPE];

                if (type === PRODUCT_MEDIA_TYPE.IMAGE) {
                    const imageKey =
                        media[PRODUCT_MEDIA_COLUMNS.IMAGE_KEY] ?? "";
                    const image_url = new URL(
                        imageKey,
                        process.env.NEXT_PUBLIC_ASSET_URL
                    ).toString();

                    return {
                        type,
                        id,
                        image_url,
                    };
                }

                const youtube_url = `https://www.youtube.com/watch?v=${media[PRODUCT_MEDIA_COLUMNS.YOUTUBE_VIDEO_ID]}`;

                const thumbnailKey =
                    media[PRODUCT_MEDIA_COLUMNS.VIDEO_CUSTOM_THUMBNAIL_KEY];

                const custom_thumbnail_url = thumbnailKey
                    ? new URL(
                          thumbnailKey,
                          process.env.NEXT_PUBLIC_ASSET_URL
                      ).toString()
                    : undefined;

                return {
                    id,
                    type,
                    youtube_url,
                    custom_thumbnail_url,
                };
            });

            const specifications = product.specifications.map((spec) => {
                const id = spec[COMMON_COLUMNS.ID];
                const imageKey =
                    spec[PRODUCT_SPECIFICATION_COLUMNS.SPEC_PHOTO_KEY];
                const image_url = new URL(
                    imageKey,
                    process.env.NEXT_PUBLIC_ASSET_URL
                ).toString();

                return {
                    id,
                    image_url,
                };
            });

            const variants = product.variants.map((variant) => {
                const id = variant[COMMON_COLUMNS.ID];
                const name = isArabic
                    ? variant[PRODUCT_VARIANT_COLUMNS.AR_VARIANT_NAME]
                    : variant[PRODUCT_VARIANT_COLUMNS.EN_VARIANT_NAME];
                const sizes = variant[PRODUCT_VARIANT_COLUMNS.VARIANT_SIZES];
                const imageKey =
                    variant[PRODUCT_VARIANT_COLUMNS.VARIANT_PHOTO_KEY];
                const image_url = new URL(
                    imageKey,
                    process.env.NEXT_PUBLIC_ASSET_URL
                ).toString();

                return {
                    id,
                    name,
                    sizes,
                    image_url,
                };
            });

            const packaging_options = product.packagingOptions
                .map((v) => v.packagingOption)
                .map((v) => {
                    const id = v[COMMON_COLUMNS.ID];
                    const slug = v[PACKAGING_OPTION_COLUMNS.EN_NAME]
                        .toLowerCase()
                        .replaceAll(" ", "-");
                    const type = isArabic
                        ? v[PACKAGING_OPTION_COLUMNS.AR_NAME]
                        : v[PACKAGING_OPTION_COLUMNS.EN_NAME];
                    const description = isArabic
                        ? v[PACKAGING_OPTION_COLUMNS.AR_DESCRIPTION]
                        : v[PACKAGING_OPTION_COLUMNS.EN_DESCRIPTION];
                    const imageKey = v[PACKAGING_OPTION_COLUMNS.PHOTO_KEY];
                    const image_url = new URL(
                        imageKey,
                        process.env.NEXT_PUBLIC_ASSET_URL
                    ).toString();

                    return {
                        id,
                        slug,
                        type,
                        description,
                        image_url,
                    };
                });

            return {
                body: {
                    data: {
                        id: product[COMMON_COLUMNS.ID],
                        slug,
                        name: isArabic
                            ? product[PRODUCT_COLUMNS.AR_NAME]
                            : product[PRODUCT_COLUMNS.EN_NAME],
                        description: isArabic
                            ? product[PRODUCT_COLUMNS.AR_DESCRIPTION]
                            : product[PRODUCT_COLUMNS.EN_DESCRIPTION],
                        moq: product[PRODUCT_COLUMNS.MOQ],
                        production_capacity:
                            product[PRODUCT_COLUMNS.PRODUCTION_CAPACITY],

                        medias,
                        specifications,
                        variants,
                        packaging_options,
                    },
                },
            };
        }),

    getNewsList: publicBase
        .route({
            method: "GET",
            path: "/news",
            summary: "Fetch news list",
            description: "Get list of news articles",
            inputStructure: "detailed",
            outputStructure: "detailed",
        })
        .input(
            z.object({
                query: NEWS_LIST_QUERY_INPUT_SCHEMA,
            })
        )
        .output(
            z.object({
                body: NEWS_LIST_BODY_OUTPUT_SCHEMA,
            })
        )
        .handler(async function ({
            context: { env, locale },
            input: {
                query: { limit, page },
            },
        }) {
            const isArabic = locale === LOCALES.AR;
            const db = getDB(env.DJAVACOAL_DB);

            const allNewsConditions = and(
                isNotNull(news[NEWS_COLUMNS.PUBLISHED_AT]),
                lte(news[NEWS_COLUMNS.PUBLISHED_AT], new Date())
            );

            const allNews = await db.query.news
                .findMany({
                    columns: {
                        id: true,
                        slug: true,
                        ar_title: true,
                        en_title: true,
                        published_at: true,
                        image_key: true,
                    },
                    where() {
                        return allNewsConditions;
                    },
                    orderBy(fields, operators) {
                        return [
                            operators.desc(fields[NEWS_COLUMNS.PUBLISHED_AT]),
                        ];
                    },
                    limit: limit,
                    offset: (page - 1) * limit,
                })
                .then((item) =>
                    item
                        .filter((v) => v[NEWS_COLUMNS.PUBLISHED_AT])
                        .map((v) => {
                            const id = v[COMMON_COLUMNS.ID];
                            const slug = v[NEWS_COLUMNS.SLUG];
                            const title = isArabic
                                ? v[NEWS_COLUMNS.AR_TITLE]
                                : v[NEWS_COLUMNS.EN_TITLE];
                            const published_at = v[NEWS_COLUMNS.PUBLISHED_AT]!;
                            const imageKey = v[NEWS_COLUMNS.IMAGE_KEY];
                            const cover_image_url = imageKey
                                ? new URL(
                                      imageKey,
                                      process.env.NEXT_PUBLIC_ASSET_URL
                                  ).toString()
                                : null;

                            return {
                                id,
                                slug,
                                title,
                                published_at,
                                cover_image_url,
                            };
                        })
                );

            const paginatedNewsCount = await db.$count(news, allNewsConditions);

            const total_pages = Math.ceil(paginatedNewsCount / limit);

            return {
                body: {
                    data: {
                        news: {
                            data: allNews,
                            page,
                            limit,
                            total_pages,
                        },
                    },
                },
            };
        }),

    getNewsDetail: publicBase
        .route({
            method: "GET",
            path: "/news/{slug}",
            summary: "Fetch news detail",
            description: "Get news article detail by slug",
            inputStructure: "detailed",
            outputStructure: "detailed",
        })
        .input(
            z.object({
                params: NEWS_DETAIL_PARAMS_INPUT_SCHEMA,
            })
        )
        .output(
            z.object({
                body: NEWS_DETAIL_BODY_OUTPUT_SCHEMA,
            })
        )
        .handler(async function ({
            context: { env, locale },
            input: { params },
            errors,
        }) {
            try {
                const isArabic = locale === LOCALES.AR;
                const db = getDB(env.DJAVACOAL_DB);
                const r2Client = getR2Client({
                    endpoint: process.env.S3_API,
                    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
                });

                const now = new Date();
                const article = await db.query.news.findFirst({
                    where(fields, operators) {
                        return operators.and(
                            operators.eq(
                                fields[NEWS_COLUMNS.SLUG],
                                params.slug
                            ),

                            operators.isNotNull(
                                fields[NEWS_COLUMNS.PUBLISHED_AT]
                            ),

                            operators.lte(
                                fields[NEWS_COLUMNS.PUBLISHED_AT],
                                now
                            ),

                            operators.eq(
                                fields[NEWS_COLUMNS.STATUS],
                                NEWS_STATUS.PUBLISHED
                            )
                        );
                    },
                });

                if (!article) {
                    throw errors.NOT_FOUND();
                }

                const title = isArabic
                    ? article[NEWS_COLUMNS.AR_TITLE]
                    : article[NEWS_COLUMNS.EN_TITLE];

                const slug = article[NEWS_COLUMNS.SLUG];
                const contentKey = isArabic
                    ? article[NEWS_COLUMNS.AR_CONTENT_KEY]
                    : article[NEWS_COLUMNS.EN_CONTENT_KEY];

                const content = await getTextContent(r2Client, contentKey);
                const imageKey = article[NEWS_COLUMNS.IMAGE_KEY];
                const cover_image_url = imageKey
                    ? new URL(
                          imageKey,
                          process.env.NEXT_PUBLIC_ASSET_URL
                      ).toString()
                    : null;

                return {
                    body: {
                        data: {
                            title,
                            slug,
                            content,
                            cover_image_url,
                            published_at: article[NEWS_COLUMNS.PUBLISHED_AT]!,
                        },
                    },
                };
            } catch (e) {
                console.log(e);

                throw errors.INTERNAL_SERVER_ERROR({ cause: e });
            }
        }),

    getNewsMetadata: publicBase
        .route({
            method: "GET",
            path: "/news/{slug}/metadata",
            summary: "Fetch news metadata",
            description: "Get metadata for news articles",
            inputStructure: "detailed",
            outputStructure: "detailed",
        })
        .input(
            z.object({
                params: NEWS_METADATA_PARAMS_INPUT_SCHEMA,
            })
        )
        .output(
            z.object({
                body: NEWS_METADATA_BODY_OUTPUT_SCHEMA,
            })
        )
        .handler(async function ({
            context: { env },
            input: { params },
            errors,
        }) {
            const db = getDB(env.DJAVACOAL_DB);

            const now = new Date();
            const article = await db.query.news.findFirst({
                where(fields, operators) {
                    return operators.and(
                        operators.eq(fields[NEWS_COLUMNS.SLUG], params.slug),

                        operators.isNotNull(fields[NEWS_COLUMNS.PUBLISHED_AT]),

                        operators.lte(fields[NEWS_COLUMNS.PUBLISHED_AT], now),

                        operators.eq(
                            fields[NEWS_COLUMNS.STATUS],
                            NEWS_STATUS.PUBLISHED
                        )
                    );
                },
            });

            if (!article) {
                throw errors.NOT_FOUND();
            }

            const imageKey = article[NEWS_COLUMNS.IMAGE_KEY];
            return {
                body: {
                    data: {
                        meta_title: article[NEWS_COLUMNS.METADATA_TITLE],
                        meta_description:
                            article[NEWS_COLUMNS.METADATA_DESCRIPTION],
                        cover_image_url: imageKey
                            ? new URL(
                                  imageKey,
                                  process.env.NEXT_PUBLIC_ASSET_URL
                              ).toString()
                            : null,
                        published_at: article[NEWS_COLUMNS.PUBLISHED_AT]!,
                    },
                },
            };
        }),

    getContactUs: publicBase
        .route({
            method: "GET",
            path: "/getContactUs",
            summary: "Fetch contact us information",
            description: "Get contact us information",
            outputStructure: "detailed",
        })
        .output(
            z.object({
                body: CONTACT_US_BODY_OUTPUT_SCHEMA,
            })
        )
        .handler(async function ({ context: { env } }) {
            const kv = env.DJAVACOAL_KV;

            const [
                contact_email,
                contact_phone_number,
                contact_address_line,
                facebook_link,
                linkedin_link,
                instagram_link,
                tiktok_link,
            ] = await Promise.all([
                kv.get(KV_KEYS.EMAIL_ADDRESS),
                kv.get(KV_KEYS.WHATSAPP_NUMBER),
                kv.get(KV_KEYS.ADDRESS_LINE),
                kv.get(KV_KEYS.FACEBOOK_LINK),
                kv.get(KV_KEYS.LINKEDIN_LINK),
                kv.get(KV_KEYS.INSTAGRAM_LINK),
                kv.get(KV_KEYS.TIKTOK_LINK),
            ]);

            return {
                body: {
                    data: {
                        contact_address_line,
                        contact_email,
                        contact_phone_number,
                        facebook_link,
                        linkedin_link,
                        instagram_link,
                        tiktok_link,
                    },
                },
            };
        }),
};

export type PublicAPIRouter = typeof router;
