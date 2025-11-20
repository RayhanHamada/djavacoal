"use client";

import "react-photo-view/dist/react-photo-view.css";

import { useState } from "react";

import Image from "next/image";

import { ActionIcon, Box, Card, Checkbox, Menu, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
    IconCopy,
    IconDotsVertical,
    IconEdit,
    IconTrash,
} from "@tabler/icons-react";
import { PhotoView } from "react-photo-view";

interface PhotoCardProps {
    /** Photo ID */
    id: string;
    /** Photo name */
    name: string;
    /** Photo URL */
    url: string;
    /** Whether the checkbox is checked */
    checked: boolean;
    /** Callback when checkbox state changes */
    onCheckedChange: (checked: boolean) => void;
    /** Callback when rename is clicked */
    onRename: () => void;
    /** Callback when delete is clicked */
    onDelete: () => void;
    /** Callback when photo is double-clicked */
    onDoubleClick?: () => void;
}

/**
 * PhotoCard component displays a single photo with actions
 * Follows atomic design pattern (molecule)
 */
export function PhotoCard({
    name,
    url,
    checked,
    onCheckedChange,
    onRename,
    onDelete,
    onDoubleClick,
}: PhotoCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Card
            shadow="sm"
            padding="xs"
            radius="md"
            withBorder
            pos="relative"
            style={{ overflow: "hidden" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Checkbox in top-left corner - visible on hover or when checked */}
            <Box
                pos="absolute"
                top={8}
                left={8}
                style={{
                    zIndex: 10,
                    transition: "opacity 200ms",
                    opacity: isHovered || checked ? 1 : 0,
                }}
            >
                <Checkbox
                    checked={checked}
                    onChange={(event) =>
                        onCheckedChange(event.currentTarget.checked)
                    }
                    aria-label={`Select ${name}`}
                />
            </Box>

            {/* Action menu in top-right corner (visible on hover, hidden when selected) */}
            {isHovered && !checked && (
                <Box pos="absolute" top={8} right={8} style={{ zIndex: 10 }}>
                    <Menu shadow="md" width={150}>
                        <Menu.Target>
                            <ActionIcon
                                variant="filled"
                                aria-label="Photo actions"
                            >
                                <IconDotsVertical size={16} />
                            </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item
                                leftSection={<IconCopy size={14} />}
                                onClick={() => {
                                    navigator.clipboard.writeText(url);
                                    notifications.show({
                                        title: "Copied!",
                                        message:
                                            "Photo URL copied to clipboard",
                                        color: "green",
                                    });
                                }}
                            >
                                Copy URL
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconEdit size={14} />}
                                onClick={onRename}
                            >
                                Rename
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconTrash size={14} />}
                                onClick={onDelete}
                                color="red"
                            >
                                Delete
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Box>
            )}

            {/* Photo image with fixed container */}
            <Box
                pos="relative"
                h={192}
                w="100%"
                style={{
                    cursor: "pointer",
                    overflow: "hidden",
                    borderRadius: "var(--mantine-radius-md)",
                    backgroundColor: "var(--mantine-color-gray-1)",
                }}
                onDoubleClick={onDoubleClick}
            >
                <PhotoView src={url}>
                    <Image
                        src={url}
                        alt={name}
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </PhotoView>
            </Box>

            {/* Photo name below image */}
            <Text size="sm" mt="xs" lineClamp={1} title={name}>
                {name}
            </Text>
        </Card>
    );
}
