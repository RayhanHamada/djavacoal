"use client";

import "@mantine/tiptap/styles.css";
import "tiptap-extension-resizable-image/styles.css";

import { Dispatch } from "react";

import { Link, RichTextEditor } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import { EditorEvents, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { ResizableImage } from "tiptap-extension-resizable-image";
import { TextDirection } from "tiptap-text-direction";

type Props = {
    content?: string;
    rtl?: boolean;
    onChange: Dispatch<string>;
    placeholder?: string;
};

export function NewsRichTextEditor({
    content = "",
    rtl = false,
    onChange,
    placeholder,
}: Props) {
    const editor = useEditor({
        content,
        onUpdate: ({ editor }: EditorEvents["update"]) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            // @ts-expect-error - TextDirection has version incompatibility with @tiptap/core
            TextDirection.configure({ defaultDirection: rtl ? "rtl" : "ltr" }),
            Link,
            Highlight,
            ResizableImage.configure({
                defaultHeight: 200,
                defaultWidth: 300,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        editorProps: {
            attributes: {
                class: "prose max-w-none",
                ...(placeholder ? { "data-placeholder": placeholder } : {}),
            },
        },
    });

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
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
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
        </RichTextEditor>
    );
}
