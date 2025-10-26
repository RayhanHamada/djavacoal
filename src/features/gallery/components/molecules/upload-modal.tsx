"use client";

import { useEffect, useState } from "react";

import {
    ActionIcon,
    Box,
    Button,
    Group,
    Image,
    Loader,
    Modal,
    Progress,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useDebounceFn } from "ahooks";

import { client } from "@/lib/rpc";

interface FileToUpload {
    file: File;
    name: string;
    error?: string;
    previewUrl?: string;
}

type UploadStage =
    | "idle"
    | "getting-presigned-url"
    | "uploading"
    | "confirming-upload";

interface UploadProgress {
    currentFile: number;
    totalFiles: number;
    stage: UploadStage;
    fileName: string;
}

interface UploadModalProps {
    /** Whether the modal is open */
    opened: boolean;
    /** Callback when modal is closed */
    onClose: () => void;
    /** Files to upload */
    files: File[];
    /** Callback when upload is successful */
    onSuccess: () => void;
}

/**
 * UploadModal component for preparing and uploading multiple files
 * Allows users to name each file before uploading
 */
export function UploadModal({
    opened,
    onClose,
    files,
    onSuccess,
}: UploadModalProps) {
    const [filesToUpload, setFilesToUpload] = useState<FileToUpload[]>([]);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
        currentFile: 0,
        totalFiles: 0,
        stage: "idle",
        fileName: "",
    });

    const isLoading = uploadProgress.stage !== "idle";

    // Update filesToUpload when files prop changes
    useEffect(() => {
        if (opened && files.length > 0) {
            // Create preview URLs for each file
            const filesWithPreviews = files.map((file) => {
                const previewUrl = URL.createObjectURL(file);
                return {
                    file,
                    name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                    error: undefined,
                    previewUrl,
                };
            });
            setFilesToUpload(filesWithPreviews);

            // Cleanup preview URLs when component unmounts
            return () => {
                filesWithPreviews.forEach((f) => {
                    if (f.previewUrl) {
                        URL.revokeObjectURL(f.previewUrl);
                    }
                });
            };
        }
    }, [opened, files]);

    // Mutation for uploading
    const uploadMutation = useMutation({
        mutationFn: async () => {
            const totalFiles = filesToUpload.length;

            // Upload each file
            for (let i = 0; i < filesToUpload.length; i++) {
                const fileToUpload = filesToUpload[i];
                const { file, name } = fileToUpload;
                const currentFileIndex = i + 1;

                // Step 1: Get presigned URL
                setUploadProgress({
                    currentFile: currentFileIndex,
                    totalFiles,
                    stage: "getting-presigned-url",
                    fileName: name,
                });

                const { uploadUrl, key, photoId } =
                    await client.gallery.createPresignedUrl({
                        name,
                        mimeType: file.type,
                        size: file.size,
                    });

                // Step 2: Upload file to R2
                setUploadProgress({
                    currentFile: currentFileIndex,
                    totalFiles,
                    stage: "uploading",
                    fileName: name,
                });

                const uploadResponse = await fetch(uploadUrl, {
                    method: "PUT",
                    body: file,
                    headers: {
                        "Content-Type": file.type,
                    },
                });

                if (!uploadResponse.ok) {
                    throw new Error(`Failed to upload ${name}`);
                }

                // Step 3: Confirm upload
                setUploadProgress({
                    currentFile: currentFileIndex,
                    totalFiles,
                    stage: "confirming-upload",
                    fileName: name,
                });

                await client.gallery.confirmUpload({
                    photoId,
                    name,
                    key,
                    size: file.size,
                    // @ts-expect-error - mimeType is missing in the generated types
                    mimeType: file.type,
                });
            }
        },
        onSuccess: () => {
            notifications.show({
                title: "Success",
                message: `Uploaded ${filesToUpload.length} photo(s)`,
                color: "green",
            });
            setUploadProgress({
                currentFile: 0,
                totalFiles: 0,
                stage: "idle",
                fileName: "",
            });
            onSuccess();
            onClose();
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
            setUploadProgress({
                currentFile: 0,
                totalFiles: 0,
                stage: "idle",
                fileName: "",
            });
        },
    });

    /**
     * Remove a file from the upload list
     */
    const removeFile = (index: number) => {
        setFilesToUpload((prev) => {
            const updated = [...prev];
            // Revoke the preview URL before removing
            if (updated[index].previewUrl) {
                URL.revokeObjectURL(updated[index].previewUrl!);
            }
            updated.splice(index, 1);
            return updated;
        });
    };

    /**
     * Update file name and check availability
     */
    const updateFileName = (index: number, name: string) => {
        setFilesToUpload((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], name, error: undefined };
            return updated;
        });
    };

    /**
     * Check if name is available (debounced)
     */
    const checkNameAvailability = async (name: string, index: number) => {
        if (name.length < 8 || name.length > 100) {
            setFilesToUpload((prev) => {
                const updated = [...prev];
                updated[index] = {
                    ...updated[index],
                    error: "Name must be 8-100 characters",
                };
                return updated;
            });
            return;
        }

        try {
            const result = await client.gallery.checkNameAvailability({
                name,
            });

            setFilesToUpload((prev) => {
                const updated = [...prev];
                updated[index] = {
                    ...updated[index],
                    error: result.available ? undefined : "Name already taken",
                };
                return updated;
            });
        } catch (error) {
            console.error("Error checking name availability:", error);
        }
    };

    // Debounced name availability check
    const { run: debouncedCheckName } = useDebounceFn(
        (name: string, index: number) => checkNameAvailability(name, index),
        { wait: 1000 }
    );

    /**
     * Handle file upload
     */
    const handleUpload = async () => {
        // Validate all files
        const hasErrors = filesToUpload.some(
            (f) => f.error || f.name.length < 8 || f.name.length > 100
        );

        if (hasErrors) {
            notifications.show({
                title: "Validation Error",
                message: "Please fix all errors before uploading",
                color: "red",
            });
            return;
        }

        await uploadMutation.mutateAsync();
    };

    /**
     * Get stage display text
     */
    const getStageText = (stage: UploadStage): string => {
        switch (stage) {
            case "getting-presigned-url":
                return "Getting upload URL...";
            case "uploading":
                return "Uploading to storage...";
            case "confirming-upload":
                return "Confirming upload...";
            default:
                return "";
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Prepare Upload"
            size="lg"
            closeOnClickOutside={!isLoading}
            closeOnEscape={!isLoading}
            withCloseButton={!isLoading}
        >
            <Stack gap="md">
                {isLoading ? (
                    // Loading state with progress
                    <Stack gap="md">
                        <Text size="sm" fw={500}>
                            Uploading {uploadProgress.currentFile} of{" "}
                            {uploadProgress.totalFiles}
                        </Text>
                        <Progress
                            value={
                                (uploadProgress.currentFile /
                                    uploadProgress.totalFiles) *
                                100
                            }
                            size="lg"
                            animated
                        />
                        <Group gap="xs">
                            <Loader size="sm" />
                            <Text size="sm" c="dimmed">
                                {getStageText(uploadProgress.stage)}
                            </Text>
                        </Group>
                        <Text size="sm" c="dimmed" fs="italic">
                            {uploadProgress.fileName}
                        </Text>
                        <Text size="xs" c="orange" ta="center">
                            Please don&apos;t close this window during upload
                        </Text>
                    </Stack>
                ) : (
                    // File preparation state
                    <>
                        <Text size="sm" c="dimmed">
                            Give each photo a unique name (8-100 characters)
                        </Text>

                        {filesToUpload.length === 0 ? (
                            <Text size="sm" c="dimmed" ta="center" py="xl">
                                No files to upload. All files have been removed.
                            </Text>
                        ) : (
                            filesToUpload.map((fileToUpload, index) => (
                                <Group
                                    key={index}
                                    align="flex-start"
                                    gap="md"
                                    wrap="nowrap"
                                >
                                    {/* Thumbnail */}
                                    <Box
                                        w={64}
                                        h={64}
                                        style={{
                                            flexShrink: 0,
                                            overflow: "hidden",
                                            borderRadius:
                                                "var(--mantine-radius-sm)",
                                            border: "1px solid var(--mantine-color-gray-3)",
                                            backgroundColor:
                                                "var(--mantine-color-gray-0)",
                                        }}
                                    >
                                        <Image
                                            src={fileToUpload.previewUrl}
                                            alt={fileToUpload.file.name}
                                            fit="contain"
                                            h="100%"
                                            w="100%"
                                        />
                                    </Box>

                                    {/* Text input */}
                                    <Box style={{ flex: 1 }}>
                                        <TextInput
                                            label={`Photo ${index + 1}: ${fileToUpload.file.name}`}
                                            placeholder="Enter photo name"
                                            value={fileToUpload.name}
                                            onChange={(event) => {
                                                const newName =
                                                    event.currentTarget.value;
                                                updateFileName(index, newName);
                                                debouncedCheckName(
                                                    newName,
                                                    index
                                                );
                                            }}
                                            error={fileToUpload.error}
                                            required
                                        />
                                    </Box>

                                    {/* Remove button */}
                                    <ActionIcon
                                        color="red"
                                        variant="subtle"
                                        onClick={() => removeFile(index)}
                                        mt={24}
                                        aria-label="Remove file"
                                        disabled={isLoading}
                                    >
                                        <IconTrash size={18} />
                                    </ActionIcon>
                                </Group>
                            ))
                        )}

                        <Group justify="flex-end" gap="sm">
                            <Button variant="subtle" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpload}
                                disabled={filesToUpload.length === 0}
                            >
                                Upload {filesToUpload.length} Photo(s)
                            </Button>
                        </Group>
                    </>
                )}
            </Stack>
        </Modal>
    );
}
