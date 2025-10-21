"use client";

import { AspectRatio, Badge, Box, Image, Text } from "@mantine/core";

/**
 * Get R2 public URL for image key
 */
function getImageUrl(key: string): string {
    // TODO: Replace with actual R2 public URL pattern
    return `${process.env.NEXT_PUBLIC_ASSET_URL}/${key}`;
}

interface ImageCellProps {
    imageKey: string | null;
    alt: string;
}

/**
 * Image cell component for news table
 */
export function NewsImageCell({ imageKey, alt }: ImageCellProps) {
    return (
        <Box w={120}>
            <AspectRatio ratio={4 / 3}>
                {imageKey ? (
                    <Image
                        src={getImageUrl(imageKey)}
                        alt={alt}
                        fit="contain"
                        radius="sm"
                    />
                ) : (
                    <Box
                        bg="gray.1"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "var(--mantine-radius-sm)",
                        }}
                    >
                        <Text size="xs" c="dimmed">
                            No Image
                        </Text>
                    </Box>
                )}
            </AspectRatio>
        </Box>
    );
}

interface TitleCellProps {
    enTitle: string;
    arTitle: string;
    onClick: () => void;
}

/**
 * Title cell component with bilingual support
 */
export function NewsTitleCell({ enTitle, arTitle, onClick }: TitleCellProps) {
    return (
        <Box style={{ cursor: "pointer" }} onClick={onClick}>
            <Text fw={500} lineClamp={2}>
                {enTitle}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
                {arTitle}
            </Text>
        </Box>
    );
}

interface StatusCellProps {
    status: "draft" | "published" | "unpublished";
}

/**
 * Status badge cell component
 */
export function NewsStatusCell({ status }: StatusCellProps) {
    const statusConfig = {
        draft: { color: "gray", label: "Draft" },
        published: { color: "green", label: "Published" },
        unpublished: { color: "orange", label: "Unpublished" },
    };

    const config = statusConfig[status];

    return (
        <Badge color={config.color} variant="light">
            {config.label}
        </Badge>
    );
}

interface DateCellProps {
    date: Date | null;
}

/**
 * Date cell component with formatting
 */
export function NewsDateCell({ date }: DateCellProps) {
    if (!date) {
        return (
            <Text size="sm" c="dimmed">
                Not published
            </Text>
        );
    }

    return (
        <Text size="sm">
            {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })}
        </Text>
    );
}
