"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Box, Button, Grid, Group, TextInput, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

import { ProductCard } from "./product-card";
import { ProductCardSkeleton } from "./product-card-skeleton";
import { rpc } from "@/lib/rpc";

/**
 * ProductListView component displays a grid of products with search and reorder functionality
 */
export function ProductListView() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch] = useDebouncedValue(searchQuery, 300);

    // Fetch products with search using TanStack Query
    const { data, isLoading } = useQuery(
        rpc.dashboardProduct.listProducts.queryOptions({
            input: {
                page: 1,
                limit: 100,
                name_search: debouncedSearch || undefined,
            },
        })
    );

    const handleCreateProduct = () => {
        router.push("/dashboard/products/create");
    };

    const handleEditProduct = (id: number) => {
        router.push(`/dashboard/products/${id}/edit`);
    };

    return (
        <Box>
            {/* Header with search and create button */}
            <Group justify="space-between" mb="xl">
                <Title order={2}>Products</Title>
                <Button
                    leftSection={<IconPlus size={16} />}
                    onClick={handleCreateProduct}
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
                <Grid>
                    {data?.products.map((product) => (
                        <Grid.Col
                            key={product.id}
                            span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                        >
                            <ProductCard
                                product={product}
                                onEdit={() => handleEditProduct(product.id)}
                            />
                        </Grid.Col>
                    ))}
                </Grid>
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
