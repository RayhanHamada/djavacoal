"use client";

import { Box, Stack, Text } from "@mantine/core";
import { IconPhotoOff } from "@tabler/icons-react";

interface EmptyStateProps {
    title: string;
    description?: string;
}

/**
 * EmptyState - Atom component for displaying empty states
 */
export function EmptyState({ title, description }: EmptyStateProps) {
    return (
        <Box
            p="xl"
            style={{
                textAlign: "center",
                border: "2px dashed var(--mantine-color-gray-4)",
                borderRadius: "var(--mantine-radius-md)",
                background: "var(--mantine-color-gray-0)",
            }}
        >
            <Stack align="center" gap="sm">
                <IconPhotoOff size={48} color="var(--mantine-color-gray-5)" />
                <div>
                    <Text size="lg" fw={500} c="dimmed">
                        {title}
                    </Text>
                    {description && (
                        <Text size="sm" c="dimmed" mt={4}>
                            {description}
                        </Text>
                    )}
                </div>
            </Stack>
        </Box>
    );
}
