"use client";

import Link from "next/link";

import { ActionIcon, Group, Menu, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
    IconDots,
    IconEye,
    IconPencil,
    IconPin,
    IconPinnedOff,
    IconTrash,
    IconWorld,
    IconWorldOff,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { match } from "ts-pattern";

import {
    NEWS_STATUS_FILTER_VALUES,
    NewsStatusFilterEnumType,
} from "@/features/dashboard-news/lib/constants";
import { rpc } from "@/lib/rpc";

interface NewsTableActionsProps {
    id: number;
    slug: string;
    title: string;
    status: Exclude<NewsStatusFilterEnumType, "all">;
    publishedAt?: Date | null;
    isPinnedToHome: boolean;
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
    publishedAt,
    isPinnedToHome,
    onEdit,
}: NewsTableActionsProps) {
    // Delete mutation
    const deleteMutation = useMutation(
        rpc.dashboardNews.deleteNews.mutationOptions({
            onMutate(variables, context) {
                notifications.show({
                    title: "Deleting...",
                    message: "News article is being deleted",
                    color: "blue",
                });

                return context;
            },
            onSuccess: async (_, __, ___, { client }) => {
                notifications.show({
                    title: "Success",
                    message: "News article deleted successfully",
                    color: "green",
                });

                client.invalidateQueries({
                    queryKey: rpc.dashboardNews.listNews.key(),
                });
            },
            onError: (error) => {
                notifications.show({
                    title: "Error",
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to delete",
                    color: "red",
                });
            },
        })
    );

    // Change status mutation
    const changeStatusMutation = useMutation(
        rpc.dashboardNews.changeStatus.mutationOptions({
            onSuccess: async (_, variables, __, { client }) => {
                const statusMessages = {
                    draft: "News article saved as draft",
                    published: "News article published",
                    unpublished: "News article unpublished",
                } as const;

                notifications.show({
                    title: "Success",
                    message: statusMessages[variables.status],
                    color: "green",
                });

                await Promise.all([
                    client.invalidateQueries({
                        queryKey: rpc.dashboardNews.listNews.key(),
                    }),
                ]);
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
        })
    );

    // Toggle pin to home mutation
    const togglePinMutation = useMutation(
        rpc.dashboardNews.togglePinToHome.mutationOptions({
            onSuccess: async (data, _, __, { client }) => {
                notifications.show({
                    title: "Success",
                    message: data.isPinnedToHome
                        ? "News article pinned to home page"
                        : "News article unpinned from home page",
                    color: "green",
                });

                client.invalidateQueries({
                    queryKey: rpc.dashboardNews.listNews.key(),
                });
            },
            onError: (error) => {
                // Map error messages to user-friendly notifications
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to toggle pin";

                notifications.show({
                    title: "Error",
                    message: errorMessage,
                    color: "red",
                });
            },
        })
    );

    const handleDelete = () => {
        console.log(`triggered modal`);

        modals.openConfirmModal({
            title: "Delete News Article",
            children: (
                <Text size="sm">
                    Are you sure you want to delete <strong>{title}</strong>?
                    This action cannot be undone.
                </Text>
            ),
            labels: {
                confirm: "Delete",
                cancel: "Cancel",
            },
            confirmProps: {
                color: "red",
            },
            onConfirm: () => deleteMutation.mutate({ id }),
        });
    };

    const handleChangeStatus = (newStatus: typeof status) => {
        changeStatusMutation.mutate({
            id,
            status: newStatus,
        });
    };

    const isFuturePublished = publishedAt && publishedAt > new Date();

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
                    {match({
                        status,
                        isFuturePublished,
                    })
                        .with(
                            {
                                status: NEWS_STATUS_FILTER_VALUES.DRAFT,
                            },
                            () => (
                                <Menu.Item
                                    leftSection={<IconWorld size={16} />}
                                    onClick={() =>
                                        handleChangeStatus(
                                            NEWS_STATUS_FILTER_VALUES.PUBLISHED
                                        )
                                    }
                                    disabled={changeStatusMutation.isPending}
                                >
                                    Publish
                                </Menu.Item>
                            )
                        )
                        .with(
                            {
                                status: NEWS_STATUS_FILTER_VALUES.UNPUBLISHED,
                            },
                            ({ isFuturePublished }) => (
                                <Menu.Item
                                    leftSection={<IconWorld size={16} />}
                                    onClick={() =>
                                        handleChangeStatus(
                                            NEWS_STATUS_FILTER_VALUES.PUBLISHED
                                        )
                                    }
                                    disabled={changeStatusMutation.isPending}
                                >
                                    {isFuturePublished
                                        ? "Schedule Publication"
                                        : "Publish"}
                                </Menu.Item>
                            )
                        )
                        .with(
                            {
                                status: NEWS_STATUS_FILTER_VALUES.PUBLISHED,
                            },
                            ({ isFuturePublished }) => (
                                <>
                                    <Menu.Item
                                        leftSection={<IconWorldOff size={16} />}
                                        onClick={() =>
                                            handleChangeStatus(
                                                NEWS_STATUS_FILTER_VALUES.UNPUBLISHED
                                            )
                                        }
                                        disabled={
                                            changeStatusMutation.isPending
                                        }
                                    >
                                        {isFuturePublished
                                            ? "Cancel Schedule"
                                            : "Unpublish"}
                                    </Menu.Item>
                                    {!isFuturePublished && (
                                        <>
                                            <Menu.Item
                                                leftSection={
                                                    <IconEye size={16} />
                                                }
                                                component={Link}
                                                href={`${process.env.NEXT_PUBLIC_BASE_URL}blog/${slug}`}
                                                target="_blank"
                                            >
                                                View on Site
                                            </Menu.Item>
                                            <Menu.Item
                                                leftSection={
                                                    isPinnedToHome ? (
                                                        <IconPinnedOff
                                                            size={16}
                                                        />
                                                    ) : (
                                                        <IconPin size={16} />
                                                    )
                                                }
                                                onClick={() =>
                                                    togglePinMutation.mutate({
                                                        id,
                                                    })
                                                }
                                                disabled={
                                                    togglePinMutation.isPending
                                                }
                                            >
                                                {isPinnedToHome
                                                    ? "Unpin from Home"
                                                    : "Pin to Home"}
                                            </Menu.Item>
                                        </>
                                    )}
                                </>
                            )
                        )
                        .otherwise(() => null)}
                    {/* Status transitions based on current status */}

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
