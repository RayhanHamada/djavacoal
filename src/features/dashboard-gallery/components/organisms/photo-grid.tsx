"use client";

import type { Photo, PhotoWithUrl } from "../../hooks";

import {
    Box,
    Button,
    Center,
    Loader,
    SimpleGrid,
    Stack,
    Text,
} from "@mantine/core";

import { PhotoCard } from "../molecules";

interface PhotoGridProps {
    // Data state
    isLoading: boolean;
    isError: boolean;
    photos: Array<{
        id: string;
        name: string;
        url: string;
        [key: string]: unknown;
    }>;
    search: string;

    // Selection state
    selectedPhotoIds: Set<string>;

    // Drag and drop state
    isDragOver: boolean;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;

    // Photo actions
    onPhotoToggle: (photoId: string) => void;
    onPhotoRename: (photo: Photo) => void;
    onPhotoDelete: (photo: Photo) => void;
    onPhotoPreview: (photo: PhotoWithUrl) => void;
    onRefresh: () => void;
}

/**
 * Photo grid with drag-and-drop support
 */
export function PhotoGrid({
    isLoading,
    isError,
    photos,
    search,
    selectedPhotoIds,
    isDragOver,
    onDrop,
    onDragOver,
    onDragLeave,
    onPhotoToggle,
    onPhotoRename,
    onPhotoDelete,
    onPhotoPreview,
    onRefresh,
}: PhotoGridProps) {
    return (
        <Box
            pos="relative"
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
        >
            {isDragOver && (
                <Box
                    pos="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    style={{
                        zIndex: 50,
                        borderRadius: 8,
                        border: "4px dashed var(--mantine-color-blue-6)",
                        backgroundColor: "var(--mantine-color-blue-0)",
                        opacity: 0.9,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text size="xl" fw={700} c="blue">
                        Drop to prepare upload
                    </Text>
                </Box>
            )}

            {isLoading ? (
                <Center py={48}>
                    <Loader size="lg" />
                </Center>
            ) : isError ? (
                <Center py={48}>
                    <Stack align="center">
                        <Text c="red">Error loading photos</Text>
                        <Button variant="subtle" onClick={onRefresh}>
                            Try Again
                        </Button>
                    </Stack>
                </Center>
            ) : photos.length === 0 ? (
                <Center py={96}>
                    <Text c="dimmed">
                        {search
                            ? "No photos found matching your search"
                            : "No photos yet. Drag and drop files to upload."}
                    </Text>
                </Center>
            ) : (
                <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
                    spacing="md"
                >
                    {photos.map((photo) => (
                        <PhotoCard
                            key={photo.id}
                            id={photo.id}
                            name={photo.name}
                            url={photo.url}
                            checked={selectedPhotoIds.has(photo.id)}
                            onCheckedChange={() => onPhotoToggle(photo.id)}
                            onRename={() =>
                                onPhotoRename({
                                    id: photo.id,
                                    name: photo.name,
                                })
                            }
                            onDelete={() =>
                                onPhotoDelete({
                                    id: photo.id,
                                    name: photo.name,
                                })
                            }
                            onDoubleClick={() =>
                                onPhotoPreview({
                                    id: photo.id,
                                    name: photo.name,
                                    url: photo.url,
                                })
                            }
                        />
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
}
