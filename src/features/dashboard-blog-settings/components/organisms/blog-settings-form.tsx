"use client";

import { Button, Card, Group, Stack } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";

import {
    LoadingState,
    SectionHeader,
} from "@/features/dashboard-blog-settings/components/atoms";
import { BlogSettingsFormFields } from "@/features/dashboard-blog-settings/components/molecules";
import { useBlogSettingsForm } from "@/features/dashboard-blog-settings/hooks";
import { UI_TEXT } from "@/features/dashboard-blog-settings/lib";

/**
 * BlogSettingsForm - Organism component for managing blog sitemap settings
 * Orchestrates the entire form with header, fields, and save action
 * Follows atomic design pattern and clean code principles
 */
export function BlogSettingsForm() {
    const { formValues, setFormValues, isLoading, isSaving, handleSave } =
        useBlogSettingsForm();

    if (isLoading) {
        return (
            <Stack gap="xl">
                <SectionHeader
                    title={UI_TEXT.FORM_TITLE}
                    description={UI_TEXT.FORM_DESCRIPTION}
                />
                <LoadingState />
            </Stack>
        );
    }

    return (
        <Stack gap="xl">
            <SectionHeader
                title={UI_TEXT.FORM_TITLE}
                description={UI_TEXT.FORM_DESCRIPTION}
            />

            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="xl">
                    <BlogSettingsFormFields
                        values={formValues}
                        onChange={setFormValues}
                        disabled={isSaving}
                    />

                    <Group justify="flex-end">
                        <Button
                            leftSection={<IconDeviceFloppy size={18} />}
                            onClick={handleSave}
                            loading={isSaving}
                            size="md"
                        >
                            {UI_TEXT.SAVE_BUTTON}
                        </Button>
                    </Group>
                </Stack>
            </Card>
        </Stack>
    );
}
