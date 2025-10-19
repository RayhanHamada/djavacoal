"use client";

import { useState } from "react";

import { SegmentedControl, Stack, TextInput } from "@mantine/core";

interface BilingualTextInputProps {
    /** English value */
    enValue: string;
    /** Arabic value */
    arValue: string;
    /** Callback when English value changes */
    onEnChange: (value: string) => void;
    /** Callback when Arabic value changes */
    onArChange: (value: string) => void;
    /** Label for the input */
    label: string;
    /** Placeholder text */
    placeholder?: string;
    /** Whether the field is required */
    required?: boolean;
    /** Whether the field is disabled */
    disabled?: boolean;
    /** Error message for English field */
    enError?: string;
    /** Error message for Arabic field */
    arError?: string;
    /** Whether the English field is readonly */
    enReadonly?: boolean;
}

/**
 * BilingualTextInput component for English and Arabic text input
 * Allows switching between languages with proper text direction
 */
export function BilingualTextInput({
    enValue,
    arValue,
    onEnChange,
    onArChange,
    label,
    placeholder,
    required = false,
    disabled = false,
    enError,
    arError,
    enReadonly = false,
}: BilingualTextInputProps) {
    const [activeLanguage, setActiveLanguage] = useState<"en" | "ar">("en");

    return (
        <Stack gap="xs">
            <SegmentedControl
                value={activeLanguage}
                onChange={(value) => setActiveLanguage(value as "en" | "ar")}
                data={[
                    { label: "English", value: "en" },
                    { label: "العربية", value: "ar" },
                ]}
                disabled={disabled}
            />

            {activeLanguage === "en" ? (
                <TextInput
                    label={label}
                    placeholder={placeholder}
                    value={enValue}
                    onChange={(event) => onEnChange(event.currentTarget.value)}
                    required={required}
                    disabled={disabled}
                    error={enError}
                    dir="ltr"
                    readOnly={enReadonly}
                />
            ) : (
                <TextInput
                    label={label}
                    placeholder={placeholder}
                    value={arValue}
                    onChange={(event) => onArChange(event.currentTarget.value)}
                    required={required}
                    disabled={disabled}
                    error={arError}
                    dir="rtl"
                />
            )}
        </Stack>
    );
}
