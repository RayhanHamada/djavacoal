"use client";

import { Card, Skeleton, Stack } from "@mantine/core";

/**
 * ProductCardSkeleton - Loading placeholder for product cards
 */
export function ProductCardSkeleton() {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <Skeleton height={200} />
            </Card.Section>

            <Stack gap="xs" mt="md">
                <Skeleton height={20} width="80%" />
                <Skeleton height={16} width="60%" />
                <Skeleton height={20} width={60} />
            </Stack>
        </Card>
    );
}
