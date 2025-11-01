"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ActionIcon, Card, Group, Image, Loader } from "@mantine/core";
import { IconGripVertical, IconTrash } from "@tabler/icons-react";
import { PhotoView } from "react-photo-view";

interface PhotoCardProps {
    id: string;
    url: string;
    onDelete?: () => void;
    isDraggable?: boolean;
    aspectRatio?: "wide" | "square";
    showActions?: boolean;
}

/**
 * PhotoCard - Atom component for displaying a photo with drag & drop and delete
 */
export function PhotoCard({
    id,
    url,
    onDelete,
    isDraggable = true,
    aspectRatio = "square",
    showActions = true,
}: PhotoCardProps) {
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

    const imageHeight = aspectRatio === "wide" ? 120 : 200;

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
                <PhotoView src={url}>
                    <Image
                        src={url}
                        alt="Photo"
                        h={imageHeight}
                        fit="cover"
                        style={{ cursor: "pointer" }}
                    />
                </PhotoView>
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

/**
 * PhotoCardSkeleton - Loading state for PhotoCard
 */
export function PhotoCardSkeleton({
    aspectRatio = "square",
}: {
    aspectRatio?: "wide" | "square";
}) {
    const imageHeight = aspectRatio === "wide" ? 120 : 200;

    return (
        <Card p="xs" withBorder shadow="sm" radius="md">
            <Card.Section
                h={imageHeight}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--mantine-color-gray-1)",
                }}
            >
                <Loader size="sm" />
            </Card.Section>
        </Card>
    );
}
