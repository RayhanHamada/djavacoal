"use client";

import { Box, Container, Stack, Text, Title } from "@mantine/core";

import {
    CreatePageMetadataDrawer,
    DeletePageMetadataModal,
    EditPageMetadataDrawer,
} from "@/features/dashboard-page-settings/components/molecules";
import { PageMetadataTable } from "@/features/dashboard-page-settings/components/organisms";
import {
    usePageMetadataData,
    usePageMetadataModals,
    usePageMetadataTable,
} from "@/features/dashboard-page-settings/hooks";

/**
 * Example page demonstrating the Page Metadata feature
 * This component can be used in /dashboard/page-settings/seo-metadata route
 */
export function PageSettingsPage() {
    // Table state (pagination and search)
    const { page, search, handlePageChange, handleSearchChange } =
        usePageMetadataTable();

    // Data fetching
    const { items, totalPages, handleRefresh, pageMetadataQuery } =
        usePageMetadataData({
            search,
            page,
            limit: 20,
        });

    // Modal state management
    const {
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
    } = usePageMetadataModals();

    // Handlers
    const handleEdit = (id: number) => {
        const item = items.find((i) => i.id === id);
        if (item) {
            openEditModal(id, item.path);
        }
    };

    const handleDelete = (id: number) => {
        const item = items.find((i) => i.id === id);
        if (item) {
            openDeleteModal(id, item.path);
        }
    };

    const handleSuccess = () => {
        handleRefresh();
    };

    return (
        <Container size="xl" p="xl" pb={96}>
            <Stack gap="lg">
                {/* Header */}
                <Box>
                    <Title order={2}>Page SEO Metadata Settings</Title>
                    <Text size="sm" c="dimmed">
                        Manage SEO metadata for static pages
                    </Text>
                </Box>

                {/* Table */}
                <PageMetadataTable
                    items={items}
                    isLoading={pageMetadataQuery.isLoading}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    search={search}
                    onSearchChange={handleSearchChange}
                    onRefresh={handleRefresh}
                    isRefetching={pageMetadataQuery.isRefetching}
                    onCreate={openCreateModal}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* Create Drawer */}
                <CreatePageMetadataDrawer
                    opened={createModalOpened}
                    onClose={closeCreateModal}
                    onSuccess={handleSuccess}
                />

                {/* Edit Drawer */}
                <EditPageMetadataDrawer
                    opened={editModalOpened}
                    onClose={closeEditModal}
                    pageMetadataId={selectedPageMetadata?.id ?? null}
                    onSuccess={handleSuccess}
                />

                {/* Delete Modal */}
                <DeletePageMetadataModal
                    opened={deleteModalOpened}
                    onClose={closeDeleteModal}
                    pageMetadata={selectedPageMetadata}
                    onSuccess={handleSuccess}
                />
            </Stack>
        </Container>
    );
}
