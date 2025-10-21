"use client";

import type { SortBy, SortOrder } from "../../hooks";

import { ActionIcon, Group, TextInput, Tooltip } from "@mantine/core";
import {
    IconArrowDown,
    IconArrowUp,
    IconRefresh,
    IconSearch,
    IconSortAscendingLetters,
    IconSortDescendingLetters,
} from "@tabler/icons-react";

import { BulkDeleteBar } from "../molecules";

interface GalleryControlsProps {
    search: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: () => void;
    sortBy: SortBy;
    sortOrder: SortOrder;
    onSortByName: () => void;
    onSortByDate: () => void;
    isRefetching: boolean;
    onRefresh: () => void;
    selectedCount: number;
    onBulkDelete: () => void;
    onCancelSelection: () => void;
}

/**
 * Gallery controls: search, sort, refresh, and bulk actions
 */
export function GalleryControls({
    search,
    onSearchChange,
    onSearchSubmit,
    sortBy,
    sortOrder,
    onSortByName,
    onSortByDate,
    isRefetching,
    onRefresh,
    selectedCount,
    onBulkDelete,
    onCancelSelection,
}: GalleryControlsProps) {
    return (
        <Group justify="space-between">
            <TextInput
                placeholder="Search photos by name..."
                value={search}
                onChange={(e) => {
                    onSearchChange(e.currentTarget.value);
                    if (e.currentTarget.value) {
                        onSearchSubmit();
                    }
                }}
                leftSection={<IconSearch size={16} />}
                w={384}
            />

            <Group gap="md">
                {/* Bulk delete bar */}
                {selectedCount > 0 && (
                    <BulkDeleteBar
                        count={selectedCount}
                        onDelete={onBulkDelete}
                        onCancel={onCancelSelection}
                    />
                )}

                {/* Sort buttons */}
                <Group gap="xs">
                    {/* Sort by name */}
                    <Tooltip
                        label={`Sort by name (${sortBy === "name" && sortOrder === "asc" ? "ascending" : sortBy === "name" ? "descending" : "not active"})`}
                    >
                        <ActionIcon
                            variant={sortBy === "name" ? "filled" : "subtle"}
                            onClick={onSortByName}
                        >
                            {sortBy === "name" && sortOrder === "asc" ? (
                                <IconSortAscendingLetters size={16} />
                            ) : (
                                <IconSortDescendingLetters size={16} />
                            )}
                        </ActionIcon>
                    </Tooltip>

                    {/* Sort by updated_at */}
                    <Tooltip
                        label={`Sort by date (${sortBy === "updated_at" && sortOrder === "asc" ? "oldest first" : sortBy === "updated_at" ? "newest first" : "not active"})`}
                    >
                        <ActionIcon
                            variant={
                                sortBy === "updated_at" ? "filled" : "subtle"
                            }
                            onClick={onSortByDate}
                        >
                            {sortBy === "updated_at" && sortOrder === "asc" ? (
                                <IconArrowUp size={16} />
                            ) : (
                                <IconArrowDown size={16} />
                            )}
                        </ActionIcon>
                    </Tooltip>

                    {/* Refresh */}
                    <Tooltip label="Refresh">
                        <ActionIcon
                            variant="subtle"
                            onClick={onRefresh}
                            loading={isRefetching}
                        >
                            <IconRefresh size={16} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Group>
        </Group>
    );
}
