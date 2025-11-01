"use client";

import type { ProductListItem } from "../server/schemas";

import { useCallback, useState } from "react";

import Link from "next/link";

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
import { useMutation } from "@tanstack/react-query";

import { rpc } from "@/lib/rpc";

interface ProductCardProps {
    product: ProductListItem;
}

/**
 * ProductCard component displays a single product with actions
 */
export function ProductCard({ product }: ProductCardProps) {
    const [imageError, setImageError] = useState(false);

    const toggleVisibilityMutation = useMutation(
        rpc.dashboardProduct.toggleProductVisibility.mutationOptions({
            onSuccess: async (_, __, ___, { client }) => {
                notifications.show({
                    title: "Success",
                    message: "Product visibility updated",
                    color: "green",
                });

                await Promise.all([
                    client.invalidateQueries({
                        queryKey: rpc.dashboardProduct.listProducts.key(),
                    }),
                ]);
            },
            onError: async (error: Error) => {
                notifications.show({
                    title: "Error",
                    message: error.message,
                    color: "red",
                });
            },
        })
    );

    const deleteMutation = useMutation(
        rpc.dashboardProduct.deleteProduct.mutationOptions({
            onSuccess: async (_, __, ___, { client }) => {
                client.invalidateQueries({
                    queryKey: rpc.dashboardProduct.listProducts.key(),
                });

                notifications.show({
                    title: "Success",
                    message: "Product deleted successfully",
                    color: "green",
                });
            },
            onError: async (error) => {
                notifications.show({
                    title: "Error",
                    message: error.message,
                    color: "red",
                });
            },
        })
    );

    const handleToggleVisibility = useCallback(() => {
        toggleVisibilityMutation.mutate({
            id: product.id,
        });
    }, [product.id, toggleVisibilityMutation]);

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this product?")) {
            deleteMutation.mutate({
                id: product.id,
            });
        }
    };

    // Determine image source
    let imageSrc = "/images/placeholder-product.jpg";
    if (product.first_media_type === "image" && product.first_media_key) {
        imageSrc = `${process.env.NEXT_PUBLIC_ASSET_URL}${product.first_media_key}`;
    } else if (
        product.first_media_type === "youtube" &&
        product.youtube_video_id
    ) {
        imageSrc = `https://img.youtube.com/vi/${product.youtube_video_id}/maxresdefault.jpg`;
    }

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder h={450}>
            <Card.Section
                component={Link}
                href={`/dashboard/products/${product.id}/edit`}
            >
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
