"use client";

import { memo, useState } from "react";

import { SegmentedControl, Stack, Text } from "@mantine/core";

import { NewsRichTextEditor } from "../atoms/news-rich-text-editor";

interface BilingualContentEditorProps {
    /** English content HTML */
    enContent: string;
    /** Arabic content HTML */
    arContent: string;
    /** Callback when English content changes */
    onEnChange: (content: string) => void;
    /**
     * Callback when the first paragraph of English content changes
     */
    onEnFirstParagraphChange?(firstParagraph: string): void;
    /** Callback when Arabic content changes */
    onArChange: (content: string) => void;
    /** Label for the editor */
    label: string;
    /** Whether the field is disabled */
    disabled?: boolean;
}

/**
 * BilingualContentEditor component for English and Arabic rich text content
 * Allows switching between languages with proper text direction
 */
export const BilingualContentEditor = memo(function BilingualContentEditor({
    enContent,
    arContent,
    onEnChange,
    onEnFirstParagraphChange,
    onArChange,
    label,
    disabled = false,
}: BilingualContentEditorProps) {
    const [activeLanguage, setActiveLanguage] = useState<"en" | "ar">("en");

    return (
        <Stack gap="xs">
            <Text size="sm" fw={500}>
                {label}
                <Text component="span" c="red" ml={4}>
                    *
                </Text>
            </Text>

            <SegmentedControl
                value={activeLanguage}
                onChange={(value) => setActiveLanguage(value as "en" | "ar")}
                data={[
                    { label: "English", value: "en" },
                    { label: "العربية", value: "ar" },
                ]}
                disabled={disabled}
            />

            {/* Render both editors but show only the active one */}
            <div
                style={{ display: activeLanguage === "en" ? "block" : "none" }}
            >
                <NewsRichTextEditor
                    key="en-editor"
                    content={enContent}
                    onChange={onEnChange}
                    onFirstParagraphChange={onEnFirstParagraphChange}
                    maxCharacters={10000}
                    minCharacters={100}
                    rtl={false}
                    placeholder="Write your news content in English..."
                />
            </div>
            <div
                style={{ display: activeLanguage === "ar" ? "block" : "none" }}
            >
                <NewsRichTextEditor
                    key="ar-editor"
                    content={arContent}
                    onChange={onArChange}
                    maxCharacters={10000}
                    minCharacters={100}
                    rtl={true}
                    placeholder="اكتب محتوى الأخبار باللغة العربية..."
                />
            </div>
        </Stack>
    );
});
