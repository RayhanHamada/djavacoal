"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    ActionIcon,
    AspectRatio,
    Badge,
    Box,
    Button,
    Group,
    Image,
    Menu,
    Table,
    Text,
} from "@mantine/core";
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

import { client } from "@/lib/rpc";

interface NewsArticle {
    id: number;
    slug: string;
    imageKey: string | null;
    metadataTitle: string;
    enTitle: string;
    arTitle: string;
    isPublished: boolean;
    publishedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

interface NewsListTableProps {
    /** News articles to display */
    items: NewsArticle[];
    /** Whether data is loading */
    isLoading?: boolean;
}

/**
 * Get R2 public URL for image key
 */
function getImageUrl(key: string): string {
    // TODO: Replace with actual R2 public URL pattern
    return `${process.env.NEXT_PUBLIC_ASSET_URL}/r2/${key}`;
}

/**
 * NewsListTable component for displaying news articles in a table
 * With image preview, status, and action buttons
 */
export function NewsListTable({
    items,
    isLoading = false,
}: NewsListTableProps) {
    const router = useRouter();
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

    // Toggle publish mutation
    const togglePublishMutation = useMutation({
        mutationFn: ({
            id,
            isPublished,
        }: {
            id: number;
            isPublished: boolean;
        }) => client.dashboardNews.togglePublish({ id, isPublished }),
        onSuccess: (_, variables) => {
            notifications.show({
                title: "Success",
                message: variables.isPublished
                    ? "News article published"
                    : "News article unpublished",
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
                    error instanceof Error
                        ? error.message
                        : "Failed to update status",
                color: "red",
            });
        },
    });

    const handleDelete = (id: number, title: string) => {
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

    const handleTogglePublish = (id: number, currentStatus: boolean) => {
        togglePublishMutation.mutate({ id, isPublished: !currentStatus });
    };

    const handleGoToNewsPage = (slug: string) => {
        // TODO: Update with actual public news page URL
        window.open(
            `${process.env.NEXT_PUBLIC_BASE_URL}/news/${slug}`,
            "_blank"
        );
    };

    if (items.length === 0 && !isLoading) {
        return (
            <Box p="xl" style={{ textAlign: "center" }}>
                <Text size="lg" c="dimmed">
                    No news articles found
                </Text>
                <Button component={Link} href="/dashboard/news/create" mt="md">
                    Create Your First Article
                </Button>
            </Box>
        );
    }

    return (
        <Table.ScrollContainer minWidth={800}>
            <Table striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Image</Table.Th>
                        <Table.Th>Title</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Published Date</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {items.map((article) => (
                        <Table.Tr key={article.id}>
                            {/* Image */}
                            <Table.Td>
                                <Box w={120}>
                                    <AspectRatio ratio={4 / 3}>
                                        {article.imageKey ? (
                                            <Image
                                                src={getImageUrl(
                                                    article.imageKey
                                                )}
                                                alt={article.enTitle}
                                                fit="cover"
                                                radius="sm"
                                            />
                                        ) : (
                                            <Box
                                                bg="gray.1"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderRadius:
                                                        "var(--mantine-radius-sm)",
                                                }}
                                            >
                                                <Text size="xs" c="dimmed">
                                                    No Image
                                                </Text>
                                            </Box>
                                        )}
                                    </AspectRatio>
                                </Box>
                            </Table.Td>

                            {/* Title */}
                            <Table.Td>
                                <Box
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        router.push(
                                            `/dashboard/news/${article.id}/edit`
                                        )
                                    }
                                >
                                    <Text fw={500} lineClamp={2}>
                                        {article.enTitle}
                                    </Text>
                                    <Text size="xs" c="dimmed" lineClamp={1}>
                                        {article.arTitle}
                                    </Text>
                                </Box>
                            </Table.Td>

                            {/* Status */}
                            <Table.Td>
                                <Badge
                                    color={
                                        article.isPublished ? "green" : "gray"
                                    }
                                    variant="light"
                                >
                                    {article.isPublished
                                        ? "Published"
                                        : "Unpublished"}
                                </Badge>
                            </Table.Td>

                            {/* Published Date */}
                            <Table.Td>
                                {article.publishedAt ? (
                                    <Text size="sm">
                                        {new Date(
                                            article.publishedAt
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </Text>
                                ) : (
                                    <Text size="sm" c="dimmed">
                                        Not published
                                    </Text>
                                )}
                            </Table.Td>

                            {/* Actions */}
                            <Table.Td>
                                <Group gap="xs" wrap="nowrap">
                                    {/* Edit Button */}
                                    <ActionIcon
                                        variant="subtle"
                                        color="blue"
                                        onClick={() =>
                                            router.push(
                                                `/dashboard/news/${article.id}/edit`
                                            )
                                        }
                                    >
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
                                            {/* Toggle Publish/Unpublish */}
                                            <Menu.Item
                                                leftSection={
                                                    article.isPublished ? (
                                                        <IconWorldOff
                                                            size={16}
                                                        />
                                                    ) : (
                                                        <IconWorld size={16} />
                                                    )
                                                }
                                                onClick={() =>
                                                    handleTogglePublish(
                                                        article.id,
                                                        article.isPublished
                                                    )
                                                }
                                                disabled={
                                                    togglePublishMutation.isPending
                                                }
                                            >
                                                {article.isPublished
                                                    ? "Unpublish"
                                                    : "Publish"}
                                            </Menu.Item>

                                            {/* View on Site (only if published) */}
                                            {article.isPublished && (
                                                <Menu.Item
                                                    leftSection={
                                                        <IconEye size={16} />
                                                    }
                                                    onClick={() =>
                                                        handleGoToNewsPage(
                                                            article.slug
                                                        )
                                                    }
                                                >
                                                    View on Site
                                                </Menu.Item>
                                            )}

                                            <Menu.Divider />

                                            {/* Delete */}
                                            <Menu.Item
                                                color="red"
                                                leftSection={
                                                    <IconTrash size={16} />
                                                }
                                                onClick={() =>
                                                    handleDelete(
                                                        article.id,
                                                        article.enTitle
                                                    )
                                                }
                                                disabled={
                                                    deleteMutation.isPending
                                                }
                                            >
                                                Delete
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}
