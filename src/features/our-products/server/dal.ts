import { cache } from "react";

import { getCloudflareContext } from "@opennextjs/cloudflare";

import {
    PRODUCT_COLUMNS,
    PRODUCT_MEDIA_COLUMNS,
} from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { MEDIA_TYPE_ENUM } from "@/features/dashboard-product";

export const getProductMetadataBySlug = cache(async (slug: string) => {
    const { env } = await getCloudflareContext({ async: true });
    const db = getDB(env.DJAVACOAL_DB);

    const product = await db.query.products.findFirst({
        columns: {
            id: true,
            en_name: true,
            slug: true,
            metadata_description: true,
            metadata_keywords: true,
        },
        where(fields, operators) {
            return operators.and(
                ...[
                    operators.eq(fields[PRODUCT_COLUMNS.SLUG], slug),
                    operators.eq(fields[PRODUCT_COLUMNS.IS_HIDDEN], false),
                ]
            );
        },
        with: {
            medias: {
                where(fields, operators) {
                    return operators.eq(
                        fields[PRODUCT_MEDIA_COLUMNS.MEDIA_TYPE],
                        MEDIA_TYPE_ENUM.IMAGE
                    );
                },
                orderBy(fields, operators) {
                    return [operators.asc(fields[PRODUCT_COLUMNS.ORDER_INDEX])];
                },
                columns: {
                    image_key: true,
                },
                limit: 1,
            },
        },
    });

    return product;
});
