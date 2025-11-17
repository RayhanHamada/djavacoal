import { useState, useEffect } from "react";

import {
    useListProductNamesAPI,
    useProductDetailAPI,
} from "@/features/public-api/hooks";

/**
 * Hook to manage product listing and selection
 * Provides products list, selected product details, and selection handlers
 */
export function useProducts() {
    const [selectedProductId, setSelectedProductId] = useState<number>();

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

    // Set first product as default when products are loaded
    useEffect(() => {
        if (productListData?.data?.names?.length && !selectedProductId) {
            setSelectedProductId(productListData.data.names.at(0)?.id);
        }
    }, [productListData, selectedProductId]);

    const handleProductSelect = (productId: number) => {
        setSelectedProductId(productId);
    };

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

        // Actions
        handleProductSelect,

        // Computed states
        hasProducts: Boolean(productListData?.data?.names?.length),
        isReady:
            !isLoadingProducts && Boolean(productListData?.data?.names?.length),
    };
}
