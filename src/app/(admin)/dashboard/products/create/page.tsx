import type { Metadata } from "next";

import { Container, Paper, Title } from "@mantine/core";

import { ProductForm } from "@/features/dashboard-product/components/product-form";

export const metadata: Metadata = {
    title: "Create Product | Dashboard",
};

export default function CreateProductPage() {
    return (
        <Container size="xl" py="xl">
            <Paper p="xl" radius="md" shadow="sm">
                <Title mb="xl" order={2}>
                    Create New Product
                </Title>
                <ProductForm />
            </Paper>
        </Container>
    );
}
