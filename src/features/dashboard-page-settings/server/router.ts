import {
    createPageMetadata,
    deleteDefaultOgImage,
    deletePageMetadata,
    generateDefaultOgImageUploadUrl,
    generateOgImageUploadUrl,
    getAllDefaultOgImages,
    getDefaultOgImage,
    getPageMetadataById,
    listPageMetadata,
    saveDefaultOgImage,
    updatePageMetadata,
} from "./functions";

export const router = {
    listPageMetadata,
    getPageMetadataById,
    createPageMetadata,
    updatePageMetadata,
    deletePageMetadata,
    generateOgImageUploadUrl,
    // Default OG Images
    generateDefaultOgImageUploadUrl,
    saveDefaultOgImage,
    getDefaultOgImage,
    getAllDefaultOgImages,
    deleteDefaultOgImage,
};
