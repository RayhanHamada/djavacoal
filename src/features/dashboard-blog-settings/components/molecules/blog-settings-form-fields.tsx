"use client";

import type { BlogSettingsFormValues } from "@/features/dashboard-blog-settings/lib";

import { Stack } from "@mantine/core";

import {
    ChangeFrequencySelect,
    InfoAlert,
    PriorityInput,
} from "@/features/dashboard-blog-settings/components/atoms";

interface BlogSettingsFormFieldsProps {
    values: BlogSettingsFormValues;
    onChange: (values: BlogSettingsFormValues) => void;
    disabled?: boolean;
}

/**
 * BlogSettingsFormFields - Molecule component that groups related form fields
 * Combines info alert and input fields for blog settings
 */
export function BlogSettingsFormFields({
    values,
    onChange,
    disabled = false,
}: BlogSettingsFormFieldsProps) {
    const handleChangefreqChange = (
        changefreq: BlogSettingsFormValues["changefreq"]
    ) => {
        onChange({ ...values, changefreq });
    };

    const handlePriorityChange = (
        priority: BlogSettingsFormValues["priority"]
    ) => {
        onChange({ ...values, priority });
    };

    return (
        <Stack gap="lg">
            <InfoAlert />

            <Stack gap="md">
                <ChangeFrequencySelect
                    value={values.changefreq}
                    onChange={handleChangefreqChange}
                    disabled={disabled}
                />

                <PriorityInput
                    value={values.priority}
                    onChange={handlePriorityChange}
                    disabled={disabled}
                />
            </Stack>
        </Stack>
    );
}
