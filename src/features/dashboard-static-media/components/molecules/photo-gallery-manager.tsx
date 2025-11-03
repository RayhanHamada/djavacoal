"use client";

import { useEffect, useState } from "react";

import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
    Alert,
    Button,
    FileButton,
    Group,
    SimpleGrid,
    Stack,
    Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconUpload } from "@tabler/icons-react";

import {
    EmptyState,
    PhotoCard,
    PhotoCardSkeleton,
    SectionHeader,
} from "@/features/dashboard-static-media/components/atoms";
import {
    usePhotoList,
    usePhotoUpload,
} from "@/features/dashboard-static-media/hooks";

interface PhotoGalleryManagerProps {
    kvKey:
        | "home_carousel_photo"
        | "factory_gallery_photos"
        | "product_gallery_photos";
    title: string;
    description: string;
    aspectRatio?: "wide" | "square";
    minDimensions?: { width: number; height: number };
    prefix: "carousel" | "factory-gallery" | "product-gallery";
}

/**
 * PhotoGalleryManager - Molecule component for managing a gallery of photos with drag & drop
 */
export function PhotoGalleryManager({
    kvKey,
    title,
    description,
    aspectRatio = "square",
    minDimensions,
    prefix,
}: PhotoGalleryManagerProps) {
    const { photos, isLoading, savePhotos, deletePhoto, isSaving } =
        usePhotoList(kvKey);
    const { uploadPhoto, isUploading } = usePhotoUpload(prefix);

    const [localPhotos, setLocalPhotos] = useState<
        Array<{ key: string; url: string }>
    >([]);

    useEffect(() => {
        setLocalPhotos(photos);
    }, [photos]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = localPhotos.findIndex((p) => p.key === active.id);
            const newIndex = localPhotos.findIndex((p) => p.key === over.id);

            const reordered = arrayMove(localPhotos, oldIndex, newIndex);
            setLocalPhotos(reordered);

            // Save immediately
            await savePhotos(reordered.map((p) => p.key));
        }
    };

    const handleFileSelect = async (files: File[]) => {
        if (!files || files.length === 0) return;

        // Validate dimensions if required
        if (minDimensions) {
            for (const file of files) {
                const valid = await validateImageDimensions(
                    file,
                    minDimensions
                );
                if (!valid) {
                    notifications.show({
                        title: "Invalid Image Dimensions",
                        message: `Image must be at least ${minDimensions.width}x${minDimensions.height}px`,
                        color: "red",
                    });
                    return;
                }
            }
        }

        try {
            notifications.show({
                id: "uploading",
                loading: true,
                title: "Uploading Photos",
                message: `Uploading ${files.length} photo(s)...`,
                autoClose: false,
                withCloseButton: false,
            });

            // Upload all files
            const uploadedKeys = await Promise.all(
                files.map((file) => uploadPhoto(file))
            );

            // Add to list and save
            const newPhotoKeys = [
                ...localPhotos.map((p) => p.key),
                ...uploadedKeys,
            ];
            await savePhotos(newPhotoKeys);

            notifications.update({
                id: "uploading",
                loading: false,
                title: "Success",
                message: "Photos uploaded successfully",
                color: "green",
                autoClose: 2000,
            });
        } catch {
            notifications.update({
                id: "uploading",
                loading: false,
                title: "Error",
                message: "Failed to upload photos",
                color: "red",
                autoClose: 3000,
            });
        }
    };

    const handleDelete = async (key: string) => {
        try {
            await deletePhoto(key);
            const newPhotoKeys = localPhotos
                .filter((p) => p.key !== key)
                .map((p) => p.key);
            await savePhotos(newPhotoKeys);
        } catch {
            notifications.show({
                title: "Error",
                message: "Failed to delete photo",
                color: "red",
            });
        }
    };

    return (
        <Stack gap="md">
            <SectionHeader title={title} description={description} />

            {minDimensions && (
                <Alert color="blue" variant="light" title="Image Requirements">
                    <Text size="sm">
                        Images must be at least {minDimensions.width}x
                        {minDimensions.height}px.
                        {aspectRatio === "square" &&
                            " Square aspect ratio recommended."}
                    </Text>
                </Alert>
            )}

            <Group>
                <FileButton
                    onChange={handleFileSelect}
                    accept="image/*"
                    multiple
                    disabled={isUploading || isSaving}
                >
                    {(props) => (
                        <Button
                            {...props}
                            leftSection={<IconUpload size={18} />}
                            loading={isUploading}
                        >
                            Upload Photos
                        </Button>
                    )}
                </FileButton>
            </Group>

            {isLoading ? (
                <SimpleGrid
                    cols={{ base: 2, sm: 3, md: 4, lg: 5 }}
                    spacing="md"
                >
                    {[...Array(4)].map((_, i) => (
                        <PhotoCardSkeleton key={i} aspectRatio={aspectRatio} />
                    ))}
                </SimpleGrid>
            ) : localPhotos.length === 0 ? (
                <EmptyState
                    title="No photos yet"
                    description="Upload photos to get started"
                />
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={localPhotos.map((p) => p.key)}
                        strategy={verticalListSortingStrategy}
                    >
                        <SimpleGrid
                            cols={{ base: 2, sm: 3, md: 4, lg: 5 }}
                            spacing="md"
                        >
                            {localPhotos.map((photo) => (
                                <PhotoCard
                                    key={photo.key}
                                    id={photo.key}
                                    url={photo.url}
                                    onDelete={() => handleDelete(photo.key)}
                                    aspectRatio={aspectRatio}
                                />
                            ))}
                        </SimpleGrid>
                    </SortableContext>
                </DndContext>
            )}
        </Stack>
    );
}

/**
 * Validate image dimensions
 */
async function validateImageDimensions(
    file: File,
    minDimensions: { width: number; height: number }
): Promise<boolean> {
    return new Promise((resolve) => {
        const img = document.createElement("img");
        img.onload = () => {
            const valid =
                img.width >= minDimensions.width &&
                img.height >= minDimensions.height;
            resolve(valid);
        };
        img.onerror = () => resolve(false);
        img.src = URL.createObjectURL(file);
    });
}
