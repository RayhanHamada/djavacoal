"use client";

import { useEffect, useState } from "react";

import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    ActionIcon,
    Box,
    Button,
    Fieldset,
    FileButton,
    Group,
    Image,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import {
    IconGripVertical,
    IconPhoto,
    IconTrash,
    IconVideo,
} from "@tabler/icons-react";

export type MediaItem =
    | {
          id: string;
          media_type: "image";
          image_key: string;
          image_file?: File; // For deferred upload
          order_index: number;
      }
    | {
          id: string;
          media_type: "youtube";
          youtube_video_id: string;
          video_custom_thumbnail_key?: string;
          video_custom_thumbnail_file?: File; // For deferred upload
          order_index: number;
      };

interface MediaListInputProps {
    value: MediaItem[];
    onChange: (value: MediaItem[]) => void;
    error?: string;
}

export function MediaListInput({
    value,
    onChange,
    error,
}: MediaListInputProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = value.findIndex((item) => item.id === active.id);
            const newIndex = value.findIndex((item) => item.id === over.id);

            const reordered = arrayMove(value, oldIndex, newIndex).map(
                (item, index) => ({
                    ...item,
                    order_index: index,
                })
            );

            onChange(reordered);
        }
    };

    const addImageMedia = () => {
        const newMedia: MediaItem = {
            id: `new-${Date.now()}`,
            media_type: "image",
            image_key: "",
            order_index: value.length,
        };
        onChange([...value, newMedia]);
    };

    const addYoutubeMedia = () => {
        const newMedia: MediaItem = {
            id: `new-${Date.now()}`,
            media_type: "youtube",
            youtube_video_id: "",
            order_index: value.length,
        };
        onChange([...value, newMedia]);
    };

    const removeMedia = (id: string) => {
        onChange(
            value
                .filter((item) => item.id !== id)
                .map((item, index) => ({ ...item, order_index: index }))
        );
    };

    const updateMedia = (id: string, updates: Partial<MediaItem>) => {
        onChange(
            value.map((item) =>
                item.id === id
                    ? ({
                          ...item,
                          ...updates,
                      } as MediaItem)
                    : item
            )
        );
    };

    return (
        <Stack gap="md">
            <Group gap="sm">
                <Button
                    leftSection={<IconPhoto size={16} />}
                    onClick={addImageMedia}
                    size="sm"
                    variant="light"
                >
                    Add Image
                </Button>
                <Button
                    leftSection={<IconVideo size={16} />}
                    onClick={addYoutubeMedia}
                    size="sm"
                    variant="light"
                >
                    Add YouTube Video
                </Button>
            </Group>

            {error && (
                <Text c="red" size="sm">
                    {error}
                </Text>
            )}

            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                sensors={sensors}
            >
                <SortableContext
                    items={value.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <Stack gap="md">
                        {value.map((item) => (
                            <SortableMediaItem
                                item={item}
                                key={item.id}
                                onRemove={removeMedia}
                                onUpdate={updateMedia}
                            />
                        ))}
                    </Stack>
                </SortableContext>
            </DndContext>

            {value.length === 0 && (
                <Text c="dimmed" size="sm" ta="center">
                    No media added yet. Click the buttons above to add images or
                    YouTube videos.
                </Text>
            )}
        </Stack>
    );
}

interface SortableMediaItemProps {
    item: MediaItem;
    onUpdate: (id: string, updates: Partial<MediaItem>) => void;
    onRemove: (id: string) => void;
}

