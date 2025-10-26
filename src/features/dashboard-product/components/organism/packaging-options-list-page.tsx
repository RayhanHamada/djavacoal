"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { PackagingOptionsGrid } from "@/features/dashboard-product/components";
import { rpc } from "@/lib/rpc";

export function PackagingOptionsListPage() {
    const t = useTranslations("PackagingOptions");
    const router = useRouter();
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebouncedValue(search, 300);
    const [page, setPage] = useState(1);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data, isLoading } = useQuery(
        rpc.dashboardProduct.listPackagingOptions.queryOptions({
            input: {
                search: debouncedSearch,
                page,
                limit: 20,
            },
        })
    );

    const deleteMutation = useMutation(
        rpc.dashboardProduct.deletePackagingOption.mutationOptions({
            onSettled: () => {
                // Invalidate both list and individual queries
                queryClient.invalidateQueries({
                    queryKey: rpc.dashboardProduct.listPackagingOptions.key(),
                });
                queryClient.invalidateQueries({
                    queryKey: rpc.dashboardProduct.getPackagingOptionById.key(),
                });
            },
            onSuccess: () => {
                notifications.show({
                    title: t("deleteModal.success"),
                    message: "",
                    color: "green",
                });
                setDeleteId(null);
            },
            onError: () => {
                notifications.show({
                    title: t("deleteModal.error"),
                    message: "",
                    color: "red",
                });
            },
        })
    );

    function handleEdit(id: number) {
        router.push(`/dashboard/products/packaging-options/${id}/edit`);
    }

    function handleDelete(id: number) {
        setDeleteId(id);
    }

    function confirmDelete() {
        if (deleteId) {
            deleteMutation.mutate({ id: deleteId });
        }
    }

    const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0;
    const deleteOption = data?.packagingOptions.find(
        (opt) => opt.id === deleteId
    );

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
                onClose={() => setDeleteId(null)}
                title={t("deleteModal.title")}
            >
                <Stack gap="md">
                    <Text>
                        {t("deleteModal.message", {
                            name: deleteOption?.en_name || "",
                        })}
                    </Text>
                    <Group justify="flex-end">
                        <Button
                            variant="default"
                            onClick={() => setDeleteId(null)}
                        >
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
