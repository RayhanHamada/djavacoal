"use client";

import { createContext, useContext, type ReactNode } from "react";

import { usePathname } from "next/navigation";

import { useListProductNamesAPI } from "@/features/public-api/hooks";

/** Route path for Djavacoal Brands page */
export const DJAVACOAL_BRANDS_PATH = "/our-products/djavacoal-brand";

/** Base path for products */
export const PRODUCTS_BASE_PATH = "/our-products";

type Product = {
    id: number;
    name: string;
    slug: string;
};

interface ProductsContextValue {
    /** List of products from API */
    products: Product[];
    /** Whether the products list is loading */
    isLoadingProducts: boolean;
    /** Error from fetching products list */
    productListError: Error | null;

    /** ID of the currently viewed product (from URL) */
    currentProductId: number | undefined;

    /** Whether we're on the brand page route */
    isBrandPage: boolean;

    /** Whether there are products available */
    hasProducts: boolean;
    /** Whether the context is ready (products loaded) */
    isReady: boolean;

    /** Get the URL for a product */
    getProductUrl: (productId: number) => string;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

/**
 * Provider component for product list state.
 * Wraps the our-products layout to share state between sidebar and content.
 */
export function ProductsProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    // Check if we're on the brand page
    const isBrandPage = pathname === DJAVACOAL_BRANDS_PATH;

    // Extract product ID from URL path (e.g., /our-products/123 -> 123)
    const currentProductId = extractProductIdFromPath(pathname);

    // Fetch product list
    const {
        data: productListData,
        isLoading: isLoadingProducts,
        error: productListError,
    } = useListProductNamesAPI();

    const getProductUrl = (productId: number) =>
        `${PRODUCTS_BASE_PATH}/${productId}`;

    const value: ProductsContextValue = {
        products: productListData?.data?.names ?? [],
        isLoadingProducts,
        productListError: productListError as Error | null,

        currentProductId,
        isBrandPage,

        hasProducts: Boolean(productListData?.data?.names?.length),
        isReady:
            !isLoadingProducts && Boolean(productListData?.data?.names?.length),

        getProductUrl,
    };

    return (
        <ProductsContext.Provider value={value}>
            {children}
        </ProductsContext.Provider>
    );
}

/**
 * Extract product ID from pathname like /our-products/123
 */
function extractProductIdFromPath(pathname: string): number | undefined {
    const match = pathname.match(/^\/our-products\/(\d+)$/);
    if (match) {
        return parseInt(match[1], 10);
    }
    return undefined;
}

/**
 * Hook to access product list state from context.
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
