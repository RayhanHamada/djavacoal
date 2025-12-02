import { cache } from "react";

import { getCloudflareContext } from "@opennextjs/cloudflare";

import {
    COMMON_COLUMNS,
    PRODUCT_COLUMNS,
    PRODUCT_MEDIA_COLUMNS,
} from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { MEDIA_TYPE_ENUM } from "@/features/dashboard-product";

export const getProductMetadata = cache(async (productId: number) => {
    const { env } = await getCloudflareContext({ async: true });
    const db = getDB(env.DJAVACOAL_DB);

    const product = await db.query.products.findFirst({
        columns: {
            id: true,
            en_name: true,
            metadata_description: true,
            metadata_keywords: true,
        },
        where(fields, operators) {
            return operators.and(
                ...[
                    operators.eq(fields[COMMON_COLUMNS.ID], productId),
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
