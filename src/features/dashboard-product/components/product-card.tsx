"use client";

import type { ProductListItem } from "../lib/types";

import { useCallback, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    ActionIcon,
    Badge,
    Card,
    Flex,
    Group,
    Menu,
    Stack,
    Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
    IconDotsVertical,
    IconEye,
    IconEyeOff,
    IconGripVertical,
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
    const [, setImageError] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: product.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

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

    return (
        <Card
            ref={setNodeRef}
            style={style}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            h={350}
        >
            <Card.Section
                component={Link}
                href={`/dashboard/products/${product.id}/edit`}
            >
                <Flex
                    direction="column"
                    justify="center"
                    align="center"
                    w="100%"
                    h={200}
                    bg="gray.0"
                >
                    <Image
                        src={product.image_url}
                        height={400}
                        width={200}
                        alt={product.en_name}
                        onError={() => setImageError(true)}
                    />
                </Flex>
            </Card.Section>

            <Stack gap="xs" mt="md">
                <Group justify="space-between" align="flex-start">
                    <Group gap="xs" flex={1}>
                        <ActionIcon
                            size="sm"
                            variant="subtle"
                            color="gray"
                            style={{ cursor: "grab" }}
                            {...listeners}
                            {...attributes}
                        >
                            <IconGripVertical size={16} />
                        </ActionIcon>
                        <Text fw={500} lineClamp={2} flex={1}>
                            {product.en_name}
                        </Text>
                    </Group>
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
