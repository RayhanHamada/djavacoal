import { useState, useEffect, useCallback } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import {
    useListProductNamesAPI,
    useProductDetailAPI,
} from "@/features/public-api/hooks";

/** Query parameter name for product selection */
export const PRODUCT_QUERY_PARAM = "product";

/** Special slug value for Djavacoal Brands page */
export const DJAVACOAL_BRANDS_SLUG = "djavacoal-brands";

/**
 * Hook to manage product listing and selection
 * Provides products list, selected product details, and selection handlers
 * Syncs selection state with URL query parameter for deep linking
 */
export function useProducts() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productSlugFromUrl = searchParams.get(PRODUCT_QUERY_PARAM);

    const [selectedProductId, setSelectedProductId] = useState<number>();
    const [isBrandSelected, setIsBrandSelected] = useState(false);

    // Fetch product list
    const {
        data: productListData,
        isLoading: isLoadingProducts,
        error: productListError,
    } = useListProductNamesAPI();

    // Fetch selected product details
    const {
        data: productDetailData,
        isLoading: isLoadingDetail,
        error: productDetailError,
    } = useProductDetailAPI(selectedProductId ?? 0);

    // Initialize selection based on URL param or default to first product
    useEffect(() => {
        if (!productListData?.data?.names?.length) return;

        const products = productListData.data.names;

        // Check if brand page is selected via URL
        if (productSlugFromUrl === DJAVACOAL_BRANDS_SLUG) {
            setIsBrandSelected(true);
            setSelectedProductId(undefined);
            return;
        }

        // If URL has a product param, find and select that product
        if (productSlugFromUrl) {
            const productFromUrl = products.find(
                (p) => p.slug === productSlugFromUrl
            );
            if (productFromUrl) {
                setIsBrandSelected(false);
                setSelectedProductId(productFromUrl.id);
                return;
            }
        }

        // Default to first product if no valid URL param and no selection yet
        if (!selectedProductId && !isBrandSelected) {
            setSelectedProductId(products.at(0)?.id);
        }
    }, [
        productListData,
        productSlugFromUrl,
        selectedProductId,
        isBrandSelected,
    ]);

    // Update URL when selecting a product programmatically
    const handleProductSelect = useCallback(
        (productId: number) => {
            setIsBrandSelected(false);
            setSelectedProductId(productId);

            // Find the product slug and update URL
            const product = productListData?.data?.names?.find(
                (p) => p.id === productId
            );
            if (product) {
                const params = new URLSearchParams(searchParams.toString());
                params.set(PRODUCT_QUERY_PARAM, product.slug);
                router.replace(`/our-products?${params.toString()}`, {
                    scroll: false,
                });
            }
        },
        [productListData, router, searchParams]
    );

    // Handle brand page selection
    const handleBrandSelect = useCallback(() => {
        setIsBrandSelected(true);
        setSelectedProductId(undefined);

        const params = new URLSearchParams(searchParams.toString());
        params.set(PRODUCT_QUERY_PARAM, DJAVACOAL_BRANDS_SLUG);
        router.replace(`/our-products?${params.toString()}`, {
            scroll: false,
        });
    }, [router, searchParams]);

    return {
        // Product list
        products: productListData?.data?.names || [],
        isLoadingProducts,
        productListError,

        // Selected product details
        selectedProduct: productDetailData?.data,
        selectedProductId,
        isLoadingDetail: isLoadingDetail && selectedProductId,
        productDetailError,

        // Brand selection
        isBrandSelected,

        // Actions
        handleProductSelect,
        handleBrandSelect,

        // Computed states
        hasProducts: Boolean(productListData?.data?.names?.length),
        isReady:
            !isLoadingProducts && Boolean(productListData?.data?.names?.length),
    };
}
