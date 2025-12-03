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

    /** Slug of the currently viewed product (from URL) */
    currentProductSlug: string | undefined;
    /** ID of the currently viewed product (derived from slug match) */
    currentProductId: number | undefined;

    /** Whether we're on the brand page route */
    isBrandPage: boolean;

    /** Whether there are products available */
    hasProducts: boolean;
    /** Whether the context is ready (products loaded) */
    isReady: boolean;

    /** Get the URL for a product */
    getProductUrl: (slug: string) => string;
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

    // Extract product slug from URL path (e.g., /our-products/premium-coal -> premium-coal)
    const currentProductSlug = extractProductSlugFromPath(pathname);

    // Fetch product list
    const {
        data: productListData,
        isLoading: isLoadingProducts,
        error: productListError,
    } = useListProductNamesAPI();

    const products = productListData?.data?.names ?? [];

    // Find current product ID from slug
    const currentProductId = products.find(
        (p) => p.slug === currentProductSlug
    )?.id;

    const getProductUrl = (slug: string) => `${PRODUCTS_BASE_PATH}/${slug}`;

    const value: ProductsContextValue = {
        products,
        isLoadingProducts,
        productListError: productListError as Error | null,

        currentProductSlug,
        currentProductId,
        isBrandPage,

        hasProducts: Boolean(products.length),
        isReady: !isLoadingProducts && Boolean(products.length),

        getProductUrl,
    };

    return (
        <ProductsContext.Provider value={value}>
            {children}
        </ProductsContext.Provider>
    );
}

/**
 * Extract product slug from pathname like /our-products/premium-coal
 */
function extractProductSlugFromPath(pathname: string): string | undefined {
    const match = pathname.match(/^\/our-products\/([^/]+)$/);
    if (match && match[1] !== "djavacoal-brand") {
        return match[1];
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
