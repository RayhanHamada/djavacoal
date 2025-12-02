"use client";

import { useRef } from "react";

import {
    Button,
    Drawer,
    Group,
    Select,
    Stack,
    TagsInput,
    Textarea,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

import { SITEMAP_CHANGEFREQ_VALUES } from "@/adapters/d1/constants";
import {
    OgImagePicker,
    OgImagePickerRef,
} from "@/features/dashboard-page-settings/components/atoms";
import {
    CreatePageMetadataFormValues,
    MAX_KEYWORDS,
    METADATA_DESCRIPTION_MAX_LENGTH,
    METADATA_DESCRIPTION_MIN_LENGTH,
    METADATA_TITLE_MAX_LENGTH,
    METADATA_TITLE_MIN_LENGTH,
    SITEMAP_CHANGEFREQ_DEFAULT,
    SITEMAP_PRIORITY_DEFAULT,
    SITEMAP_PRIORITY_OPTIONS,
    validateCreatePageMetadataForm,
} from "@/features/dashboard-page-settings/lib";
import { rpc } from "@/lib/rpc";

interface CreatePageMetadataDrawerProps {
    opened: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

/**
 * Drawer component for creating a new page metadata entry
 */
export function CreatePageMetadataDrawer({
    opened,
    onClose,
    onSuccess,
}: CreatePageMetadataDrawerProps) {
    const ogImagePickerRef = useRef<OgImagePickerRef>(null);

    const form = useForm<CreatePageMetadataFormValues>({
        mode: "uncontrolled",
        initialValues: {
            path: "",
            metadata_title: "",
            metadata_description: "",
            metadata_keywords: [],
            sitemap_priority: SITEMAP_PRIORITY_DEFAULT,
            sitemap_changefreq: SITEMAP_CHANGEFREQ_DEFAULT,
            og_image_key: null,
        },
        validate: validateCreatePageMetadataForm,
    });

    const createMutation = useMutation(
        rpc.pageSettings.createPageMetadata.mutationOptions({
            async onMutate() {
                notifications.show({
                    title: "Creating...",
                    message: "Creating page metadata entry",
                    color: "blue",
                    position: "bottom-center",
                });
            },
            async onSuccess(_, __, ___, context) {
                notifications.show({
                    title: "Success",
                    message: "Page metadata created successfully",
                    color: "green",
                    position: "bottom-center",
                });

                context.client.invalidateQueries({
                    queryKey: rpc.pageSettings.listPageMetadata.key(),
                });

                form.reset();
                onSuccess();
                onClose();
            },
            async onError(error) {
                notifications.show({
                    title: "Error",
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to create page metadata",
                    color: "red",
                    position: "bottom-center",
                });
            },
        })
    );

    const handleSubmit = form.onSubmit(async (values) => {
        try {
            // Upload pending OG image if any
            const ogImageKey =
                await ogImagePickerRef.current?.uploadPendingFile();

            await createMutation.mutateAsync({
                ...values,
                og_image_key: ogImageKey ?? null,
            });
        } catch (error) {
            console.error("Failed to create page metadata:", error);
            notifications.show({
                title: "Error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to upload image",
                color: "red",
                position: "bottom-center",
            });
        }
    });

    function handleClose() {
        if (!createMutation.isPending) {
            form.reset();
            onClose();
        }
    }

    return (
        <Drawer
            opened={opened}
            onClose={handleClose}
            title="Create Page Metadata"
            position="right"
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

                    <Select
                        label="Sitemap Priority"
                        description="Priority for sitemap.xml (1.0 = highest)"
                        required
                        data={SITEMAP_PRIORITY_OPTIONS.map((opt) => ({
                            value: opt.value.toString(),
                            label: opt.label,
                        }))}
                        key={form.key("sitemap_priority")}
                        value={form.getValues().sitemap_priority.toString()}
                        onChange={(value) => {
                            form.setFieldValue(
                                "sitemap_priority",
                                parseFloat(value ?? "0.5")
                            );
                        }}
                        disabled={createMutation.isPending}
                    />

                    <Select
                        label="Sitemap Change Frequency"
                        description="Expected update frequency for sitemap.xml"
                        required
                        data={[
                            {
                                value: SITEMAP_CHANGEFREQ_VALUES.ALWAYS,
                                label: "Always",
                            },
                            {
                                value: SITEMAP_CHANGEFREQ_VALUES.HOURLY,
                                label: "Hourly",
                            },
                            {
                                value: SITEMAP_CHANGEFREQ_VALUES.DAILY,
                                label: "Daily",
                            },
                            {
                                value: SITEMAP_CHANGEFREQ_VALUES.WEEKLY,
                                label: "Weekly",
                            },
                            {
                                value: SITEMAP_CHANGEFREQ_VALUES.MONTHLY,
                                label: "Monthly",
                            },
                            {
                                value: SITEMAP_CHANGEFREQ_VALUES.YEARLY,
                                label: "Yearly",
                            },
                            {
                                value: SITEMAP_CHANGEFREQ_VALUES.NEVER,
                                label: "Never",
                            },
                        ]}
                        key={form.key("sitemap_changefreq")}
                        {...form.getInputProps("sitemap_changefreq")}
                        disabled={createMutation.isPending}
                    />

                    <OgImagePicker
                        ref={ogImagePickerRef}
                        value={form.getValues().og_image_key}
                        onChange={(key) =>
                            form.setFieldValue("og_image_key", key)
                        }
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
        </Drawer>
    );
}
