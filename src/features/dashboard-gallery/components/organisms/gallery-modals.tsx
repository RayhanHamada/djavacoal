"use client";

import type { Photo, PhotoWithUrl } from "../../hooks";

import {
    BulkDeleteModal,
    DeleteModal,
    PhotoPreviewModal,
    RenameModal,
    UploadModal,
} from "../molecules";

interface GalleryModalsProps {
    // Upload
    uploadModalOpened: boolean;
    onCloseUpload: () => void;
    filesToUpload: File[];
    // Rename
    renameModalOpened: boolean;
    onCloseRename: () => void;
    photoToRename: Photo | null;
    // Delete
    deleteModalOpened: boolean;
    onCloseDelete: () => void;
    photoToDelete: Photo | null;
    // Bulk Delete
    bulkDeleteModalOpened: boolean;
    onCloseBulkDelete: () => void;
    selectedPhotoIds: string[];
    // Preview
    previewModalOpened: boolean;
    onClosePreview: () => void;
    photoToPreview: PhotoWithUrl | null;
    // Success callback
    onSuccess: () => void;
}

/**
 * All gallery modals grouped together
 */
export function GalleryModals({
    uploadModalOpened,
    onCloseUpload,
    filesToUpload,
    renameModalOpened,
    onCloseRename,
    photoToRename,
    deleteModalOpened,
    onCloseDelete,
    photoToDelete,
    bulkDeleteModalOpened,
    onCloseBulkDelete,
    selectedPhotoIds,
    previewModalOpened,
    onClosePreview,
    photoToPreview,
    onSuccess,
}: GalleryModalsProps) {
    return (
        <>
            <UploadModal
                opened={uploadModalOpened}
                onClose={onCloseUpload}
                files={filesToUpload}
                onSuccess={onSuccess}
            />

            <RenameModal
                opened={renameModalOpened}
                onClose={onCloseRename}
                photo={photoToRename}
                onSuccess={onSuccess}
            />

            <DeleteModal
                opened={deleteModalOpened}
                onClose={onCloseDelete}
                photo={photoToDelete}
                onSuccess={onSuccess}
            />

            <BulkDeleteModal
                opened={bulkDeleteModalOpened}
                onClose={onCloseBulkDelete}
                photoIds={selectedPhotoIds}
                onSuccess={onSuccess}
            />

            <PhotoPreviewModal
                opened={previewModalOpened}
                onClose={onClosePreview}
                name={photoToPreview?.name ?? ""}
                url={photoToPreview?.url ?? ""}
            />
        </>
    );
}
