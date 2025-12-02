"use client";

import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Card,
    FileButton,
    Group,
    Image,
    Loader,
    Stack,
    Text,
    Tooltip,
} from "@mantine/core";
import { IconPhoto, IconTrash, IconUpload } from "@tabler/icons-react";

interface OgImagePlatformCardProps {
    /** Platform display label */
    label: string;
    /** Platform description */
    description: string;
    /** Required image dimensions */
    width: number;
    height: number;
    /** Current image URL (null if not set) */
    imageUrl: string | null;
    /** Whether an upload is in progress */
    isUploading: boolean;
    /** Whether this specific card is being uploaded to */
    isUploadingThis: boolean;
    /** Whether a delete is in progress */
    isDeleting: boolean;
    /** Callback when a file is selected for upload */
    onUpload: (file: File) => void;
    /** Callback when delete is requested */
    onDelete: () => void;
}

/**
 * OgImagePlatformCard - Atom component for displaying and managing
 * a single platform's OG image with upload/delete capabilities
 */
export function OgImagePlatformCard({
    label,
    description,
    width,
    height,
    imageUrl,
    isUploading,
    isUploadingThis,
    isDeleting,
    onUpload,
    onDelete,
}: OgImagePlatformCardProps) {
    const dimensionLabel = `${width}×${height}`;
    const aspectRatio = width / height;
    const isLoading = isUploadingThis || isDeleting;

    const handleFileSelect = (file: File | null) => {
        if (file) {
            onUpload(file);
        }
    };

    return (
        <Card withBorder radius="md" p="md" h="100%">
            <Stack gap="sm" h="100%">
                {/* Header */}
                <Group justify="space-between" align="flex-start">
                    <Box>
                        <Group gap="xs">
                            <Text fw={600} size="sm">
                                {label}
                            </Text>
                            <Badge size="xs" variant="light" color="gray">
                                {dimensionLabel}
                            </Badge>
                        </Group>
                        <Text size="xs" c="dimmed" mt={2}>
                            {description}
                        </Text>
                    </Box>
                    {imageUrl && (
                        <Tooltip label="Delete image">
                            <ActionIcon
                                variant="light"
                                color="red"
                                size="sm"
                                onClick={onDelete}
                                disabled={isLoading}
                            >
                                {isDeleting ? (
                                    <Loader size={14} />
                                ) : (
                                    <IconTrash size={14} />
                                )}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </Group>

                {/* Image Preview */}
                <Box
                    style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: aspectRatio.toString(),
                        borderRadius: "var(--mantine-radius-sm)",
                        overflow: "hidden",
                        backgroundColor: "var(--mantine-color-gray-1)",
                        border: "1px solid var(--mantine-color-gray-3)",
                        flexShrink: 0,
                    }}
                >
                    {isUploadingThis ? (
                        <Box
                            style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Loader size="sm" />
                        </Box>
                    ) : imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={`${label} OG image`}
                            style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <Box
                            style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 4,
                            }}
                        >
                            <IconPhoto
                                size={24}
                                style={{ color: "var(--mantine-color-gray-5)" }}
                            />
                            <Text size="xs" c="dimmed">
                                No image
                            </Text>
                        </Box>
                    )}
                </Box>

                {/* Upload Button */}
                <Box mt="auto">
                    <FileButton
                        onChange={handleFileSelect}
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        disabled={isUploading}
                    >
                        {(props) => (
                            <Button
                                {...props}
                                leftSection={<IconUpload size={16} />}
                                variant={imageUrl ? "light" : "filled"}
                                size="xs"
                                fullWidth
                                loading={isUploadingThis}
                                disabled={isUploading}
                            >
                                {imageUrl ? "Replace" : "Upload"}
                            </Button>
                        )}
                    </FileButton>
                </Box>
            </Stack>
        </Card>
    );
}
