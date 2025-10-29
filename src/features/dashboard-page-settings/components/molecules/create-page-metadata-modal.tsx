"use client";

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
import { useMutation } from "@tanstack/react-query";

import {
    CreatePageMetadataFormValues,
    validateCreatePageMetadataForm,
} from "@/features/dashboard-page-settings/lib/form-schema";
import {
    METADATA_DESCRIPTION_MAX_LENGTH,
    METADATA_DESCRIPTION_MIN_LENGTH,
    METADATA_TITLE_MAX_LENGTH,
    METADATA_TITLE_MIN_LENGTH,
    MAX_KEYWORDS,
} from "@/features/dashboard-page-settings/server/constants";
import { client } from "@/lib/rpc";

interface CreatePageMetadataModalProps {
    opened: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

/**
 * Modal component for creating a new page metadata entry
 */
export function CreatePageMetadataModal({
    opened,
    onClose,
    onSuccess,
}: CreatePageMetadataModalProps) {
    const form = useForm<CreatePageMetadataFormValues>({
        mode: "uncontrolled",
        initialValues: {
            path: "",
            metadata_title: "",
            metadata_description: "",
            metadata_keywords: [],
        },
        validate: validateCreatePageMetadataForm,
    });

    const createMutation = useMutation({
        mutationFn: async (values: CreatePageMetadataFormValues) => {
            return client.pageSettings.createPageMetadata(values);
        },
        onSuccess: () => {
            notifications.show({
                title: "Success",
                message: "Page metadata created successfully",
                color: "green",
            });
            form.reset();
            onSuccess();
            onClose();
        },
        onError: (error) => {
            notifications.show({
                title: "Error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to create page metadata",
                color: "red",
            });
        },
    });

    const handleSubmit = form.onSubmit(async (values) => {
        await createMutation.mutateAsync(values);
    });

    function handleClose() {
        if (!createMutation.isPending) {
            form.reset();
            onClose();
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title="Create Page Metadata"
            size="lg"
            closeOnClickOutside={!createMutation.isPending}
            closeOnEscape={!createMutation.isPending}
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
                        disabled={createMutation.isPending}
                    />

                    <TextInput
                        label="Meta Title"
                        description={`SEO title (${METADATA_TITLE_MIN_LENGTH}-${METADATA_TITLE_MAX_LENGTH} characters)`}
                        placeholder="About Us - Company Name"
                        required
                        key={form.key("metadata_title")}
                        {...form.getInputProps("metadata_title")}
                        disabled={createMutation.isPending}
                    />

                    <Textarea
                        label="Meta Description"
                        description={`SEO description (${METADATA_DESCRIPTION_MIN_LENGTH}-${METADATA_DESCRIPTION_MAX_LENGTH} characters)`}
                        placeholder="Learn more about our company..."
                        required
                        minRows={3}
                        key={form.key("metadata_description")}
                        {...form.getInputProps("metadata_description")}
                        disabled={createMutation.isPending}
                    />

                    <TagsInput
                        label="Keywords"
                        description={`SEO keywords (max ${MAX_KEYWORDS})`}
                        placeholder="Enter keyword and press Enter"
                        key={form.key("metadata_keywords")}
                        {...form.getInputProps("metadata_keywords")}
                        disabled={createMutation.isPending}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button
                            variant="subtle"
                            onClick={handleClose}
                            disabled={createMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={createMutation.isPending}
                        >
                            Create
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
