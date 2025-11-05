"use client";

import { useState } from "react";

import { SegmentedControl, Stack, Text } from "@mantine/core";

import { ProductRichTextEditor } from "../atoms/product-rich-text-editor";

interface BilingualDescriptionEditorProps {
    enDescription: string;
    arDescription: string;
    onEnChange: (value: string) => void;
    onArChange: (value: string) => void;
    disabled?: boolean;
    enError?: string;
    arError?: string;
}

export function BilingualDescriptionEditor({
    enDescription,
    arDescription,
    onEnChange,
    onArChange,
    disabled = false,
    enError,
    arError,
}: BilingualDescriptionEditorProps) {
    const [activeLanguage, setActiveLanguage] = useState<"en" | "ar">("en");

    return (
        <Stack gap="sm">
            <SegmentedControl
                value={activeLanguage}
                onChange={(value) => setActiveLanguage(value as "en" | "ar")}
                data={[
                    { label: "English", value: "en" },
                    { label: "العربية", value: "ar" },
                ]}
                disabled={disabled}
            />

            {/* English Editor */}
            <div
                style={{ display: activeLanguage === "en" ? "block" : "none" }}
            >
                <ProductRichTextEditor
                    content={enDescription}
                    onChange={onEnChange}
                    placeholder="Enter product description in English..."
                    maxCharacters={1000}
                    disabled={disabled}
                    rtl={false}
                />
                {enError && (
                    <Text c="red" size="sm" mt="xs">
                        {enError}
                    </Text>
                )}
            </div>

            {/* Arabic Editor */}
            <div
                style={{ display: activeLanguage === "ar" ? "block" : "none" }}
            >
                <ProductRichTextEditor
                    content={arDescription}
                    onChange={onArChange}
                    placeholder="أدخل وصف المنتج بالعربية..."
                    maxCharacters={1000}
                    disabled={disabled}
                    rtl={true}
                />
                {arError && (
                    <Text c="red" size="sm" mt="xs">
                        {arError}
                    </Text>
                )}
            </div>
        </Stack>
    );
}
