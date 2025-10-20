"use client";

import "@mantine/tiptap/styles.css";
import "./news-rich-text-editor.css";
import "tiptap-extension-resizable-image/styles.css";

import { Dispatch, useCallback } from "react";

import { Box, Group, Text } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import {
    IconColumnInsertLeft,
    IconColumnInsertRight,
    IconColumnRemove,
    IconRowInsertBottom,
    IconRowInsertTop,
    IconRowRemove,
    IconTableOff,
    IconTablePlus,
} from "@tabler/icons-react";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import { TableKit } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import { EditorEvents, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { useDebounceFn } from "ahooks";
import { ResizableImage } from "tiptap-extension-resizable-image";
import { TextDirection } from "tiptap-text-direction";

type Props = {
    content?: string;
    rtl?: boolean;
    onChange: Dispatch<string>;
    onFirstParagraphChange?: Dispatch<string>;
    placeholder?: string;
    minCharacters?: number;
    maxCharacters?: number;
};

export function NewsRichTextEditor({
    content = "",
    rtl = false,
    placeholder,
    onChange,
    onFirstParagraphChange,
    minCharacters,
    maxCharacters,
}: Props) {
    const { run: onUpdate } = useDebounceFn(
        ({ editor }: EditorEvents["update"]) => {
            onChange(editor.getHTML());

            if (onFirstParagraphChange) {
                const firstParagraph = editor.$doc.content.content.find(
                    (node) => node.type.name === "paragraph"
                );

                if (!firstParagraph) return;

                const firstParagraphText = firstParagraph.textContent;

                // Check if the update affected the first paragraph
                const { from, to } = editor.state.selection;
                const firstParagraphEnd = firstParagraph.nodeSize - 1;

                // Only trigger if selection is within first paragraph bounds
                if (from <= firstParagraphEnd || to <= firstParagraphEnd) {
                    onFirstParagraphChange(firstParagraphText.slice(0, 160));
                }
            }
        },
        {
            wait: 800,
        }
    );

    const editor = useEditor({
        content,
        onUpdate,
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3, 4, 5, 6],
                },
            }),
            TableKit.configure({
                table: {
                    resizable: true,
                },
            }),
            Highlight,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            ResizableImage.configure({
                defaultWidth: 200,
                defaultHeight: 200,
                async onUpload(file) {
                    const base64 = await new Promise<string>(
                        (resolve, reject) => {
                            const reader = new FileReader();
                            reader.onloadend = () =>
                                resolve(reader.result as string);
                            reader.onerror = reject;
                            reader.readAsDataURL(file);
                        }
                    );

                    return {
                        src: base64,
                        alt: file.name,
                        title: file.name,
                        "data-keep-ratio": true,
                    };
                },
            }),
            CharacterCount.configure({
                limit: maxCharacters,
            }),
            // @ts-expect-error - TextDirection has version incompatibility with @tiptap/core
            TextDirection.configure({ defaultDirection: rtl ? "rtl" : "ltr" }),
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

    // Extracted onClick handlers
    const handleInsertTable = useCallback(() => {
        editor
            ?.chain()
            .focus()
            .insertTable({
                rows: 3,
                cols: 3,
                withHeaderRow: true,
            })
            .run();
    }, [editor]);

    const handleAddRowBefore = useCallback(() => {
        editor?.chain().focus().addRowBefore().run();
    }, [editor]);

    const handleAddRowAfter = useCallback(() => {
        editor?.chain().focus().addRowAfter().run();
    }, [editor]);

    const handleAddColumnBefore = useCallback(() => {
        editor?.chain().focus().addColumnBefore().run();
    }, [editor]);

    const handleAddColumnAfter = useCallback(() => {
        editor?.chain().focus().addColumnAfter().run();
    }, [editor]);

    const handleDeleteRow = useCallback(() => {
        editor?.chain().focus().deleteRow().run();
    }, [editor]);

    const handleDeleteColumn = useCallback(() => {
        editor?.chain().focus().deleteColumn().run();
    }, [editor]);

    const handleDeleteTable = useCallback(() => {
        editor?.chain().focus().deleteTable().run();
    }, [editor]);

    return (
        <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={60} mb="lg">
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                    <RichTextEditor.H5 />
                    <RichTextEditor.H6 />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
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
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Control
                        onClick={handleInsertTable}
                        aria-label="Insert table"
                        title="Insert table"
                    >
                        <IconTablePlus size={16} stroke={1.5} />
                    </RichTextEditor.Control>

                    <RichTextEditor.Control
                        onClick={handleAddRowBefore}
                        aria-label="Add row before"
                        title="Add row before"
                        disabled={!editor?.can().addRowBefore()}
                    >
                        <IconRowInsertTop size={16} stroke={1.5} />
                    </RichTextEditor.Control>

                    <RichTextEditor.Control
                        onClick={handleAddRowAfter}
                        aria-label="Add row after"
                        title="Add row after"
                        disabled={!editor?.can().addRowAfter()}
                    >
                        <IconRowInsertBottom size={16} stroke={1.5} />
                    </RichTextEditor.Control>

                    <RichTextEditor.Control
                        onClick={handleAddColumnBefore}
                        aria-label="Add column before"
                        title="Add column before"
                        disabled={!editor?.can().addColumnBefore()}
                    >
                        <IconColumnInsertLeft size={16} stroke={1.5} />
                    </RichTextEditor.Control>

                    <RichTextEditor.Control
                        onClick={handleAddColumnAfter}
                        aria-label="Add column after"
                        title="Add column after"
                        disabled={!editor?.can().addColumnAfter()}
                    >
                        <IconColumnInsertRight size={16} stroke={1.5} />
                    </RichTextEditor.Control>

                    <RichTextEditor.Control
                        onClick={handleDeleteRow}
                        aria-label="Delete row"
                        title="Delete row"
                        disabled={!editor?.can().deleteRow()}
                    >
                        <IconRowRemove size={16} stroke={1.5} />
                    </RichTextEditor.Control>

                    <RichTextEditor.Control
                        onClick={handleDeleteColumn}
                        aria-label="Delete column"
                        title="Delete column"
                        disabled={!editor?.can().deleteColumn()}
                    >
                        <IconColumnRemove size={16} stroke={1.5} />
                    </RichTextEditor.Control>

                    <RichTextEditor.Control
                        onClick={handleDeleteTable}
                        aria-label="Delete table"
                        title="Delete table"
                        disabled={!editor?.can().deleteTable()}
                    >
                        <IconTableOff size={16} stroke={1.5} />
                    </RichTextEditor.Control>
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
                                : minCharacters &&
                                    characterCount < minCharacters
                                  ? "orange"
                                  : "dimmed"
                        }
                        fw={
                            (maxCharacters && characterCount > maxCharacters) ||
                            (minCharacters && characterCount < minCharacters)
                                ? 600
                                : 400
                        }
                    >
                        {characterCount}{" "}
                        {characterCount === 1 ? "character" : "characters"}
                        {minCharacters && ` (min: ${minCharacters})`}
                        {maxCharacters && ` (max: ${maxCharacters})`}
                    </Text>
                </Group>
            </Box>
        </RichTextEditor>
    );
}
