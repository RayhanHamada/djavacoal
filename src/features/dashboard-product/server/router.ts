import "server-only";

import {
    createPackagingOption,
    deletePackagingOption,
    generateImageUploadUrl,
    getPackagingOptionById,
    listPackagingOptions,
    updatePackagingOption,
} from "./functions";
import {
    createProduct,
    deleteProduct,
    generateProductUploadUrl,
    getProductById,
    listProducts,
    reorderProducts,
    toggleProductVisibility,
    updateProduct,
} from "./product-functions";

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
