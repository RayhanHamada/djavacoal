import "server-only";

import {
    createPackagingOption,
    deletePackagingOption,
    generateImageUploadUrl,
    getPackagingOptionById,
    listPackagingOptions,
    updatePackagingOption,
} from "./functions";

export const router = {
    // Packaging options
    listPackagingOptions,
    getPackagingOptionById,
    createPackagingOption,
    updatePackagingOption,
    deletePackagingOption,
    generateImageUploadUrl,
};
