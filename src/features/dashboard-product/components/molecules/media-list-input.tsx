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
    Card,
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
import { PhotoView } from "react-photo-view";
import { match } from "ts-pattern";

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

    // Check if there are any unfilled media items
    const hasUnfilledMedia = value.some((item) => {
        if (item.media_type === "image") {
            return !item.image_key && !item.image_file;
        } else {
            return !item.youtube_video_id;
        }
    });

    return (
        <Stack gap="md">
            <Group gap="sm">
                <Button
                    disabled={hasUnfilledMedia}
                    leftSection={<IconPhoto size={16} />}
                    onClick={addImageMedia}
                    size="sm"
                    variant="light"
                >
                    Add Image
                </Button>
                <Button
                    disabled={hasUnfilledMedia}
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
            <Card padding="md" radius="md" shadow="sm" withBorder>
                <Stack gap="sm">
                    <Group gap="xs" justify="space-between">
                        <Group gap="xs">
                            <ActionIcon
                                size="sm"
                                style={{ cursor: "grab" }}
                                variant="subtle"
                                {...listeners}
                                {...attributes}
                            >
                                <IconGripVertical size={16} />
                            </ActionIcon>
                            <Text fw={500} size="sm">
                                {item.media_type === "image"
                                    ? "Image Media"
                                    : "YouTube Video"}
                            </Text>
                        </Group>
                        <ActionIcon
                            color="red"
                            onClick={() => onRemove(item.id)}
                            size="sm"
                            variant="subtle"
                        >
                            <IconTrash size={16} />
                        </ActionIcon>
                    </Group>

                    {match(item)
                        .with(
                            {
                                media_type: "image",
                            },
                            (item) => {
                                const imageSrc =
                                    imagePreviewUrl ||
                                    (item.image_key &&
                                        `${process.env.NEXT_PUBLIC_ASSET_URL}${item.image_key}`);
                                return (
                                    <Stack align="flex-start" gap="md">
                                        <Box style={{ flex: "0 0" }}>
                                            {match({
                                                hasImage: !!imageSrc,
                                                imageUrl: imageSrc,
                                            })
                                                .with(
                                                    { hasImage: true },
                                                    ({ imageUrl }) => (
                                                        <PhotoView
                                                            src={imageUrl}
                                                        >
                                                            <Image
                                                                alt="Product media"
                                                                fit="cover"
                                                                h={150}
                                                                radius="md"
                                                                src={imageUrl}
                                                                w={200}
                                                            />
                                                        </PhotoView>
                                                    )
                                                )
                                                .otherwise(() => null)}
                                        </Box>
                                        <Box style={{ flex: 1 }}>
                                            <FileButton
                                                accept="image/*"
                                                onChange={(file) =>
                                                    handleImageSelect(
                                                        file,
                                                        "image"
                                                    )
                                                }
                                            >
                                                {(props) => (
                                                    <Button
                                                        {...props}
                                                        fullWidth
                                                        leftSection={
                                                            <IconPhoto
                                                                size={16}
                                                            />
                                                        }
                                                        size="sm"
                                                        variant="light"
                                                    >
                                                        {item.image_key ||
                                                        item.image_file
                                                            ? "Change Image"
                                                            : "Select Image"}
                                                    </Button>
                                                )}
                                            </FileButton>
                                        </Box>
                                    </Stack>
                                );
                            }
                        )
                        .with(
                            {
                                media_type: "youtube",
                            },
                            (youtubeItem) => {
                                const youtubeImageSrc = `https://img.youtube.com/vi/${youtubeItem.youtube_video_id}/maxresdefault.jpg`;
                                const customThumbnailSrc = thumbnailPreviewUrl
                                    ? thumbnailPreviewUrl
                                    : youtubeItem.video_custom_thumbnail_key
                                      ? `${process.env.NEXT_PUBLIC_ASSET_URL}${youtubeItem.video_custom_thumbnail_key}`
                                      : null;

                                return (
                                    <Stack gap="sm">
                                        <TextInput
                                            description="Enter the YouTube video ID (e.g., 'dQw4w9WgXcQ' from https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
                                            label="YouTube Video ID"
                                            onChange={(e) =>
                                                onUpdate(item.id, {
                                                    youtube_video_id:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="dQw4w9WgXcQ"
                                            required
                                            size="sm"
                                            value={youtubeItem.youtube_video_id}
                                        />

                                        {youtubeItem.youtube_video_id && (
                                            <Group align="flex-start" gap="md">
                                                <Box
                                                    style={{
                                                        flex: "0 0 200px",
                                                    }}
                                                >
                                                    <Text
                                                        fw={500}
                                                        mb="xs"
                                                        size="xs"
                                                    >
                                                        Default Thumbnail
                                                    </Text>
                                                    <PhotoView
                                                        src={youtubeImageSrc}
                                                    >
                                                        <Image
                                                            alt="YouTube thumbnail"
                                                            fit="cover"
                                                            h={112}
                                                            radius="md"
                                                            src={
                                                                youtubeImageSrc
                                                            }
                                                            w={200}
                                                        />
                                                    </PhotoView>
                                                </Box>

                                                <Box style={{ flex: 1 }}>
                                                    <Text
                                                        fw={500}
                                                        mb="xs"
                                                        size="xs"
                                                    >
                                                        Custom Thumbnail
                                                        (Optional)
                                                    </Text>

                                                    {customThumbnailSrc && (
                                                        <PhotoView
                                                            src={
                                                                customThumbnailSrc
                                                            }
                                                        >
                                                            <Image
                                                                alt="Custom thumbnail"
                                                                fit="cover"
                                                                w={200}
                                                                h={112}
                                                                mt="xs"
                                                                radius="md"
                                                                src={
                                                                    customThumbnailSrc
                                                                }
                                                            />
                                                        </PhotoView>
                                                    )}

                                                    <FileButton
                                                        accept="image/*"
                                                        onChange={(file) =>
                                                            handleImageSelect(
                                                                file,
                                                                "thumbnail"
                                                            )
                                                        }
                                                    >
                                                        {(props) => (
                                                            <Button
                                                                mt={
                                                                    customThumbnailSrc
                                                                        ? 10
                                                                        : undefined
                                                                }
                                                                w={200}
                                                                {...props}
                                                                leftSection={
                                                                    <IconPhoto
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                }
                                                                size="sm"
                                                                variant="light"
                                                            >
                                                                {youtubeItem.video_custom_thumbnail_key ||
                                                                youtubeItem.video_custom_thumbnail_file
                                                                    ? "Change"
                                                                    : "Select"}
                                                            </Button>
                                                        )}
                                                    </FileButton>
                                                </Box>
                                            </Group>
                                        )}
                                    </Stack>
                                );
                            }
                        )
                        .exhaustive()}
                </Stack>
            </Card>
        </Box>
    );
}
