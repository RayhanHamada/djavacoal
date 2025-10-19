import "server-only";

import {
    bulkCreateTags,
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
    togglePublish,
    checkSlugAvailability,
    generateImageUploadUrl,
    listTags,
    createTag,
    bulkCreateTags,
};
