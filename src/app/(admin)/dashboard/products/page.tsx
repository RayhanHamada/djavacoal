import { Container } from "@mantine/core";

import { ProductListView } from "@/features/dashboard-product/components/product-list-view";

export default function ProductsPage() {
    return (
        <Container size="xl" py="xl">
            <ProductListView />
        </Container>
    );
}
