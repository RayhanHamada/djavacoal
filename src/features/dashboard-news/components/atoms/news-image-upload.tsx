"use client";

import { useCallback, useState } from "react";

import {
    ActionIcon,
    AspectRatio,
    Box,
    Image,
    Loader,
    Stack,
    Text,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IconPhoto, IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface NewsImageUploadProps {
    /** Current image key (if exists) */
    imageKey?: string | null;
    /** Callback when image is uploaded */
    onImageUploaded: (key: string) => void;
    /** Callback when image is removed */
    onImageRemoved: () => void;
    /** Whether the component is disabled */
    disabled?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * NewsImageUpload component for uploading news article images
 * Displays preview in 4:3 aspect ratio
 */
export function NewsImageUpload({
    imageKey,
    onImageUploaded,
    onImageRemoved,
    disabled = false,
}: NewsImageUploadProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Get R2 public URL for image key
    const getImageUrl = (key: string) => {
        // TODO: Replace with actual R2 public URL pattern
        return `${process.env.NEXT_PUBLIC_ASSET_URL}/r2/${key}`;
    };

    // Upload mutation
    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            // Step 1: Get presigned URL
            const { uploadUrl, key } =
                await client.dashboardNews.generateImageUploadUrl({
                    fileName: file.name,
                    contentType: file.type,
                    fileSize: file.size,
                });

            // Step 2: Upload to R2
            const uploadResponse = await fetch(uploadUrl, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                },
            });

            if (!uploadResponse.ok) {
                throw new Error("Failed to upload image");
            }

            return key;
        },
        onSuccess: (key) => {
            notifications.show({
                title: "Success",
                message: "Image uploaded successfully",
                color: "green",
            });
            onImageUploaded(key);
        },
        onError: (error) => {
            console.error("Upload error:", error);
            notifications.show({
                title: "Upload Failed",
                message:
                    error instanceof Error
                        ? error.message
                        : "An error occurred",
                color: "red",
            });
            setPreviewUrl(null);
        },
    });

    const handleDrop = useCallback(
        (files: File[]) => {
            if (files.length === 0) return;

            const file = files[0];

            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                notifications.show({
                    title: "File too large",
                    message: "Image must be less than 10MB",
                    color: "red",
                });
                return;
            }

            // Create preview
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            // Upload file
            uploadMutation.mutate(file);
        },
        [uploadMutation]
    );

    const handleRemove = useCallback(() => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        onImageRemoved();
    }, [previewUrl, onImageRemoved]);

    const currentImageUrl =
        previewUrl || (imageKey ? getImageUrl(imageKey) : null);
    const isUploading = uploadMutation.isPending;

    return (
        <Box display="flex" style={{ justifyContent: "center" }}>
            <AspectRatio ratio={16 / 9} maw={600}>
                {currentImageUrl ? (
                    // Image preview
                    <Box pos="relative" w="100%" h="100%">
                        <Image
                            src={currentImageUrl}
                            alt="News article image"
                            fit="cover"
                            w="100%"
                            h="100%"
                            radius="md"
                        />

                        {/* Loading overlay */}
                        {isUploading && (
                            <Box
                                pos="absolute"
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                style={{
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "var(--mantine-radius-md)",
                                }}
                            >
                                <Stack align="center" gap="xs">
                                    <Loader size="md" color="white" />
                                    <Text size="sm" c="white" fw={500}>
                                        Uploading...
                                    </Text>
                                </Stack>
                            </Box>
                        )}

                        {/* Remove button */}
                        {!isUploading && !disabled && (
                            <ActionIcon
                                pos="absolute"
                                top={8}
                                right={8}
                                color="red"
                                variant="filled"
                                onClick={handleRemove}
                                aria-label="Remove image"
                                size="md"
                            >
                                <IconTrash size={16} />
                            </ActionIcon>
                        )}
                    </Box>
                ) : (
                    // Dropzone
                    <Dropzone
                        onDrop={handleDrop}
                        accept={IMAGE_MIME_TYPE}
                        maxSize={MAX_FILE_SIZE}
                        maxFiles={1}
                        disabled={disabled || isUploading}
                    >
                        <Stack
                            justify="center"
                            align="center"
                            gap="md"
                            style={{ minHeight: 120, pointerEvents: "none" }}
                        >
                            <Dropzone.Accept>
                                <IconUpload size={32} stroke={1.5} />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX size={32} stroke={1.5} />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <IconPhoto size={32} stroke={1.5} />
                            </Dropzone.Idle>

                            <Stack gap={4} align="center">
                                <Text size="sm" inline fw={500}>
                                    Drop image here or click to select
                                </Text>
                                <Text size="xs" c="dimmed" inline>
                                    Maximum file size: 10MB
                                </Text>
                            </Stack>
                        </Stack>
                    </Dropzone>
                )}
            </AspectRatio>
        </Box>
    );
}
