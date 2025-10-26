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
    listNews,
    listTags,
    togglePublish,
    updateNews,
} from "./functions";

export const dashboardNews = {
    listNews,
    getNewsById,
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
