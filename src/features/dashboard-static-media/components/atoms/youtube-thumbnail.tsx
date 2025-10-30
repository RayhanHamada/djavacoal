"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ActionIcon, Box, Card, Group, Image } from "@mantine/core";
import { IconGripVertical, IconTrash } from "@tabler/icons-react";

interface YouTubeThumbnailProps {
    id: string;
    videoId: string;
    onDelete?: () => void;
    isDraggable?: boolean;
    showActions?: boolean;
}

/**
 * YouTubeThumbnail - Atom component for displaying YouTube video thumbnail
 */
export function YouTubeThumbnail({
    id,
    videoId,
    onDelete,
    isDraggable = true,
    showActions = true,
}: YouTubeThumbnailProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id,
        disabled: !isDraggable,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return (
        <Card
            ref={setNodeRef}
            style={style}
            p="xs"
            withBorder
            shadow="sm"
            radius="md"
        >
            <Card.Section>
                <Box
                    component="a"
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "block", position: "relative" }}
                >
                    <Image
                        src={thumbnailUrl}
                        alt="YouTube thumbnail"
                        h={200}
                        fit="cover"
                        fallbackSrc="https://via.placeholder.com/400x225?text=YouTube+Video"
                    />
                    {/* YouTube play button overlay */}
                    <Box
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 68,
                            height: 48,
                            background: "rgba(255, 0, 0, 0.8)",
                            borderRadius: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            pointerEvents: "none",
                        }}
                    >
                        <svg
                            height="100%"
                            version="1.1"
                            viewBox="0 0 68 48"
                            width="100%"
                        >
                            <path
                                d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                                fill="#f00"
                            ></path>
                            <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                        </svg>
                    </Box>
                </Box>
            </Card.Section>

            {showActions && (
                <Group justify="space-between" mt="xs" gap="xs">
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        style={{ cursor: isDraggable ? "grab" : "default" }}
                        {...attributes}
                        {...listeners}
                    >
                        <IconGripVertical size={18} />
                    </ActionIcon>

                    {onDelete && (
                        <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={onDelete}
                        >
                            <IconTrash size={18} />
                        </ActionIcon>
                    )}
                </Group>
            )}
        </Card>
    );
}
