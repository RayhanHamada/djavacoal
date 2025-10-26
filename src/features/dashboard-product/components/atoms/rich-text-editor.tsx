"use client";

import { RichTextEditor as MantineRTE } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type RichTextEditorProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: number;
    error?: React.ReactNode;
};

export function RichTextEditor({
    value,
    onChange,
    placeholder,
    minHeight = 120,
    error,
}: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            TextStyleKit,
            Highlight,
            Link.configure({
                openOnClick: false,
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Placeholder.configure({
                placeholder: placeholder || "Start typing...",
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div>
            <MantineRTE
                editor={editor}
                styles={{
                    content: {
                        minHeight: `${minHeight}px`,
                    },
                }}
            >
                <MantineRTE.Toolbar sticky stickyOffset={60}>
                    <MantineRTE.ControlsGroup>
                        <MantineRTE.Bold />
                        <MantineRTE.Italic />
                        <MantineRTE.Underline />
                        <MantineRTE.Strikethrough />
                        <MantineRTE.ClearFormatting />
                        <MantineRTE.Highlight />
                        <MantineRTE.Code />
                    </MantineRTE.ControlsGroup>

                    <MantineRTE.ControlsGroup>
                        <MantineRTE.ColorPicker
                            colors={[
                                "#25262b",
                                "#868e96",
                                "#fa5252",
                                "#e64980",
                                "#be4bdb",
                                "#7950f2",
                                "#4c6ef5",
                                "#228be6",
                                "#15aabf",
                                "#12b886",
                                "#40c057",
                                "#82c91e",
                                "#fab005",
                                "#fd7e14",
                            ]}
                        />
                    </MantineRTE.ControlsGroup>

                    <MantineRTE.ControlsGroup>
                        <MantineRTE.Link />
                        <MantineRTE.Unlink />
                    </MantineRTE.ControlsGroup>

                    <MantineRTE.ControlsGroup>
                        <MantineRTE.Undo />
                        <MantineRTE.Redo />
                    </MantineRTE.ControlsGroup>
                </MantineRTE.Toolbar>

                <MantineRTE.Content />
            </MantineRTE>
            {error && (
                <div
                    style={{
                        color: "var(--mantine-color-error)",
                        fontSize: "var(--mantine-font-size-sm)",
                        marginTop: "var(--mantine-spacing-xs)",
                    }}
                >
                    {error}
                </div>
            )}
        </div>
    );
}
