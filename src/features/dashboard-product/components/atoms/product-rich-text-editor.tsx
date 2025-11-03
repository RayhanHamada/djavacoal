"use client";

import "@mantine/tiptap/styles.css";

import { Box, Group, Text } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { EditorEvents, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { useDebounceFn } from "ahooks";
import { TextDirection } from "tiptap-text-direction";

type Props = {
    content?: string;
    rtl?: boolean;
    onChange: (value: string) => void;
    placeholder?: string;
    maxCharacters?: number;
    disabled?: boolean;
};

export function ProductRichTextEditor({
    content = "",
    rtl = false,
    placeholder,
    onChange,
    maxCharacters = 1000,
    disabled = false,
}: Props) {
    const { run: onUpdate } = useDebounceFn(
        ({ editor }: EditorEvents["update"]) => {
            onChange(editor.getHTML());
        },
        {
            wait: 300,
        }
    );

    const editor = useEditor({
        content,
        onUpdate,
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
        editable: !disabled,
        extensions: [
            Highlight,
            StarterKit.configure({
                heading: false, // Disable headings for simple descriptions
            }),
            Link.configure({
                openOnClick: false,
            }),
            TextAlign.configure({
                types: ["paragraph"],
            }),
            CharacterCount.configure({
                limit: maxCharacters,
            }),
            // @ts-expect-error - TextDirection has version incompatibility with @tiptap/core
            TextDirection.configure({
                defaultDirection: rtl ? "rtl" : "ltr",
            }),
        ],
        editorProps: {
            attributes: {
                class: "prose max-w-none",
                ...(placeholder ? { "data-placeholder": placeholder } : {}),
            },
        },
    });

    // Get character and word count
    const characterCount = editor?.storage.characterCount.characters() || 0;
    const wordCount = editor?.storage.characterCount.words() || 0;

    return (
        <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignRight />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Undo />
                    <RichTextEditor.Redo />
                </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            {editor && (
                <BubbleMenu editor={editor}>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.Link />
                        <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>
                </BubbleMenu>
            )}

            <RichTextEditor.Content />

            {/* Character and Word Counter */}
            <Box
                p="xs"
                style={{
                    borderTop: "1px solid var(--mantine-color-gray-3)",
                    backgroundColor: "var(--mantine-color-gray-0)",
                }}
            >
                <Group gap="md" justify="flex-end">
                    <Text size="xs" c="dimmed">
                        {wordCount} {wordCount === 1 ? "word" : "words"}
                    </Text>
                    <Text size="xs" c="dimmed">
                        •
                    </Text>
                    <Text
                        size="xs"
                        c={
                            maxCharacters && characterCount > maxCharacters
                                ? "red"
                                : "dimmed"
                        }
                        fw={
                            maxCharacters && characterCount > maxCharacters
                                ? 600
                                : 400
                        }
                    >
                        {characterCount}{" "}
                        {characterCount === 1 ? "character" : "characters"}
                        {maxCharacters && ` (max: ${maxCharacters})`}
                    </Text>
                </Group>
            </Box>
        </RichTextEditor>
    );
}
