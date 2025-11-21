"use client";

import {
    Box,
    Center,
    Container,
    Pagination,
    Stack,
    Text,
    Title,
} from "@mantine/core";

import {
    GalleryControls,
    GalleryModals,
    PhotoGrid,
} from "@/features/dashboard-gallery/components/organisms";
import {
    useDragAndDrop,
    useGalleryData,
    useGalleryModals,
    useGalleryState,
} from "@/features/dashboard-gallery/hooks";

/**
 * Main Gallery Page Component
 * Features: photo grid, search, sort, pagination, upload, rename, delete
 */
export default function GalleryPage() {
    // State management via custom hooks
    const galleryState = useGalleryState();
    const modals = useGalleryModals();

    // Data fetching
    const { photosQuery, photos, totalPages, handleRefresh } = useGalleryData({
        search: galleryState.search,
        page: galleryState.page,
        sortBy: galleryState.sortBy,
        sortOrder: galleryState.sortOrder,
    });

    // Drag and drop
    const dragAndDrop = useDragAndDrop((files) => {
        modals.openUploadModal(files);
    });

    // Success handler for all mutations
    const handleSuccess = () => {
        handleRefresh();
        galleryState.clearSelection();
    };

    return (
        <Container size="xl" p="xl" pb={96}>
            <Stack gap="lg">
                {/* Header */}
                <Box>
                    <Title order={2}>Photo Gallery</Title>
                    <Text size="sm" c="dimmed">
                        Manage your photo assets
                    </Text>
                </Box>

                {/* Controls */}
                <GalleryControls
                    search={galleryState.search}
                    onSearchChange={galleryState.setSearch}
                    onSearchSubmit={() => galleryState.setPage(1)}
                    sortBy={galleryState.sortBy}
                    sortOrder={galleryState.sortOrder}
                    onSortByName={galleryState.handleSortByName}
                    onSortByDate={galleryState.handleSortByDate}
                    isRefetching={photosQuery.isRefetching}
                    onRefresh={handleRefresh}
                    onManualUpload={modals.openUploadModal}
                    selectedCount={galleryState.selectedPhotoIds.size}
                    onBulkDelete={modals.openBulkDeleteModal}
                    onCancelSelection={galleryState.clearSelection}
                />

                {/* Photo Grid */}
                <PhotoGrid
                    isLoading={photosQuery.isLoading}
                    isError={photosQuery.isError}
                    photos={photos}
                    search={galleryState.search}
                    selectedPhotoIds={galleryState.selectedPhotoIds}
                    isDragOver={dragAndDrop.isDragOver}
                    onDrop={dragAndDrop.handleDrop}
                    onDragOver={dragAndDrop.handleDragOver}
                    onDragLeave={dragAndDrop.handleDragLeave}
                    onPhotoToggle={galleryState.togglePhotoSelection}
                    onPhotoRename={modals.openRenameModal}
                    onPhotoDelete={modals.openDeleteModal}
                    onPhotoPreview={modals.openPreviewModal}
                    onRefresh={handleRefresh}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <Center>
                        <Pagination
                            total={totalPages}
                            value={galleryState.page}
                            onChange={galleryState.handlePageChange}
                        />
                    </Center>
                )}
            </Stack>

            {/* All Modals */}
            <GalleryModals
                uploadModalOpened={modals.uploadModalOpened}
                onCloseUpload={modals.closeUploadModal}
                filesToUpload={modals.filesToUpload}
                renameModalOpened={modals.renameModalOpened}
                onCloseRename={modals.closeRenameModal}
                photoToRename={modals.photoToRename}
                deleteModalOpened={modals.deleteModalOpened}
                onCloseDelete={modals.closeDeleteModal}
                photoToDelete={modals.photoToDelete}
                bulkDeleteModalOpened={modals.bulkDeleteModalOpened}
                onCloseBulkDelete={modals.closeBulkDeleteModal}
                selectedPhotoIds={Array.from(galleryState.selectedPhotoIds)}
                previewModalOpened={modals.previewModalOpened}
                onClosePreview={modals.closePreviewModal}
                photoToPreview={modals.photoToPreview}
                onSuccess={handleSuccess}
            />
        </Container>
    );
}
