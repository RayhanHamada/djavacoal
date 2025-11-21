"use client";

import { Card, Group, Skeleton, Stack } from "@mantine/core";

/**
 * PackagingOptionCardSkeleton - Loading placeholder for packaging option cards
 */
export function PackagingOptionCardSkeleton() {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <Skeleton height={160} />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
                <Stack gap="xs" style={{ flex: 1 }}>
                    <Skeleton height={18} width="70%" />
                    <Skeleton height={14} width="60%" />
                </Stack>
                <Skeleton height={28} width={28} circle />
            </Group>
        </Card>
    );
}
