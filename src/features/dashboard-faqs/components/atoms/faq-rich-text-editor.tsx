"use client";

import "@mantine/tiptap/styles.css";

import { useEffect, useMemo } from "react";

import { RichTextEditor } from "@mantine/tiptap";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorEvents, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";

import { FAQ_ANSWER_MAX_LENGTH } from "@/features/dashboard-faqs/lib";

interface FaqRichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    maxLength?: number;
}

/**
 * Simple rich text editor for FAQ answers with basic formatting options:
 * - Bold
 * - Italic
 * - Underline (via Strike - we'll use underline styling)
 * - Link
 */
export function FaqRichTextEditor({
    value,
    onChange,
    placeholder = "Enter answer...",
    label,
    error,
}: FaqRichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                // Disable features we don't need for simple FAQ formatting
                heading: false,
                blockquote: false,
                codeBlock: false,
                horizontalRule: false,
                dropcursor: false,
                gapcursor: false,
            }),
            Placeholder.configure({
                placeholder,
            }),
            CharacterCount.configure({
                limit: FAQ_ANSWER_MAX_LENGTH,
            }),
        ],
        content: value || "",
        onUpdate: ({ editor }: EditorEvents["update"]) => {
            const html = editor.getHTML();
            // Don't trigger onChange if content is just empty paragraph
            if (html === "<p></p>") return;

            onChange(html);
        },
    });

    // Sync editor content with value prop changes (e.g., when switching languages)
    useEffect(() => {
        if (editor && value !== undefined) {
            const currentContent = editor.getHTML();
            // Only update if content actually changed to avoid cursor position issues
            if (currentContent !== value) {
                editor.commands.setContent(value || "");
            }
        }
    }, [editor, value]);

    const currentLength = useMemo(
        () => editor?.storage.characterCount.characters() ?? 0,
        [editor?.storage.characterCount]
    );
    const isOverLimit = currentLength > FAQ_ANSWER_MAX_LENGTH;

    return (
        <div>
            {label && (
                <div
                    style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        marginBottom: "4px",
                    }}
                >
                    {label}
                </div>
            )}

            <RichTextEditor editor={editor}>
                {editor && (
                    <BubbleMenu editor={editor}>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>
                    </BubbleMenu>
                )}

                <RichTextEditor.Toolbar>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Strikethrough />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link />
                        <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Undo />
                        <RichTextEditor.Redo />
                    </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content
                    style={{
                        minHeight: "120px",
                        borderColor: error
                            ? "var(--mantine-color-error)"
                            : undefined,
                    }}
                />
            </RichTextEditor>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "4px",
                    fontSize: "12px",
                }}
            >
                {error && (
                    <div style={{ color: "var(--mantine-color-error)" }}>
                        {error}
                    </div>
                )}

                <div
                    style={{
                        marginLeft: "auto",
                        color: isOverLimit
                            ? "var(--mantine-color-error)"
                            : "var(--mantine-color-dimmed)",
                    }}
                >
                    {currentLength} / {FAQ_ANSWER_MAX_LENGTH}
                </div>
            </div>
        </div>
    );
}
