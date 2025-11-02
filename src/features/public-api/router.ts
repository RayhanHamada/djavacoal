import { COMMON_COLUMNS, PRODUCT_COLUMNS } from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { COOKIE_NAME, LOCALES } from "@/configs";
import {
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
                        names: names.map((item) => ({
                            id: item.id,
                            name: item[
                                isArabic
                                    ? PRODUCT_COLUMNS.AR_NAME
                                    : PRODUCT_COLUMNS.EN_NAME
                            ],
                        })),
                        meta: {
                            total: names.length,
                        },
                    },
                },
            };
        }),
};

export type PublicAPIRouter = typeof router;
