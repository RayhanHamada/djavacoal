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
    horizontalListSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
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
} from "@mantine/core";
import { IconGripVertical, IconPhoto, IconTrash } from "@tabler/icons-react";

export type SpecificationItem = {
    id: string;
    spec_photo_key: string;
    spec_photo_file?: File; // For deferred upload
    order_index: number;
};

interface SpecificationListInputProps {
    value: SpecificationItem[];
    onChange: (value: SpecificationItem[]) => void;
    error?: string;
}

export function SpecificationListInput({
    value,
    onChange,
    error,
}: SpecificationListInputProps) {
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

    const addSpecification = () => {
        const newSpec: SpecificationItem = {
            id: `new-${Date.now()}`,
            spec_photo_key: "",
            order_index: value.length,
        };
        onChange([...value, newSpec]);
    };

    const removeSpecification = (id: string) => {
        onChange(
            value
                .filter((item) => item.id !== id)
                .map((item, index) => ({ ...item, order_index: index }))
        );
    };

    const updateSpecification = (
        id: string,
        updates: Partial<SpecificationItem>
    ) => {
        onChange(
            value.map((item) =>
                item.id === id ? { ...item, ...updates } : item
            )
        );
    };

    return (
        <Stack gap="md">
            <Group gap="sm">
                <Button
                    leftSection={<IconPhoto size={16} />}
                    onClick={addSpecification}
                    size="sm"
                    variant="light"
                >
                    Add Specification
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
                    strategy={horizontalListSortingStrategy}
                >
                    <Box
                        style={{
                            display: "flex",
                            gap: "1rem",
                            overflowX: "auto",
                            paddingBottom: "1rem",
                        }}
                    >
                        {value.map((item) => (
                            <SortableSpecificationItem
                                item={item}
                                key={item.id}
                                onRemove={removeSpecification}
                                onUpdate={updateSpecification}
                            />
                        ))}
                    </Box>
                </SortableContext>
            </DndContext>

            {value.length === 0 && (
                <Text c="dimmed" size="sm" ta="center">
                    No specifications added yet. Click the button above to add
                    portrait images.
                </Text>
            )}
        </Stack>
    );
}

interface SortableSpecificationItemProps {
    item: SpecificationItem;
    onUpdate: (id: string, updates: Partial<SpecificationItem>) => void;
    onRemove: (id: string) => void;
}

function SortableSpecificationItem({
    item,
    onUpdate,
    onRemove,
}: SortableSpecificationItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id: item.id,
        });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Create preview URL from File
    useEffect(() => {
        if (item.spec_photo_file) {
            const url = URL.createObjectURL(item.spec_photo_file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreviewUrl(null);
    }, [item.spec_photo_file]);

    const handleImageSelect = (file: File | null) => {
        if (!file) return;
        onUpdate(item.id, { spec_photo_file: file, spec_photo_key: "" });
    };

    return (
        <Box ref={setNodeRef} style={style}>
            <Card
                padding="md"
                radius="md"
                shadow="sm"
                style={{
                    minWidth: "280px",
                    maxWidth: "280px",
                }}
                withBorder
            >
                <Stack gap="md">
                    <Group
                        gap="xs"
                        justify="space-between"
                        style={{ cursor: "grab" }}
                        {...listeners}
                        {...attributes}
                    >
                        <Group gap="xs">
                            <IconGripVertical size={16} />
                            <Text fw={500} size="sm">
                                Specification
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

                    <FileButton accept="image/*" onChange={handleImageSelect}>
                        {(props) => (
                            <Button
                                {...props}
                                fullWidth
                                leftSection={<IconPhoto size={16} />}
                                size="sm"
                                variant="light"
                            >
                                {item.spec_photo_key || item.spec_photo_file
                                    ? "Change Image"
                                    : "Select Image"}
                            </Button>
                        )}
                    </FileButton>

                    {(item.spec_photo_key || previewUrl) && (
                        <Image
                            alt="Specification"
                            fit="cover"
                            h={400}
                            radius="md"
                            src={
                                previewUrl ||
                                `${process.env.NEXT_PUBLIC_ASSET_URL}${item.spec_photo_key}`
                            }
                            w="100%"
                        />
                    )}
                </Stack>
            </Card>
        </Box>
    );
}
