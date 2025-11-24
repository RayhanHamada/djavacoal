"use client";

import { Badge, Group, Paper, Stack, Text } from "@mantine/core";
import { IconFileTypePdf } from "@tabler/icons-react";

import {
    CATALOGUE_FILE_NAME,
    ICON_SIZE,
    PDF_ICON_COLOR,
    PDF_ICON_STROKE,
} from "@/features/dashboard-static-media/lib";

interface PdfFileInfoProps {
    fileName?: string;
    fileSize?: string;
    fileUrl?: string;
}

/**
 * PdfFileInfo - Atom component to display PDF file information
 */
export function PdfFileInfo({
    fileName = CATALOGUE_FILE_NAME,
    fileSize,
    fileUrl,
}: PdfFileInfoProps) {
    return (
        <Paper p="md" withBorder radius="md" bg="gray.0">
            <Group gap="md">
                <IconFileTypePdf
                    size={ICON_SIZE.MEDIUM}
                    stroke={PDF_ICON_STROKE}
                    style={{ color: PDF_ICON_COLOR }}
                />
                <Stack gap={4} flex={1}>
                    <Group gap="xs">
                        <Text fw={500} size="sm">
                            {fileName}
                        </Text>
                        <Badge size="sm" color="blue" variant="light">
                            PDF
                        </Badge>
                    </Group>
                    {fileSize && (
                        <Text size="xs" c="dimmed">
                            {fileSize}
                        </Text>
                    )}
                    {fileUrl && (
                        <Text
                            size="xs"
                            c="blue"
                            component="a"
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                        >
                            View File
                        </Text>
                    )}
                </Stack>
            </Group>
        </Paper>
    );
}
