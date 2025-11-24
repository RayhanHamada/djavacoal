"use client";

import type { ChangeFrequencySelectProps } from "@/features/dashboard-blog-settings/lib";

import { Select } from "@mantine/core";

import {
    SITEMAP_CHANGEFREQ_ENUM,
    UI_TEXT,
} from "@/features/dashboard-blog-settings/lib";

/**
 * ChangeFrequencySelect - Atom component for selecting sitemap change frequency
 * Provides a dropdown with predefined frequency options
 */
export function ChangeFrequencySelect({
    value,
    onChange,
    disabled = false,
}: ChangeFrequencySelectProps) {
    const data = SITEMAP_CHANGEFREQ_ENUM.map((freq) => ({
        value: freq,
        label: freq.charAt(0).toUpperCase() + freq.slice(1),
    }));

    return (
        <Select
            label={UI_TEXT.CHANGEFREQ_LABEL}
            description={UI_TEXT.CHANGEFREQ_DESCRIPTION}
            placeholder={UI_TEXT.CHANGEFREQ_PLACEHOLDER}
            data={data}
            value={value}
            onChange={(val) => onChange((val as typeof value) || value)}
            disabled={disabled}
            required
            allowDeselect={false}
        />
    );
}
