"use client";

import { useState } from "react";

export interface Photo {
    id: string;
    name: string;
}

export interface PhotoWithUrl extends Photo {
    url: string;
}

/**
 * Manages all modal states for gallery operations
 */
export function useGalleryModals() {
    const [uploadModalOpened, setUploadModalOpened] = useState(false);
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const [renameModalOpened, setRenameModalOpened] = useState(false);
    const [photoToRename, setPhotoToRename] = useState<Photo | null>(null);
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);
    const [bulkDeleteModalOpened, setBulkDeleteModalOpened] = useState(false);
    const [previewModalOpened, setPreviewModalOpened] = useState(false);
    const [photoToPreview, setPhotoToPreview] = useState<PhotoWithUrl | null>(
        null
    );

    const openUploadModal = (files: File[]) => {
        setFilesToUpload(files);
        setUploadModalOpened(true);
    };

    const closeUploadModal = () => {
        setUploadModalOpened(false);
        setFilesToUpload([]);
    };

    const openRenameModal = (photo: Photo) => {
        setPhotoToRename(photo);
        setRenameModalOpened(true);
    };

    const closeRenameModal = () => {
        setRenameModalOpened(false);
        setPhotoToRename(null);
    };

    const openDeleteModal = (photo: Photo) => {
        setPhotoToDelete(photo);
        setDeleteModalOpened(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpened(false);
        setPhotoToDelete(null);
    };

    const openBulkDeleteModal = () => {
        setBulkDeleteModalOpened(true);
    };

    const closeBulkDeleteModal = () => {
        setBulkDeleteModalOpened(false);
    };

    const openPreviewModal = (photo: PhotoWithUrl) => {
        setPhotoToPreview(photo);
        setPreviewModalOpened(true);
    };

    const closePreviewModal = () => {
        setPreviewModalOpened(false);
        setPhotoToPreview(null);
    };

    return {
        // Upload
        uploadModalOpened,
        filesToUpload,
        openUploadModal,
        closeUploadModal,
        // Rename
        renameModalOpened,
        photoToRename,
        openRenameModal,
        closeRenameModal,
        // Delete
        deleteModalOpened,
        photoToDelete,
        openDeleteModal,
        closeDeleteModal,
        // Bulk Delete
        bulkDeleteModalOpened,
        openBulkDeleteModal,
        closeBulkDeleteModal,
        // Preview
        previewModalOpened,
        photoToPreview,
        openPreviewModal,
        closePreviewModal,
    };
}
