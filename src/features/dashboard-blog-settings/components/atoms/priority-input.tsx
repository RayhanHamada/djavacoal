"use client";

import type { PriorityInputProps } from "@/features/dashboard-blog-settings/lib";

import { NumberInput } from "@mantine/core";

import {
    PRIORITY_CONFIG,
    UI_TEXT,
} from "@/features/dashboard-blog-settings/lib";

/**
 * PriorityInput - Atom component for setting sitemap priority
 * Provides a number input with validation between 0.0 and 1.0
 */
export function PriorityInput({
    value,
    onChange,
    disabled = false,
}: PriorityInputProps) {
    return (
        <NumberInput
            label={UI_TEXT.PRIORITY_LABEL}
            description={UI_TEXT.PRIORITY_DESCRIPTION}
            value={value}
            onChange={(val) => onChange(Number(val) || value)}
            min={PRIORITY_CONFIG.MIN}
            max={PRIORITY_CONFIG.MAX}
            step={PRIORITY_CONFIG.STEP}
            decimalScale={PRIORITY_CONFIG.DECIMAL_SCALE}
            disabled={disabled}
            required
            clampBehavior="strict"
        />
    );
}
