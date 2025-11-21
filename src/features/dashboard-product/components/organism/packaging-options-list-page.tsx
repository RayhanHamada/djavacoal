"use client";

import Link from "next/link";

import {
    Box,
    Button,
    Container,
    Group,
    Modal,
    Pagination,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";

import {
    usePackagingOptionMutations,
    usePackagingOptionsList,
} from "../../hooks";
import { PackagingOptionsGrid } from "../molecules";
import { PackagingOptionCardSkeleton } from "../packaging-option-card-skeleton";

export function PackagingOptionsListPage() {
    const {
        search,
        setSearch,
        page,
        setPage,
        deleteId,
        data,
        isLoading,
        totalPages,
        deleteOption,
        handleEdit,
        handleDelete,
        closeDeleteModal,
    } = usePackagingOptionsList();

    const { deleteMutation } = usePackagingOptionMutations();

    const confirmDelete = () => {
        if (deleteId) {
            deleteMutation.mutate(
                { id: deleteId },
                {
                    onSuccess: () => {
                        closeDeleteModal();
                    },
                }
            );
        }
    };

    return (
        <Container size="xl" py="xl">
            <Stack gap="lg">
                <Group justify="space-between">
                    <div>
                        <Title order={2}>Packaging Options</Title>
                        <Text c="dimmed">
                            Manage packaging options for products
                        </Text>
                    </div>
                    <Button
                        component={Link}
                        href="/dashboard/products/packaging-options/create"
                        leftSection={<IconPlus size={16} />}
                    >
                        Create New
                    </Button>
                </Group>

                <TextInput
                    placeholder="Search packaging options..."
                    leftSection={<IconSearch size={16} />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {isLoading ? (
                    <SimpleGrid
                        cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
                        spacing="lg"
                    >
                        {Array.from({ length: 8 }).map((_, i) => (
                            <PackagingOptionCardSkeleton key={i} />
                        ))}
                    </SimpleGrid>
                ) : data && data.packagingOptions.length > 0 ? (
                    <>
                        <PackagingOptionsGrid
                            options={data.packagingOptions}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            assetUrl={process.env.NEXT_PUBLIC_ASSET_URL || ""}
                        />

                        {totalPages > 1 && (
                            <Box mt="md">
                                <Pagination
                                    total={totalPages}
                                    value={page}
                                    onChange={setPage}
                                />
                            </Box>
                        )}
                    </>
                ) : (
                    <Text ta="center" c="dimmed" mt="xl">
                        {search
                            ? "No packaging options found"
                            : "No packaging options yet"}
                    </Text>
                )}
            </Stack>

            <Modal
                opened={deleteId !== null}
                onClose={closeDeleteModal}
                title="Delete Packaging Option"
            >
                <Stack gap="md">
                    <Text>
                        Are you sure you want to delete &quot;
                        {deleteOption?.en_name || ""}&quot;? This action cannot
                        be undone.
                    </Text>
                    <Group justify="flex-end">
                        <Button variant="default" onClick={closeDeleteModal}>
                            Cancel
                        </Button>
                        <Button
                            color="red"
                            onClick={confirmDelete}
                            loading={deleteMutation.isPending}
                        >
                            Delete
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
}
