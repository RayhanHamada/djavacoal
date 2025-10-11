"use client";

import "@mantine/code-highlight/styles.css";

import { CustomRichTextEditor } from "@/features/component-previews/components";
import { Stack, Text } from "@mantine/core";
import { useState } from "react";
import { CodeHighlight } from "@mantine/code-highlight";
import Link from "next/link";
import { env } from "@/configs";

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
      <Link href={env.NEXT_PUBLIC_BASE_URL}>Test</Link>
      <Link href={process.env.CF_PAGES_URL ?? ""}>Test 2</Link>
    </Stack>
  );
}
