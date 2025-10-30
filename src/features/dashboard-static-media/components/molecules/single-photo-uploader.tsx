"use client";

import {
    Alert,
    Button,
    FileButton,
    Group,
    Image,
    Paper,
    Stack,
    Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPhoto, IconTrash, IconUpload } from "@tabler/icons-react";

import {
    EmptyState,
    SectionHeader,
} from "@/features/dashboard-static-media/components/atoms";
import {
    usePhotoList,
    usePhotoUpload,
} from "@/features/dashboard-static-media/hooks";

interface SinglePhotoUploaderProps {
    kvKey: "visit_our_factory_photo" | "factory_photo";
    title: string;
    description: string;
    aspectRatio?: "wide" | "square";
    minDimensions?: { width: number; height: number };
    prefix: "factory-visit" | "factory-photo";
}

/**
 * SinglePhotoUploader - Molecule component for managing a single photo
 */
export function SinglePhotoUploader({
    kvKey,
    title,
    description,
    aspectRatio = "square",
    minDimensions,
    prefix,
}: SinglePhotoUploaderProps) {
    const { photos, isLoading, savePhotos, deletePhoto, isSaving } =
        usePhotoList(kvKey);
    const { uploadPhoto, isUploading } = usePhotoUpload(prefix);

    const currentPhoto = photos[0] || null;

    const handleFileSelect = async (file: File | null) => {
        if (!file) return;

        // Validate dimensions if required
        if (minDimensions) {
            const valid = await validateImageDimensions(file, minDimensions);
            if (!valid) {
                notifications.show({
                    title: "Invalid Image Dimensions",
                    message: `Image must be at least ${minDimensions.width}x${minDimensions.height}px`,
                    color: "red",
                });
                return;
            }
        }

        try {
            notifications.show({
                id: "uploading",
                loading: true,
                title: "Uploading Photo",
                message: "Please wait...",
                autoClose: false,
                withCloseButton: false,
            });

            const uploadedKey = await uploadPhoto(file);

            // Delete old photo if exists
            if (currentPhoto) {
                await deletePhoto(currentPhoto.key);
            }

            // Save new photo
            await savePhotos([uploadedKey]);

            notifications.update({
                id: "uploading",
                loading: false,
                title: "Success",
                message: "Photo uploaded successfully",
                color: "green",
                autoClose: 2000,
            });
        } catch {
            notifications.update({
                id: "uploading",
                loading: false,
                title: "Error",
                message: "Failed to upload photo",
                color: "red",
                autoClose: 3000,
            });
        }
    };

    const handleDelete = async () => {
        if (!currentPhoto) return;

        try {
            await deletePhoto(currentPhoto.key);
            await savePhotos([]);
            notifications.show({
                title: "Success",
                message: "Photo deleted successfully",
                color: "green",
            });
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
                        Image must be at least {minDimensions.width}x
                        {minDimensions.height}px.
                    </Text>
                </Alert>
            )}

            {isLoading ? (
                <Paper p="xl" withBorder>
                    <Text size="sm" c="dimmed">
                        Loading...
                    </Text>
                </Paper>
            ) : !currentPhoto ? (
                <>
                    <EmptyState
                        title="No photo uploaded"
                        description="Upload a photo to display"
                    />
                    <FileButton
                        onChange={handleFileSelect}
                        accept="image/*"
                        disabled={isUploading || isSaving}
                    >
                        {(props) => (
                            <Button
                                {...props}
                                leftSection={<IconUpload size={18} />}
                                loading={isUploading}
                            >
                                Upload Photo
                            </Button>
                        )}
                    </FileButton>
                </>
            ) : (
                <Stack gap="md">
                    <Paper p="md" withBorder radius="md">
                        <Image
                            src={currentPhoto.url}
                            alt="Uploaded photo"
                            h={aspectRatio === "wide" ? 200 : 300}
                            fit="contain"
                        />
                    </Paper>
                    <Group>
                        <FileButton
                            onChange={handleFileSelect}
                            accept="image/*"
                            disabled={isUploading || isSaving}
                        >
                            {(props) => (
                                <Button
                                    {...props}
                                    leftSection={<IconPhoto size={18} />}
                                    variant="light"
                                    loading={isUploading}
                                >
                                    Replace Photo
                                </Button>
                            )}
                        </FileButton>
                        <Button
                            leftSection={<IconTrash size={18} />}
                            color="red"
                            variant="light"
                            onClick={handleDelete}
                            disabled={isUploading || isSaving}
                        >
                            Delete
                        </Button>
                    </Group>
                </Stack>
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
