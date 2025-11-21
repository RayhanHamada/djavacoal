import "server-only";

import {
    bulkCreateTags,
    changeStatus,
    checkSlugAvailability,
    createNews,
    createTag,
    deleteNews,
    generateImageUploadUrl,
    getNewsById,
    getNewsCount,
    listNews,
    listTags,
    removeNewsImage,
    togglePublish,
    updateNews,
} from "./functions";

export const router = {
    listNews,
    getNewsById,
    getNewsCount,
    createNews,
    updateNews,
    deleteNews,
    changeStatus,
    togglePublish, // deprecated, kept for backwards compatibility
    checkSlugAvailability,
    generateImageUploadUrl,
    removeNewsImage,
    listTags,
    createTag,
    bulkCreateTags,
};
