"use client";

import { Alert, Box, Divider, Grid, Modal, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconInfoCircle } from "@tabler/icons-react";

import { OgImagePlatformCard } from "@/features/dashboard-page-settings/components/atoms";
import {
    useDefaultOgImageDelete,
    useDefaultOgImages,
    useDefaultOgImageUpload,
} from "@/features/dashboard-page-settings/hooks";
import {
    DEFAULT_OG_IMAGE_PLATFORMS,
    OG_IMAGE_MAX_FILE_SIZE,
    type OgImagePlatformId,
} from "@/features/dashboard-page-settings/lib/constants";

interface DefaultOgImagesModalProps {
    /** Whether the modal is open */
    opened: boolean;
    /** Callback to close the modal */
    onClose: () => void;
}

/**
 * DefaultOgImagesModal - Modal for managing default OG images
 * for different social media platforms
 */
export function DefaultOgImagesModal({
    opened,
    onClose,
}: DefaultOgImagesModalProps) {
    const { images, isLoading } = useDefaultOgImages();
    const { uploadImage, isUploading, uploadingPlatformId } =
        useDefaultOgImageUpload();
    const { deleteImage, isDeleting } = useDefaultOgImageDelete();

    /**
     * Get the current image data for a platform
     */
    const getImageForPlatform = (platformId: OgImagePlatformId) => {
        return images.find((img) => img.platformId === platformId);
    };

    /**
     * Validate image dimensions before upload
     */
    const validateImageDimensions = (
        file: File,
        requiredWidth: number,
        requiredHeight: number
    ): Promise<{
        valid: boolean;
        actualWidth: number;
        actualHeight: number;
    }> => {
        return new Promise((resolve) => {
            const img = document.createElement("img");
            img.onload = () => {
                URL.revokeObjectURL(img.src);
                resolve({
                    valid:
                        img.width === requiredWidth &&
                        img.height === requiredHeight,
                    actualWidth: img.width,
                    actualHeight: img.height,
                });
            };
            img.onerror = () => {
                URL.revokeObjectURL(img.src);
                resolve({ valid: false, actualWidth: 0, actualHeight: 0 });
            };
            img.src = URL.createObjectURL(file);
        });
    };

    /**
     * Handle file upload for a platform
     */
    const handleUpload = async (platformId: OgImagePlatformId, file: File) => {
        const platform = DEFAULT_OG_IMAGE_PLATFORMS.find(
            (p) => p.id === platformId
        );
        if (!platform) return;

        // Validate file size
        if (file.size > OG_IMAGE_MAX_FILE_SIZE) {
            notifications.show({
                title: "File too large",
                message: "Image must be less than 10MB",
                color: "red",
            });
            return;
        }

        // Validate dimensions
        const { valid, actualWidth, actualHeight } =
            await validateImageDimensions(
                file,
                platform.width,
                platform.height
            );

        if (!valid) {
            notifications.show({
                title: "Invalid dimensions",
                message: `Image must be exactly ${platform.width}×${platform.height}px. Your image is ${actualWidth}×${actualHeight}px.`,
                color: "red",
            });
            return;
        }

        try {
            notifications.show({
                id: `uploading-${platformId}`,
                loading: true,
                title: "Uploading",
                message: `Uploading ${platform.label} OG image...`,
                autoClose: false,
                withCloseButton: false,
            });

            await uploadImage(platformId, file);

            notifications.update({
                id: `uploading-${platformId}`,
                loading: false,
                title: "Success",
                message: `${platform.label} OG image uploaded successfully`,
                color: "green",
                autoClose: 2000,
            });
        } catch {
            notifications.update({
                id: `uploading-${platformId}`,
                loading: false,
                title: "Error",
                message: `Failed to upload ${platform.label} OG image`,
                color: "red",
                autoClose: 3000,
            });
        }
    };

    /**
     * Handle delete for a platform
     */
    const handleDelete = async (platformId: OgImagePlatformId) => {
        try {
            await deleteImage(platformId);
        } catch {
            // Error notification is handled by the hook
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Default OG Images"
            size="xl"
            centered
        >
            <Stack gap="md">
                {/* Info Alert */}
                <Alert
                    variant="light"
                    color="blue"
                    icon={<IconInfoCircle size={18} />}
                >
                    <Text size="sm">
                        Upload default Open Graph images for different social
                        media platforms. These images will be used when sharing
                        pages that don&apos;t have a custom OG image set.
                    </Text>
                </Alert>

                <Divider />

                {/* Platform Cards Grid */}
                {isLoading ? (
                    <Box py="xl" style={{ textAlign: "center" }}>
                        <Text size="sm" c="dimmed">
                            Loading...
                        </Text>
                    </Box>
                ) : (
                    <Grid gutter="md">
                        {DEFAULT_OG_IMAGE_PLATFORMS.map((platform) => {
                            const imageData = getImageForPlatform(platform.id);
                            return (
                                <Grid.Col
                                    key={platform.id}
                                    span={{ base: 12, sm: 6 }}
                                >
                                    <OgImagePlatformCard
                                        label={platform.label}
                                        description={platform.description}
                                        width={platform.width}
                                        height={platform.height}
                                        imageUrl={imageData?.url ?? null}
                                        isUploading={isUploading}
                                        isUploadingThis={
                                            uploadingPlatformId === platform.id
                                        }
                                        isDeleting={isDeleting}
                                        onUpload={(file) =>
                                            handleUpload(platform.id, file)
                                        }
                                        onDelete={() =>
                                            handleDelete(platform.id)
                                        }
                                    />
                                </Grid.Col>
                            );
                        })}
                    </Grid>
                )}

                {/* Dimension Requirements */}
                <Alert variant="light" color="gray" title="Image Requirements">
                    <Stack gap={4}>
                        {DEFAULT_OG_IMAGE_PLATFORMS.map((platform) => (
                            <Text key={platform.id} size="xs" c="dimmed">
                                <Text span fw={500}>
                                    {platform.label}:
                                </Text>{" "}
                                {platform.width}×{platform.height}px (exact
                                dimensions required)
                            </Text>
                        ))}
                    </Stack>
                </Alert>
            </Stack>
        </Modal>
    );
}
