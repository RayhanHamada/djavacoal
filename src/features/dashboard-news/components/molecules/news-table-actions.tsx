"use client";

import Link from "next/link";

import { ActionIcon, Group, Menu, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
    IconDots,
    IconEye,
    IconPencil,
    IconTrash,
    IconWorld,
    IconWorldOff,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client, rpc } from "@/lib/rpc";

interface NewsTableActionsProps {
    id: number;
    slug: string;
    title: string;
    status: "draft" | "published" | "unpublished";
    onEdit: () => void;
}

/**
 * Action buttons and menu for news table rows
 */
export function NewsTableActions({
    id,
    slug,
    title,
    status,
    onEdit,
}: NewsTableActionsProps) {
    const queryClient = useQueryClient();

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: number) => client.dashboardNews.deleteNews({ id }),
        onSuccess: () => {
            notifications.show({
                title: "Success",
                message: "News article deleted successfully",
                color: "green",
            });
            queryClient.invalidateQueries({
                queryKey: ["dashboardNews", "listNews"],
            });
        },
        onError: (error) => {
            notifications.show({
                title: "Error",
                message:
                    error instanceof Error ? error.message : "Failed to delete",
                color: "red",
            });
        },
    });

    // Change status mutation
    const changeStatusMutation = useMutation({
        mutationFn: ({
            id,
            status,
        }: {
            id: number;
            status: "draft" | "published" | "unpublished";
        }) => client.dashboardNews.changeStatus({ id, status }),
        onSuccess: (_, variables) => {
            const statusMessages = {
                draft: "News article saved as draft",
                published: "News article published",
                unpublished: "News article unpublished",
            };
            notifications.show({
                title: "Success",
                message: statusMessages[variables.status],
                color: "green",
            });
            queryClient.invalidateQueries({
                queryKey: rpc.dashboardNews.listNews.key(),
            });
        },
        onError: (error) => {
            notifications.show({
                title: "Error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to update status",
                color: "red",
            });
        },
    });

    const handleDelete = () => {
        modals.openConfirmModal({
            title: "Delete News Article",
            children: (
                <Text size="sm">
                    Are you sure you want to delete <strong>{title}</strong>?
                    This action cannot be undone and will also delete the
                    content from R2 storage.
                </Text>
            ),
            labels: { confirm: "Delete", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onConfirm: () => deleteMutation.mutate(id),
        });
    };

    const handleChangeStatus = (newStatus: typeof status) => {
        changeStatusMutation.mutate({ id, status: newStatus });
    };

    return (
        <Group gap="xs" wrap="nowrap">
            {/* Edit Button */}
            <ActionIcon variant="subtle" color="blue" onClick={onEdit}>
                <IconPencil size={18} />
            </ActionIcon>

            {/* More Actions Menu */}
            <Menu position="bottom-end" shadow="md">
                <Menu.Target>
                    <ActionIcon variant="subtle">
                        <IconDots size={18} />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    {/* Status transitions based on current status */}
                    {status === "draft" && (
                        <Menu.Item
                            leftSection={<IconWorld size={16} />}
                            onClick={() => handleChangeStatus("published")}
                            disabled={changeStatusMutation.isPending}
                        >
                            Publish
                        </Menu.Item>
                    )}

                    {status === "published" && (
                        <>
                            <Menu.Item
                                leftSection={<IconWorldOff size={16} />}
                                onClick={() =>
                                    handleChangeStatus("unpublished")
                                }
                                disabled={changeStatusMutation.isPending}
                            >
                                Unpublish
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconEye size={16} />}
                                component={Link}
                                href={`${process.env.NEXT_PUBLIC_BASE_URL}news/${slug}`}
                                target="_blank"
                            >
                                View on Site
                            </Menu.Item>
                        </>
                    )}

                    {status === "unpublished" && (
                        <Menu.Item
                            leftSection={<IconWorld size={16} />}
                            onClick={() => handleChangeStatus("published")}
                            disabled={changeStatusMutation.isPending}
                        >
                            Re-publish
                        </Menu.Item>
                    )}

                    <Menu.Divider />

                    {/* Delete */}
                    <Menu.Item
                        color="red"
                        leftSection={<IconTrash size={16} />}
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                    >
                        Delete
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Group>
    );
}
