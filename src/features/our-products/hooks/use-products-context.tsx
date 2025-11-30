"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
    useListProductNamesAPI,
    useProductDetailAPI,
} from "@/features/public-api/hooks";

/** Query parameter name for product selection */
export const PRODUCT_QUERY_PARAM = "product";

/** Route path for Djavacoal Brands page */
export const DJAVACOAL_BRANDS_PATH = "/our-products/djavacoal-brand";

type Product = {
    id: number;
    name: string;
    slug: string;
};

type ProductDetail = NonNullable<
    ReturnType<typeof useProductDetailAPI>["data"]
>["data"];

interface ProductsContextValue {
    /** List of products from API */
    products: Product[];
    /** Whether the products list is loading */
    isLoadingProducts: boolean;
    /** Error from fetching products list */
    productListError: Error | null;

    /** Selected product details */
    selectedProduct: ProductDetail | undefined;
    /** ID of the selected product */
    selectedProductId: number | undefined;
    /** Whether product details are loading */
    isLoadingDetail: boolean;
    /** Error from fetching product details */
    productDetailError: Error | null;

    /** Whether we're on the brand page route */
    isBrandPage: boolean;

    /** Handler to select a product by ID */
    handleProductSelect: (productId: number) => void;

    /** Whether there are products available */
    hasProducts: boolean;
    /** Whether the context is ready (products loaded) */
    isReady: boolean;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

/**
 * Provider component for product selection state.
 * Wraps the our-products layout to share state between sidebar and content.
 */
export function ProductsProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const productSlugFromUrl = searchParams.get(PRODUCT_QUERY_PARAM);

    const [selectedProductId, setSelectedProductId] = useState<number>();

    // Check if we're on the brand page
    const isBrandPage = pathname === DJAVACOAL_BRANDS_PATH;

    // Fetch product list
    const {
        data: productListData,
        isLoading: isLoadingProducts,
        error: productListError,
    } = useListProductNamesAPI();

    // Fetch selected product details (only when not on brand page)
    const {
        data: productDetailData,
        isLoading: isLoadingDetail,
        error: productDetailError,
    } = useProductDetailAPI(isBrandPage ? 0 : (selectedProductId ?? 0));

    // Initialize selection based on URL param or default to first product
    useEffect(() => {
        // Skip initialization if on brand page
        if (isBrandPage) return;
        if (!productListData?.data?.names?.length) return;

        const products = productListData.data.names;

        // If URL has a product param, find and select that product
        if (productSlugFromUrl) {
            const productFromUrl = products.find(
                (p) => p.slug === productSlugFromUrl
            );
            if (productFromUrl) {
                setSelectedProductId(productFromUrl.id);
                return;
            }
        }

        // Default to first product if no valid URL param
        if (!selectedProductId) {
            setSelectedProductId(products.at(0)?.id);
        }
    }, [productListData, productSlugFromUrl, selectedProductId, isBrandPage]);

    // Handle product selection - updates URL and state
    const handleProductSelect = useCallback(
        (productId: number) => {
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

    const value: ProductsContextValue = {
        products: productListData?.data?.names ?? [],
        isLoadingProducts,
        productListError: productListError as Error | null,

        selectedProduct: productDetailData?.data,
        selectedProductId,
        isLoadingDetail: Boolean(isLoadingDetail && selectedProductId),
        productDetailError: productDetailError as Error | null,

        isBrandPage,
        handleProductSelect,

        hasProducts: Boolean(productListData?.data?.names?.length),
        isReady:
            !isLoadingProducts && Boolean(productListData?.data?.names?.length),
    };

    return (
        <ProductsContext.Provider value={value}>
            {children}
        </ProductsContext.Provider>
    );
}

/**
 * Hook to access product selection state from context.
 * Must be used within a ProductsProvider.
 */
export function useProductsContext() {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error(
            "useProductsContext must be used within a ProductsProvider"
        );
    }
    return context;
}
