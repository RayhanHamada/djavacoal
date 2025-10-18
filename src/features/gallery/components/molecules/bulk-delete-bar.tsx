"use client";

import { Button, Group, Paper, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

interface BulkDeleteBarProps {
    count: number;
    onDelete: () => void;
    onCancel: () => void;
}

/**
 * Bar that appears when photos are selected for bulk operations
 */
export function BulkDeleteBar({
    count,
    onDelete,
    onCancel,
}: BulkDeleteBarProps) {
    return (
        <Paper
            withBorder
            p="xs"
            style={{
                backgroundColor: "var(--mantine-color-gray-0)",
            }}
        >
            <Group gap="sm" wrap="nowrap">
                <Text size="sm" fw={500} style={{ whiteSpace: "nowrap" }}>
                    {count} selected
                </Text>
                <Button
                    variant="subtle"
                    onClick={onCancel}
                    size="compact-sm"
                    color="gray"
                >
                    Cancel
                </Button>
                <Button
                    color="red"
                    onClick={onDelete}
                    size="compact-sm"
                    leftSection={<IconTrash size={14} />}
                >
                    Delete
                </Button>
            </Group>
        </Paper>
    );
}
