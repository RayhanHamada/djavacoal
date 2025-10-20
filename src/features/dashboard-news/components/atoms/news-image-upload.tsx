"use client";

import { useCallback, useState } from "react";

import Image from "next/image";

import { ActionIcon, Box, Loader, Stack, Text } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import {
    IconEdit,
    IconPhoto,
    IconTrash,
    IconUpload,
    IconX,
} from "@tabler/icons-react";
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
    function getImageUrl(key: string) {
        return `${process.env.NEXT_PUBLIC_ASSET_URL}/${key}`;
    }

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
            const file = files.at(0);
            if (!file) return;

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
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Box w="100%">
            {currentImageUrl ? (
                // Image preview with hover overlay
                <Dropzone
                    onDrop={handleDrop}
                    accept={IMAGE_MIME_TYPE}
                    maxSize={MAX_FILE_SIZE}
                    maxFiles={1}
                    disabled={disabled || isUploading}
                    style={{
                        border: "2px dashed var(--mantine-color-gray-4)",
                        borderRadius: "var(--mantine-radius-md)",
                        padding: 0,
                        minHeight: "auto",
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <Box pos="relative" w="100%">
                        <Image
                            src={currentImageUrl}
                            alt="News article image"
                            objectFit="contain"
                            height={768}
                            width={1024}
                            style={{ margin: "0 auto", display: "block" }}
                        />

                        {/* Hover overlay with change image hint */}
                        {isHovered && !isUploading && !disabled && (
                            <Box
                                pos="absolute"
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                style={{
                                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "var(--mantine-radius-md)",
                                    cursor: "pointer",
                                }}
                            >
                                <Stack align="center" gap="xs">
                                    <IconEdit size={48} color="white" />
                                    <Text size="lg" c="white" fw={600}>
                                        Click or drop to change image
                                    </Text>
                                    <Text size="sm" c="white">
                                        Maximum: 1024×768 pixels, 10MB
                                    </Text>
                                </Stack>
                            </Box>
                        )}

                        {/* Loading overlay */}
                        {isUploading && (
                            <Box
                                pos="absolute"
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                style={{
                                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "var(--mantine-radius-md)",
                                }}
                            >
                                <Stack align="center" gap="xs">
                                    <Loader size="lg" color="white" />
                                    <Text size="md" c="white" fw={500}>
                                        Uploading...
                                    </Text>
                                </Stack>
                            </Box>
                        )}

                        {/* Remove button */}
                        {!isUploading && !disabled && (
                            <ActionIcon
                                pos="absolute"
                                top={12}
                                right={12}
                                color="red"
                                variant="filled"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                                aria-label="Remove image"
                                size="lg"
                                style={{ zIndex: 1 }}
                            >
                                <IconTrash size={18} />
                            </ActionIcon>
                        )}
                    </Box>
                </Dropzone>
            ) : (
                // Empty dropzone
                <Dropzone
                    onDrop={handleDrop}
                    accept={IMAGE_MIME_TYPE}
                    maxSize={MAX_FILE_SIZE}
                    maxFiles={1}
                    disabled={disabled || isUploading}
                    style={{
                        minHeight: 300,
                        border: "2px dashed var(--mantine-color-gray-4)",
                    }}
                >
                    <Stack
                        justify="center"
                        align="center"
                        gap="md"
                        style={{ minHeight: 280, pointerEvents: "none" }}
                    >
                        <Dropzone.Accept>
                            <IconUpload size={52} stroke={1.5} />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <IconX size={52} stroke={1.5} />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <IconPhoto size={52} stroke={1.5} />
                        </Dropzone.Idle>

                        <Stack gap={4} align="center">
                            <Text size="lg" inline fw={600}>
                                Drop image here or click to select
                            </Text>
                            <Text size="sm" c="dimmed" inline>
                                Recommended: 1024×768 pixels
                            </Text>
                            <Text size="sm" c="dimmed" inline>
                                Maximum file size: 10MB
                            </Text>
                        </Stack>
                    </Stack>
                </Dropzone>
            )}
        </Box>
    );
}
