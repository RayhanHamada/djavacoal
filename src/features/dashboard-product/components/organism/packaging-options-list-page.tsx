"use client";

import Link from "next/link";

import {
    Box,
    Button,
    Container,
    Group,
    Modal,
    Pagination,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

import {
    usePackagingOptionMutations,
    usePackagingOptionsList,
} from "../../hooks";
import { PackagingOptionsGrid } from "../molecules";

export function PackagingOptionsListPage() {
    const t = useTranslations("PackagingOptions");

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
                        <Title order={2}>{t("title")}</Title>
                        <Text c="dimmed">{t("subtitle")}</Text>
                    </div>
                    <Button
                        component={Link}
                        href="/dashboard/products/packaging-options/create"
                        leftSection={<IconPlus size={16} />}
                    >
                        {t("createButton")}
                    </Button>
                </Group>

                <TextInput
                    placeholder={t("searchPlaceholder")}
                    leftSection={<IconSearch size={16} />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {isLoading ? (
                    <Text ta="center" c="dimmed">
                        Loading...
                    </Text>
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
                        {search ? t("noResults") : t("noOptions")}
                    </Text>
                )}
            </Stack>

            <Modal
                opened={deleteId !== null}
                onClose={closeDeleteModal}
                title={t("deleteModal.title")}
            >
                <Stack gap="md">
                    <Text>
                        {t("deleteModal.message", {
                            name: deleteOption?.en_name || "",
                        })}
                    </Text>
                    <Group justify="flex-end">
                        <Button variant="default" onClick={closeDeleteModal}>
                            {t("deleteModal.cancel")}
                        </Button>
                        <Button
                            color="red"
                            onClick={confirmDelete}
                            loading={deleteMutation.isPending}
                        >
                            {t("deleteModal.button")}
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
}
