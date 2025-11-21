"use client";

import type { SortBy, SortOrder } from "../../hooks";

import { useRef } from "react";

import { ActionIcon, Button, Group, TextInput, Tooltip } from "@mantine/core";
import {
    IconArrowDown,
    IconArrowUp,
    IconRefresh,
    IconSearch,
    IconSortAscendingLetters,
    IconSortDescendingLetters,
    IconUpload,
} from "@tabler/icons-react";

import { BulkDeleteBar } from "../molecules";

interface GalleryControlsProps {
    // Search props
    search: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: () => void;

    // Sort props
    sortBy: SortBy;
    sortOrder: SortOrder;
    onSortByName: () => void;
    onSortByDate: () => void;

    // Refresh props
    isRefetching: boolean;
    onRefresh: () => void;

    // Upload props
    onManualUpload: (files: File[]) => void;

    // Selection props
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
    onManualUpload,
    selectedCount,
    onBulkDelete,
    onCancelSelection,
}: GalleryControlsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const imageFiles = Array.from(files).filter((file) =>
                file.type.startsWith("image/")
            );
            if (imageFiles.length > 0) {
                onManualUpload(imageFiles);
            }
        }
        // Reset input value to allow selecting the same files again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
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

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                />

                {/* Upload button */}
                <Tooltip label="Upload photos">
                    <Button variant="filled" onClick={handleUploadClick}>
                        <IconUpload size={16} /> Upload
                    </Button>
                </Tooltip>

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
