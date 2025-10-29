import {
    createPageMetadata,
    deletePageMetadata,
    getPageMetadataById,
    listPageMetadata,
    updatePageMetadata,
} from "./functions";

export const router = {
    listPageMetadata,
    getPageMetadataById,
    createPageMetadata,
    updatePageMetadata,
    deletePageMetadata,
};
