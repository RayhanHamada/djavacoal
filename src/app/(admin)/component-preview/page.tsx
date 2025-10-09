"use client";

import "@mantine/code-highlight/styles.css";

import { CustomRichTextEditor } from "@/features/component-previews/components";
import { Stack, Text } from "@mantine/core";
import { useState } from "react";
import { CodeHighlight } from "@mantine/code-highlight";

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
    </Stack>
  );
}
