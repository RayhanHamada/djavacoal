"use client";

import { useEffect } from "react";

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
import { useMutation, useQuery } from "@tanstack/react-query";

import { SITEMAP_CHANGEFREQ_VALUES } from "@/adapters/d1/constants";
import {
    EditPageMetadataFormValues,
    validateEditPageMetadataForm,
} from "@/features/dashboard-page-settings/lib/form-schema";
import {
    MAX_KEYWORDS,
    METADATA_DESCRIPTION_MAX_LENGTH,
    METADATA_DESCRIPTION_MIN_LENGTH,
    METADATA_TITLE_MAX_LENGTH,
    METADATA_TITLE_MIN_LENGTH,
    SITEMAP_CHANGEFREQ_DEFAULT,
    SITEMAP_PRIORITY_DEFAULT,
    SITEMAP_PRIORITY_OPTIONS,
} from "@/features/dashboard-page-settings/server/constants";
import { rpc } from "@/lib/rpc";

interface EditPageMetadataDrawerProps {
    opened: boolean;
    onClose: () => void;
    pageMetadataId: number | null;
    onSuccess: () => void;
}

/**
 * Drawer component for editing an existing page metadata entry
 */
export function EditPageMetadataDrawer({
    opened,
    onClose,
    pageMetadataId,
    onSuccess,
}: EditPageMetadataDrawerProps) {
    const form = useForm<EditPageMetadataFormValues>({
        mode: "uncontrolled",
        initialValues: {
            id: 0,
            path: "",
            metadata_title: "",
            metadata_description: "",
            metadata_keywords: [],
            sitemap_priority: SITEMAP_PRIORITY_DEFAULT,
            sitemap_changefreq: SITEMAP_CHANGEFREQ_DEFAULT,
        },
        validate: validateEditPageMetadataForm,
    });

    // Fetch existing page metadata
    const pageMetadataQuery = useQuery(
        rpc.pageSettings.getPageMetadataById.queryOptions({
            input: {
                id: pageMetadataId ?? 0,
            },
            enabled: opened && pageMetadataId !== null,
        })
    );

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
                sitemap_priority: pageMetadataQuery.data.sitemap_priority,
                sitemap_changefreq: pageMetadataQuery.data.sitemap_changefreq,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageMetadataQuery.data, opened]);

    const updateMutation = useMutation(
        rpc.pageSettings.updatePageMetadata.mutationOptions({
            onSuccess: (_, __, ___, context) => {
                notifications.show({
                    title: "Success",
                    message: "Page metadata updated successfully",
                    color: "green",
                });
                context.client.invalidateQueries({
                    queryKey: rpc.pageSettings.listPageMetadata.key(),
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
                            : "Failed to update page metadata",
                    color: "red",
                });
            },
        })
    );

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
        <Drawer
            opened={opened}
            onClose={handleClose}
            title="Edit Page Metadata"
            position="right"
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
                        disabled={isLoading}
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
        </Drawer>
    );
}
