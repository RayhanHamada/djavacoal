"use client";

import { useEffect } from "react";

import {
    Button,
    Group,
    Modal,
    Stack,
    TagsInput,
    Textarea,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
    EditPageMetadataFormValues,
    validateEditPageMetadataForm,
} from "@/features/dashboard-page-settings/lib/form-schema";
import {
    METADATA_DESCRIPTION_MAX_LENGTH,
    METADATA_DESCRIPTION_MIN_LENGTH,
    METADATA_TITLE_MAX_LENGTH,
    METADATA_TITLE_MIN_LENGTH,
    MAX_KEYWORDS,
} from "@/features/dashboard-page-settings/server/constants";
import { client, rpc } from "@/lib/rpc";

interface EditPageMetadataModalProps {
    opened: boolean;
    onClose: () => void;
    pageMetadataId: number | null;
    onSuccess: () => void;
}

/**
 * Modal component for editing an existing page metadata entry
 */
export function EditPageMetadataModal({
    opened,
    onClose,
    pageMetadataId,
    onSuccess,
}: EditPageMetadataModalProps) {
    const form = useForm<EditPageMetadataFormValues>({
        mode: "uncontrolled",
        initialValues: {
            id: 0,
            path: "",
            metadata_title: "",
            metadata_description: "",
            metadata_keywords: [],
        },
        validate: validateEditPageMetadataForm,
    });

    // Fetch existing page metadata
    const pageMetadataQuery = useQuery({
        ...rpc.pageSettings.getPageMetadataById.queryOptions({
            input: {
                id: pageMetadataId ?? 0,
            },
        }),
        enabled: opened && pageMetadataId !== null,
    });

    // Populate form when data is loaded
    useEffect(() => {
        if (pageMetadataQuery.data && opened) {
            form.setValues({
                id: pageMetadataQuery.data.id,
                path: pageMetadataQuery.data.path,
                metadata_title: pageMetadataQuery.data.metadata_title,
                metadata_description:
                    pageMetadataQuery.data.metadata_description,
                metadata_keywords: pageMetadataQuery.data.metadata_keywords,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageMetadataQuery.data, opened]);

    const updateMutation = useMutation({
        mutationFn: async (values: EditPageMetadataFormValues) => {
            return client.pageSettings.updatePageMetadata(values);
        },
        onSuccess: () => {
            notifications.show({
                title: "Success",
                message: "Page metadata updated successfully",
                color: "green",
            });
            onSuccess();
            onClose();
        },
        onError: (error) => {
            notifications.show({
                title: "Error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to update page metadata",
                color: "red",
            });
        },
    });

    const handleSubmit = form.onSubmit(async (values) => {
        await updateMutation.mutateAsync(values);
    });

    function handleClose() {
        if (!updateMutation.isPending) {
            form.reset();
            onClose();
        }
    }

    const isLoading = pageMetadataQuery.isLoading || updateMutation.isPending;

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title="Edit Page Metadata"
            size="lg"
            closeOnClickOutside={!updateMutation.isPending}
            closeOnEscape={!updateMutation.isPending}
        >
            <form onSubmit={handleSubmit}>
                <Stack gap="md">
                    <TextInput
                        label="Path"
                        description="The page path (e.g., /about, /contact)"
                        placeholder="/about"
                        required
                        key={form.key("path")}
                        {...form.getInputProps("path")}
                        disabled={isLoading}
                    />

                    <TextInput
                        label="Meta Title"
                        description={`SEO title (${METADATA_TITLE_MIN_LENGTH}-${METADATA_TITLE_MAX_LENGTH} characters)`}
                        placeholder="About Us - Company Name"
                        required
                        key={form.key("metadata_title")}
                        {...form.getInputProps("metadata_title")}
                        disabled={isLoading}
                    />

                    <Textarea
                        label="Meta Description"
                        description={`SEO description (${METADATA_DESCRIPTION_MIN_LENGTH}-${METADATA_DESCRIPTION_MAX_LENGTH} characters)`}
                        placeholder="Learn more about our company..."
                        required
                        minRows={3}
                        key={form.key("metadata_description")}
                        {...form.getInputProps("metadata_description")}
                        disabled={isLoading}
                    />

                    <TagsInput
                        label="Keywords"
                        description={`SEO keywords (max ${MAX_KEYWORDS})`}
                        placeholder="Enter keyword and press Enter"
                        key={form.key("metadata_keywords")}
                        {...form.getInputProps("metadata_keywords")}
                        disabled={isLoading}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button
                            variant="subtle"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" loading={isLoading}>
                            Update
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
