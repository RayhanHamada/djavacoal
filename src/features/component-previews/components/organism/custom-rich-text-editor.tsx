"use client";

import "@mantine/tiptap/styles.css";
import "tiptap-extension-resizable-image/styles.css";
import "./custom-rich-text-editor.css";

import { Dispatch } from "react";

import { useDebouncedCallback } from "@mantine/hooks";
import { RichTextEditor, Link } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { EditorEvents, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { ResizableImage } from "tiptap-extension-resizable-image";
import { TextDirection } from "tiptap-text-direction";

const DEFAULT_CONTENT = "";

type Props = {
    content?: string;
    rtl?: boolean;
    onChange: Dispatch<string>;
};

export function CustomRichTextEditor({
    content = DEFAULT_CONTENT,
    rtl = false,
    onChange,
}: Props) {
    const onUpdate = useDebouncedCallback(
        function ({ editor }: EditorEvents["update"]) {
            onChange(editor.getHTML());
        },
        { delay: 1000 }
    );

    const editor = useEditor({
        content,
        onUpdate,
        immediatelyRender: false,
        shouldRerenderOnTransaction: true,
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            // @ts-expect-error ada typing error
            TextDirection.configure({ defaultDirection: rtl ? "rtl" : "ltr" }),
            Link,
            Highlight,
            ResizableImage.configure({
                defaultHeight: 200,
                defaultWidth: 300,
            }),
        ],
    });

    return (
        <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar
                sticky
                stickyOffset="var(--docs-header-height)"
                mb="lg"
            >
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
                    <RichTextEditor.AlignLeft
                        active={editor?.isActive({ textAlign: "left" })}
                    />
                    <RichTextEditor.AlignCenter
                        active={editor?.isActive({ textAlign: "center" })}
                    />
                    <RichTextEditor.AlignJustify
                        active={editor?.isActive({ textAlign: "justify" })}
                    />
                    <RichTextEditor.AlignRight
                        active={editor?.isActive({ textAlign: "right" })}
                    />
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
