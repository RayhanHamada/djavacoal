"use client";

import type { TeamMemberListItem } from "@/features/dashboard-page-settings/server/team-members/schemas";

import { useEffect } from "react";

import Image from "next/image";

import {
    Box,
    Button,
    FileButton,
    Flex,
    Group,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPhoto, IconX } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { PhotoView } from "react-photo-view";

import { useFileUpload } from "@/features/dashboard-page-settings/hooks/team-members";
import {
    validateCreateTeamMemberForm,
    validateEditTeamMemberForm,
} from "@/features/dashboard-page-settings/lib";
import { rpc } from "@/lib/rpc";

interface TeamMemberFormProps {
    teamMember?: TeamMemberListItem;
    onSubmit: (data: {
        name: string;
        position: string;
        photo_key: string;
    }) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

/**
 * TeamMemberForm component for creating/editing team members
 */
export function TeamMemberForm({
    teamMember,
    onSubmit,
    onCancel,
    isSubmitting,
}: TeamMemberFormProps) {
    const { file, preview, handleFileSelect, clearFile } = useFileUpload();

    // Use different validators for create vs edit
    const isEditMode = !!teamMember;

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: teamMember?.name || "",
            position: teamMember?.position || "",
            existingPhotoKey: teamMember?.photo_key || "",
        },
        validate: (values) => {
            // First, run the schema validation
            const validator = isEditMode
                ? validateEditTeamMemberForm
                : validateCreateTeamMemberForm;
            const schemaErrors = validator(values);

            // Then add custom photo validation that considers file state
            if (!file && !values.existingPhotoKey) {
                return {
                    ...schemaErrors,
                    existingPhotoKey: "Photo is required",
                };
            }

            return schemaErrors;
        },
        validateInputOnBlur: true,
    });

    // Reset form when teamMember changes
    useEffect(() => {
        if (teamMember) {
            form.setValues({
                name: teamMember.name,
                position: teamMember.position,
                existingPhotoKey: teamMember.photo_key,
            });
            clearFile();
        } else {
            form.reset();
            clearFile();
        }
        form.clearErrors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teamMember, clearFile]);

    // Clear photo error when file is selected
    useEffect(() => {
        if (file) {
            form.clearFieldError("existingPhotoKey");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file]);

    const uploadMutation = useMutation(
        rpc.pageSettings.generateTeamMemberUploadUrl.mutationOptions()
    );

    const handleSubmit = form.onSubmit(async (values) => {
        // Validate photo
        if (!file && !values.existingPhotoKey) {
            form.setFieldError("existingPhotoKey", "Photo is required");
            return;
        }

        let photoKey = values.existingPhotoKey;

        // Upload new photo if selected
        if (file) {
            try {
                // Generate presigned URL
                const { upload_url, photo_key } =
                    await uploadMutation.mutateAsync({
                        filename: file.name,
                        contentType: file.type,
                        fileSize: file.size,
                    });

                // Upload to R2
                const uploadResponse = await fetch(upload_url, {
                    method: "PUT",
                    body: file,
                    headers: {
                        "Content-Type": file.type,
                    },
                });

                if (!uploadResponse.ok) {
                    throw new Error("Failed to upload photo");
                }

                photoKey = photo_key;
            } catch (error) {
                form.setFieldError(
                    "existingPhotoKey",
                    error instanceof Error
                        ? error.message
                        : "Failed to upload photo"
                );
                return;
            }
        }

        onSubmit({
            name: values.name.trim(),
            position: values.position.trim(),
            photo_key: photoKey,
        });
    });

    // Get current form values for display
    const formValues = form.getValues();
    const displayImageSrc = preview
        ? preview
        : formValues.existingPhotoKey
          ? `${process.env.NEXT_PUBLIC_ASSET_URL}${formValues.existingPhotoKey}`
          : null;

    return (
        <Stack gap="md">
            <TextInput
                label="Name"
                placeholder="Enter team member name"
                required
                disabled={isSubmitting}
                maxLength={150}
                {...form.getInputProps("name")}
            />

            <TextInput
                label="Position"
                placeholder="Enter position/role"
                required
                disabled={isSubmitting}
                maxLength={150}
                {...form.getInputProps("position")}
            />

            <Box>
                <Group gap="xs" mb="xs">
                    <Text size="sm" fw={500}>
                        Photo{" "}
                        <Text span c="red">
                            *
                        </Text>
                    </Text>
                </Group>

                <Text size="xs" c="dimmed" mb="sm">
                    Recommended: Portrait aspect ratio (3:4). Max size: 10MB
                </Text>

                <FileButton accept="image/*" onChange={handleFileSelect}>
                    {(props) => (
                        <Button
                            {...props}
                            leftSection={<IconPhoto size={16} />}
                            variant="light"
                            fullWidth
                        >
                            {file || formValues.existingPhotoKey
                                ? "Change Photo"
                                : "Select Photo"}
                        </Button>
                    )}
                </FileButton>

                {form.errors.existingPhotoKey && (
                    <Text c="red" size="sm" mt="xs">
                        {form.errors.existingPhotoKey}
                    </Text>
                )}

                {displayImageSrc && (
                    <Box mt="md" pos="relative">
                        <Flex justify="center">
                            <PhotoView src={displayImageSrc}>
                                <Image
                                    src={displayImageSrc}
                                    alt="Preview"
                                    objectFit="contain"
                                    height={200}
                                    width={150}
                                />
                            </PhotoView>
                        </Flex>

                        {file && (
                            <Button
                                pos="absolute"
                                top={8}
                                right={8}
                                size="sm"
                                color="red"
                                leftSection={<IconX size={14} />}
                                onClick={() => {
                                    clearFile();
                                    if (!teamMember) {
                                        form.setFieldValue(
                                            "existingPhotoKey",
                                            ""
                                        );
                                    }
                                }}
                                disabled={isSubmitting}
                            >
                                Remove
                            </Button>
                        )}
                    </Box>
                )}
            </Box>

            <Group justify="flex-end" mt="md">
                <Button
                    variant="subtle"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => handleSubmit()}
                    loading={isSubmitting || uploadMutation.isPending}
                    disabled={isSubmitting || uploadMutation.isPending}
                >
                    {teamMember ? "Update" : "Create"}
                </Button>
            </Group>
        </Stack>
    );
}
