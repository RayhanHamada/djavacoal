import {
    createPageMetadata,
    deletePageMetadata,
    getPageMetadataById,
    listPageMetadata,
    updatePageMetadata,
} from "./functions";
import * as teamMembers from "./team-members/router";

export const router = {
    listPageMetadata,
    getPageMetadataById,
    createPageMetadata,
    updatePageMetadata,
    deletePageMetadata,
    ...teamMembers,
};
