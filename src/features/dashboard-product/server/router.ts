import "server-only";

import {
    createPackagingOption,
    createProduct,
    deletePackagingOption,
    deleteProduct,
    generateImageUploadUrl,
    generateProductUploadUrl,
    getPackagingOptionById,
    getPackagingOptionCount,
    getProductById,
    getProductCount,
    listPackagingOptions,
    listProducts,
    reorderProducts,
    toggleProductVisibility,
    updatePackagingOption,
    updateProduct,
} from "./functions";

export const router = {
    // Packaging options
    listPackagingOptions,
    getPackagingOptionById,
    getPackagingOptionCount,
    createPackagingOption,
    updatePackagingOption,
    deletePackagingOption,
    generateImageUploadUrl,

    // Products
    listProducts,
    getProductById,
    getProductCount,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductVisibility,
    reorderProducts,
    generateProductUploadUrl,
};
