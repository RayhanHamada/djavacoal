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
    listTags,
    createTag,
    bulkCreateTags,
};
