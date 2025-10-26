import {
    bulkDeletePhotos,
    checkNameAvailability,
    confirmUpload,
    createPresignedUrl,
    deletePhoto,
    listPhotos,
    renamePhoto,
} from "@/features/dashboard-gallery/server/functions";

export const router = {
    listPhotos,
    createPresignedUrl,
    confirmUpload,
    renamePhoto,
    deletePhoto,
    bulkDeletePhotos,
    checkNameAvailability,
};