function SortableMediaItem({
    item,
    onUpdate,
    onRemove,
}: SortableMediaItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id: item.id,
        });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<
        string | null
    >(null);

    // Create preview URLs from Files
    useEffect(() => {
        if (item.media_type === "image" && item.image_file) {
            const url = URL.createObjectURL(item.image_file);
            setImagePreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setImagePreviewUrl(null);
    }, [item]);

    useEffect(() => {
        if (item.media_type === "youtube" && item.video_custom_thumbnail_file) {
            const url = URL.createObjectURL(item.video_custom_thumbnail_file);
            setThumbnailPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setThumbnailPreviewUrl(null);
    }, [item]);

    const handleImageSelect = (
        file: File | null,
        fileType: "image" | "thumbnail"
    ) => {
        if (!file) return;

        if (fileType === "image" && item.media_type === "image") {
            onUpdate(item.id, { image_file: file, image_key: "" });
        } else if (fileType === "thumbnail" && item.media_type === "youtube") {
            onUpdate(item.id, {
                video_custom_thumbnail_file: file,
                video_custom_thumbnail_key: undefined,
            });
        }
    };

    return (
        <Box ref={setNodeRef} style={style}>
            <Fieldset
                legend={
                    <Group gap="xs">
                        <IconGripVertical
                            size={16}
                            style={{ cursor: "grab" }}
                            {...listeners}
                            {...attributes}
                        />
                        <Text size="sm">
                            {item.media_type === "image"
                                ? "Image Media"
                                : "YouTube Video"}
                        </Text>
                    </Group>
                }
            >
                <Stack gap="md">
                    {item.media_type === "image" ? (
                        <>
                            <FileButton
                                accept="image/*"
                                onChange={(file) =>
                                    handleImageSelect(file, "image")
                                }
                            >
                                {(props) => (
                                    <Button
                                        {...props}
                                        leftSection={<IconPhoto size={16} />}
                                        size="sm"
                                        variant="light"
                                    >
                                        {item.image_key || item.image_file
                                            ? "Change Image"
                                            : "Select Image"}
                                    </Button>
                                )}
                            </FileButton>

                            {(item.image_key || imagePreviewUrl) && (
                                <Image
                                    alt="Product media"
                                    fit="contain"
                                    h={200}
                                    radius="md"
                                    src={
                                        imagePreviewUrl ||
                                        `${process.env.NEXT_PUBLIC_ASSET_URL}${item.image_key}`
                                    }
                                />
                            )}
                        </>
                    ) : (
                        <>
                            <TextInput
                                description="Enter the YouTube video ID (e.g., 'dQw4w9WgXcQ' from https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
                                label="YouTube Video ID"
                                onChange={(e) =>
                                    onUpdate(item.id, {
                                        youtube_video_id: e.target.value,
                                    })
                                }
                                placeholder="dQw4w9WgXcQ"
                                required
                                value={item.youtube_video_id}
                            />

                            {item.youtube_video_id && (
                                <Box>
                                    <Text fw={500} mb="xs" size="sm">
                                        Default Thumbnail Preview
                                    </Text>
                                    <Image
                                        alt="YouTube thumbnail"
                                        fit="contain"
                                        h={150}
                                        radius="md"
                                        src={`https://img.youtube.com/vi/${item.youtube_video_id}/maxresdefault.jpg`}
                                    />
                                </Box>
                            )}

                            <Box>
                                <Text fw={500} mb="xs" size="sm">
                                    Custom Thumbnail (Optional)
                                </Text>
                                <FileButton
                                    accept="image/*"
                                    onChange={(file) =>
                                        handleImageSelect(file, "thumbnail")
                                    }
                                >
                                    {(props) => (
                                        <Button
                                            {...props}
                                            leftSection={
                                                <IconPhoto size={16} />
                                            }
                                            size="sm"
                                            variant="light"
                                        >
                                            {item.video_custom_thumbnail_key ||
                                            item.video_custom_thumbnail_file
                                                ? "Change Custom Thumbnail"
                                                : "Select Custom Thumbnail"}
                                        </Button>
                                    )}
                                </FileButton>

                                {(item.video_custom_thumbnail_key ||
                                    thumbnailPreviewUrl) && (
                                    <Image
                                        alt="Custom thumbnail"
                                        fit="contain"
                                        h={150}
                                        mt="xs"
                                        radius="md"
                                        src={
                                            thumbnailPreviewUrl ||
                                            `${process.env.NEXT_PUBLIC_ASSET_URL}${item.video_custom_thumbnail_key}`
                                        }
                                    />
                                )}
                            </Box>
                        </>
                    )}

                    <Group justify="flex-end">
                        <ActionIcon
                            color="red"
                            onClick={() => onRemove(item.id)}
                            size="sm"
                            variant="light"
                        >
                            <IconTrash size={16} />
                        </ActionIcon>
                    </Group>
                </Stack>
            </Fieldset>
        </Box>
    );
}
