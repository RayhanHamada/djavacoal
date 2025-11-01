"use client";

import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface PageMetadataTableActionsProps {
    id: number;
    path: string;
    onEdit: () => void;
    onDelete: () => void;
}

/**
 * Table actions component for page metadata entries
 * Provides edit and delete buttons
 */
export function PageMetadataTableActions({
    onEdit,
    onDelete,
}: PageMetadataTableActionsProps) {
    return (
        <Group gap="xs">
            <Tooltip label="Edit">
                <ActionIcon variant="subtle" color="blue" onClick={onEdit}>
                    <IconEdit size={16} />
                </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete">
                <ActionIcon variant="subtle" color="red" onClick={onDelete}>
                    <IconTrash size={16} />
                </ActionIcon>
            </Tooltip>
        </Group>
    );
}
