"use client";

import {
    Box,
    Button,
    Container,
    Group,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPhoto } from "@tabler/icons-react";

import {
    CreatePageMetadataDrawer,
    DefaultOgImagesModal,
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

    // Default OG Images modal state
    const [
        ogImagesModalOpened,
        { open: openOgImagesModal, close: closeOgImagesModal },
    ] = useDisclosure(false);

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
                <Group justify="space-between" align="flex-start">
                    <Box>
                        <Title order={2}>Static Page Metadata Settings</Title>
                        <Text size="sm" c="dimmed">
                            Manage metadata for static pages
                        </Text>
                    </Box>
                    <Button
                        leftSection={<IconPhoto size={18} />}
                        variant="light"
                        onClick={openOgImagesModal}
                    >
                        Default OG Images
                    </Button>
                </Group>

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

                {/* Default OG Images Modal */}
                <DefaultOgImagesModal
                    opened={ogImagesModalOpened}
                    onClose={closeOgImagesModal}
                />
            </Stack>
        </Container>
    );
}
