import "server-only";

import {
    createPackagingOption,
    createProduct,
    deletePackagingOption,
    deleteProduct,
    generateImageUploadUrl,
    generateProductUploadUrl,
    getPackagingOptionById,
    getProductById,
    listPackagingOptions,
    listProducts,
    reorderProducts,
    toggleProductVisibility,
    updatePackagingOption,
    updateProduct,
} from "./functions";

export const dashboardProduct = {
    // Packaging options
    listPackagingOptions,
    getPackagingOptionById,
    createPackagingOption,
    updatePackagingOption,
    deletePackagingOption,
    generateImageUploadUrl,

    // Products
    listProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductVisibility,
    reorderProducts,
    generateProductUploadUrl,
};
