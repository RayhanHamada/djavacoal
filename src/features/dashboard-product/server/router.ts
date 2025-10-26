import "server-only";

import {
    createPackagingOption,
    deletePackagingOption,
    generateImageUploadUrl,
    getPackagingOptionById,
    listPackagingOptions,
    updatePackagingOption,
} from "./functions";

export const dashboardProduct = {
    listPackagingOptions,
    getPackagingOptionById,
    createPackagingOption,
    updatePackagingOption,
    deletePackagingOption,
    generateImageUploadUrl,
};
