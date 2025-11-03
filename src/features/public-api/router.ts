import { COMMON_COLUMNS, PRODUCT_COLUMNS } from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { KV_KEYS } from "@/adapters/kv/constants";
import { COOKIE_NAME, LOCALES } from "@/configs";
import {
    FOOTER_CONTENT_OUTPUT_SCHEMA,
    LIST_PRODUCT_NAME_INPUT_SCHEMA,
    LIST_PRODUCT_NAME_OUTPUT_SCHEMA,
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
        .input(LIST_PRODUCT_NAME_INPUT_SCHEMA)
        .output(LIST_PRODUCT_NAME_OUTPUT_SCHEMA)
        .handler(async function ({
            context: { env, cookies },
            input: { query },
        }) {
            const locale = cookies.get(COOKIE_NAME.LOCALE);
            const isArabic = locale?.value === LOCALES.AR;

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
        .output(FOOTER_CONTENT_OUTPUT_SCHEMA)
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
                        products: [],
                    },
                },
            };
        }),
};

export type PublicAPIRouter = typeof router;
