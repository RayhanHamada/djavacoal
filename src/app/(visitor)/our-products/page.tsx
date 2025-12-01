import { redirect } from "next/navigation";

import { getCloudflareContext } from "@opennextjs/cloudflare";

import { COMMON_COLUMNS, PRODUCT_COLUMNS } from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";

export default async function OurProductsPage() {
    const { env } = await getCloudflareContext({ async: true });
    const db = getDB(env.DJAVACOAL_DB);

    // Fetch first visible product ordered by order_index
    const firstProduct = await db.query.products.findFirst({
        columns: {
            [COMMON_COLUMNS.ID]: true,
        },
        orderBy(products, { asc }) {
            return [asc(products[PRODUCT_COLUMNS.ORDER_INDEX])];
        },
        where(fields, operators) {
            return operators.eq(fields[PRODUCT_COLUMNS.IS_HIDDEN], false);
        },
    });

    if (firstProduct) {
        redirect(`/our-products/${firstProduct[COMMON_COLUMNS.ID]}`);
    }

    // Fallback to brand page if no products available
    redirect("/our-products/djavacoal-brand");
}
