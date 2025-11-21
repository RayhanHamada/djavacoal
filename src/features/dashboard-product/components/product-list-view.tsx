"use client";

import type { ListProductsOutput } from "../server/schemas";

import { useState } from "react";

import Link from "next/link";

import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
    Box,
    Button,
    Grid,
    Group,
    LoadingOverlay,
    TextInput,
    Title,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { ProductCard } from "./product-card";
import { ProductCardSkeleton } from "./product-card-skeleton";
import { rpc } from "@/lib/rpc";

/**
 * ProductListView component displays a grid of products with search and reorder functionality
 */
export function ProductListView() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch] = useDebouncedValue(searchQuery, 300);
    const [activeId, setActiveId] = useState<number | null>(null);

    // Fetch products with search using TanStack Query
    const { data, isLoading } = useQuery(
        rpc.dashboardProduct.listProducts.queryOptions({
            input: {
                page: 1,
                limit: 100,
                name_search: debouncedSearch,
            },
            initialData: {
                page: 1,
                limit: 100,
                total: 0,
                products: [],
                totalPages: 1,
            },
        })
    );

    // Mutation for reordering products with optimistic updates
    const reorderMutation = useMutation(
        rpc.dashboardProduct.reorderProducts.mutationOptions({
            onMutate: async (variables, { client }) => {
                notifications.show({
                    title: "Reordering Products",
                    message:
                        "Please wait while the products are being reordered...",
                    color: "blue",
                });

                // Cancel any outgoing refetches
                await client.cancelQueries({
                    queryKey: rpc.dashboardProduct.listProducts.key(),
                });
                // Snapshot the previous value
                const queryKey = rpc.dashboardProduct.listProducts.key({
                    input: {
                        page: 1,
                        limit: 100,
                        name_search: debouncedSearch,
                    },
                });

                const previousProducts = client.getQueryData(queryKey) as
                    | ListProductsOutput
                    | undefined;

                // Optimistically update to the new value
                if (previousProducts?.products) {
                    const productsMap = new Map(
                        previousProducts.products.map((p) => [p.id, p])
                    );

                    const reorderedProducts = variables.product_orders
                        .map((order) => {
                            const product = productsMap.get(order.id);
                            if (!product) return null;

                            return {
                                ...product,
                                order_index: order.order_index,
                            };
                        })
                        .filter((p) => !!p);

                    client.setQueryData(queryKey, {
                        ...previousProducts,
                        products: reorderedProducts,
                    });
                }

                // Return context with the snapshot and client
                return {
                    previousProducts,
                    queryKey,
                    client,
                };
            },
            onError: (error, _, context) => {
                if (!context) return;

                // Rollback on error
                if (context.previousProducts && context.client) {
                    context.client.setQueryData(
                        context.queryKey,
                        context.previousProducts
                    );
                }

                notifications.show({
                    title: "Error",
                    message: error.message,
                    color: "red",
                });
            },
            onSuccess: async (_, __, ___, { client }) => {
                await client.invalidateQueries({
                    queryKey: rpc.dashboardProduct.listProducts.key(),
                });

                notifications.show({
                    title: "Success",
                    message: "Products reordered successfully",
                    color: "green",
                });
            },
        })
    );

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragEndEvent) => {
        setActiveId(event.active.id as number);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveId(null);

        if (over && active.id !== over.id && data?.products) {
            const oldIndex = data.products.findIndex(
                (item) => item.id === active.id
            );
            const newIndex = data.products.findIndex(
                (item) => item.id === over.id
            );

            const reordered = arrayMove(data.products, oldIndex, newIndex).map(
                (item, index) => ({
                    id: item.id,
                    order_index: index,
                })
            );

            reorderMutation.mutate({
                product_orders: reordered,
            });
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    return (
        <Box>
            {/* Header with search and create button */}
            <Group justify="space-between" mb="xl">
                <Title order={2}>Products</Title>
                <Button
                    leftSection={<IconPlus size={16} />}
                    component={Link}
                    href="/dashboard/products/create"
                >
                    Create Product
                </Button>
            </Group>

            {/* Search box */}
            <TextInput
                placeholder="Search products by name..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                mb="xl"
                size="md"
            />

            {/* Product grid */}
            {isLoading ? (
                <Grid>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Grid.Col
                            key={i}
                            span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                        >
                            <ProductCardSkeleton />
                        </Grid.Col>
                    ))}
                </Grid>
            ) : (
                <Box pos="relative">
                    <LoadingOverlay
                        visible={reorderMutation.isPending}
                        overlayProps={{ radius: "sm", blur: 2 }}
                        loaderProps={{ type: "dots" }}
                    />
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragCancel={handleDragCancel}
                    >
                        <SortableContext
                            items={data?.products.map((p) => p.id) ?? []}
                            strategy={rectSortingStrategy}
                        >
                            <Grid>
                                {data?.products.map((product) => (
                                    <Grid.Col
                                        key={product.id}
                                        span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                                    >
                                        <ProductCard product={product} />
                                    </Grid.Col>
                                ))}
                            </Grid>
                        </SortableContext>
                        <DragOverlay>
                            {activeId && data ? (
                                <ProductCard
                                    product={
                                        data.products.find(
                                            (p) => p.id === activeId
                                        )!
                                    }
                                />
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </Box>
            )}

            {/* Empty state */}
            {!isLoading && data?.products.length === 0 && (
                <Box ta="center" py="xl">
                    <Title order={4} c="dimmed">
                        {searchQuery
                            ? "No products found"
                            : "No products yet. Create your first product!"}
                    </Title>
                </Box>
            )}
        </Box>
    );
}
