"use client";

import { useState } from "react";

/**
 * Hook to manage page metadata modals state
 */
export function usePageMetadataModals() {
    const [createModalOpened, setCreateModalOpened] = useState(false);
    const [editModalOpened, setEditModalOpened] = useState(false);
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [selectedPageMetadata, setSelectedPageMetadata] = useState<{
        id: number;
        path: string;
    } | null>(null);

    const openCreateModal = () => {
        setCreateModalOpened(true);
    };

    const closeCreateModal = () => {
        setCreateModalOpened(false);
    };

    const openEditModal = (id: number, path: string) => {
        setSelectedPageMetadata({ id, path });
        setEditModalOpened(true);
    };

    const closeEditModal = () => {
        setEditModalOpened(false);
        setSelectedPageMetadata(null);
    };

    const openDeleteModal = (id: number, path: string) => {
        setSelectedPageMetadata({ id, path });
        setDeleteModalOpened(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpened(false);
        setSelectedPageMetadata(null);
    };

    return {
        createModalOpened,
        editModalOpened,
        deleteModalOpened,
        selectedPageMetadata,
        openCreateModal,
        closeCreateModal,
        openEditModal,
        closeEditModal,
        openDeleteModal,
        closeDeleteModal,
    };
}
