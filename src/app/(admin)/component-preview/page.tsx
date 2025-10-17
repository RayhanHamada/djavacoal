"use client";

import "@mantine/code-highlight/styles.css";

import { useState } from "react";

import Link from "next/link";

import { CodeHighlight } from "@mantine/code-highlight";
import { Stack, Text } from "@mantine/core";

import { CustomRichTextEditor } from "@/features/component-previews/components";

const encoder = new TextEncoder();

export default function ComponentPreviewPage() {
    const [content, setContent] = useState("");

    return (
        <Stack px="lg">
            <Text>Component Preview Page</Text>

            <CustomRichTextEditor rtl content={content} onChange={setContent} />

            <CodeHighlight language="html" code={content} />
            <CodeHighlight
                language="text"
                code={`${encoder.encode(content).length} bytes`}
            />
            <Link href={process.env.NEXT_PUBLIC_BASE_URL}>Test</Link>
        </Stack>
    );
}
