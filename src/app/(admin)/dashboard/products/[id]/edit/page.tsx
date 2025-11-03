"use client";

import { use } from "react";

import { Container, LoadingOverlay, Paper, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import { ProductForm } from "@/features/dashboard-product/components/product-form";
import { rpc } from "@/lib/rpc";

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
    const { id } = use(params);
    const productId = Number(id);

    const { data: product, isLoading } = useQuery(
        rpc.dashboardProduct.getProductById.queryOptions({
            input: { id: productId },
        })
    );

    return (
        <Container size="xl" py="xl">
            <Paper p="xl" radius="md" shadow="sm">
                <Title mb="xl" order={2}>
                    Edit Product
                </Title>
                <LoadingOverlay visible={isLoading} />
                {product && <ProductForm product={product} />}
            </Paper>
        </Container>
    );
}
