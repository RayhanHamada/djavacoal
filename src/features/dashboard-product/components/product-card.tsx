"use client";

import type { ProductListItem } from "../server/schemas";

import { useState } from "react";

import {
    ActionIcon,
    Badge,
    Card,
    Group,
    Image,
    Menu,
    Stack,
    Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
    IconDotsVertical,
    IconEye,
    IconEyeOff,
    IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface ProductCardProps {
    product: ProductListItem;
    onEdit: () => void;
}

/**
 * ProductCard component displays a single product with actions
 */
export function ProductCard({ product, onEdit }: ProductCardProps) {
    const [imageError, setImageError] = useState(false);
    const queryClient = useQueryClient();

    const toggleVisibilityMutation = useMutation({
        mutationFn: async (id: number) => {
            return await client.dashboardProduct.toggleProductVisibility({
                id,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["dashboardProduct", "listProducts"],
            });
            notifications.show({
                title: "Success",
                message: "Product visibility updated",
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Error",
                message: error.message,
                color: "red",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return await client.dashboardProduct.deleteProduct({ id });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["dashboardProduct", "listProducts"],
            });
            notifications.show({
                title: "Success",
                message: "Product deleted successfully",
                color: "green",
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Error",
                message: error.message,
                color: "red",
            });
        },
    });

    const handleToggleVisibility = () => {
        toggleVisibilityMutation.mutate(product.id);
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this product?")) {
            deleteMutation.mutate(product.id);
        }
    };

    // Determine image source
    let imageSrc = "/images/placeholder-product.jpg";
    if (product.first_media_type === "image" && product.first_media_key) {
        imageSrc = `${process.env.NEXT_PUBLIC_ASSET_URL}/${product.first_media_key}`;
    } else if (
        product.first_media_type === "youtube" &&
        product.youtube_video_id
    ) {
        imageSrc = `https://img.youtube.com/vi/${product.youtube_video_id}/maxresdefault.jpg`;
    }

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <Image
                    src={
                        imageError
                            ? "/images/placeholder-product.jpg"
                            : imageSrc
                    }
                    height={200}
                    alt={product.en_name}
                    onError={() => setImageError(true)}
                />
            </Card.Section>

            <Stack gap="xs" mt="md">
                <Group justify="space-between" align="flex-start">
                    <Text fw={500} lineClamp={2} flex={1}>
                        {product.en_name}
                    </Text>
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                                <IconDotsVertical size={16} />
                            </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item onClick={onEdit}>Edit</Menu.Item>
                            <Menu.Item
                                leftSection={
                                    product.is_hidden ? (
                                        <IconEye size={14} />
                                    ) : (
                                        <IconEyeOff size={14} />
                                    )
                                }
                                onClick={handleToggleVisibility}
                                disabled={toggleVisibilityMutation.isPending}
                            >
                                {product.is_hidden ? "Show" : "Hide"}
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                color="red"
                                leftSection={<IconTrash size={14} />}
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                            >
                                Delete
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>

                <Text size="sm" c="dimmed" lineClamp={1}>
                    {product.ar_name}
                </Text>

                {product.is_hidden && (
                    <Badge color="gray" size="sm">
                        Hidden
                    </Badge>
                )}
            </Stack>
        </Card>
    );
}
