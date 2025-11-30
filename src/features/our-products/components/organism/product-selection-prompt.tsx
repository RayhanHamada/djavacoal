"use client";

import { useTranslations } from "next-intl";

import { useProductsContext } from "@/features/our-products/hooks/use-products-context";

/**
 * Prompt shown when no product is selected.
 * Displays on the /our-products page (without product ID).
 */
export function ProductSelectionPrompt() {
    const t = useTranslations("OurProducts");
    const { isLoadingProducts, hasProducts } = useProductsContext();

    if (isLoadingProducts) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-white">{t("loading.products")}</div>
            </div>
        );
    }

    if (!hasProducts) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-white">{t("noProducts")}</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center text-white">
                <p className="text-lg">{t("selectProductPrompt")}</p>
            </div>
        </div>
    );
}
