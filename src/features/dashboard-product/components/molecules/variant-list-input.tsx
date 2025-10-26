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
    Textarea,
} from "@mantine/core";
import { IconGripVertical, IconPhoto, IconTrash } from "@tabler/icons-react";

export type VariantItem = {
    id: string;
    en_variant_name: string;
    ar_variant_name: string;
    en_description?: string;
    ar_description?: string;
    variant_photo_key: string;
    variant_photo_file?: File; // For deferred upload
    order_index: number;
};

interface VariantListInputProps {
    value: VariantItem[];
    onChange: (value: VariantItem[]) => void;
    error?: string;
}

export function VariantListInput({
    value,
    onChange,
    error,
}: VariantListInputProps) {
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

    const addVariant = () => {
        const newVariant: VariantItem = {
            id: `new-${Date.now()}`,
            en_variant_name: "",
            ar_variant_name: "",
            en_description: "",
            ar_description: "",
            variant_photo_key: "",
            order_index: value.length,
        };
        onChange([...value, newVariant]);
    };

    const removeVariant = (id: string) => {
        onChange(
            value
                .filter((item) => item.id !== id)
                .map((item, index) => ({ ...item, order_index: index }))
        );
    };

    const updateVariant = (id: string, updates: Partial<VariantItem>) => {
        onChange(
            value.map((item) =>
                item.id === id
                    ? ({
                          ...item,
                          ...updates,
                      } as VariantItem)
                    : item
            )
        );
    };

    // Check if there are any unfilled variants
    const hasUnfilledVariants = value.some(
        (item) =>
            !item.en_variant_name ||
            !item.ar_variant_name ||
            (!item.variant_photo_key && !item.variant_photo_file)
    );

    return (
        <Stack gap="md">
            <Group gap="sm">
                <Button
                    disabled={hasUnfilledVariants}
                    leftSection={<IconPhoto size={16} />}
                    onClick={addVariant}
                    size="sm"
                    variant="light"
                >
                    Add Variant
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
                            <SortableVariantItem
                                item={item}
                                key={item.id}
                                onRemove={removeVariant}
                                onUpdate={updateVariant}
                            />
                        ))}
                    </Stack>
                </SortableContext>
            </DndContext>

            {value.length === 0 && (
                <Text c="dimmed" size="sm" ta="center">
                    No variants added yet. Click the button above to add product
                    variants.
                </Text>
            )}
        </Stack>
    );
}

interface SortableVariantItemProps {
    item: VariantItem;
    onUpdate: (id: string, updates: Partial<VariantItem>) => void;
    onRemove: (id: string) => void;
}

function SortableVariantItem({
    item,
    onUpdate,
    onRemove,
}: SortableVariantItemProps) {
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
        if (item.variant_photo_file) {
            const url = URL.createObjectURL(item.variant_photo_file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreviewUrl(null);
    }, [item.variant_photo_file]);

    const handleImageSelect = (file: File | null) => {
        if (!file) return;
        onUpdate(item.id, { variant_photo_file: file, variant_photo_key: "" });
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
                        <Text size="sm">Product Variant</Text>
                    </Group>
                }
            >
                <Stack gap="md">
                    <Group grow>
                        <TextInput
                            label="English Name"
                            onChange={(e) =>
                                onUpdate(item.id, {
                                    en_variant_name: e.target.value,
                                })
                            }
                            placeholder="e.g., Small Box"
                            required
                            value={item.en_variant_name}
                        />
                        <TextInput
                            dir="rtl"
                            label="Arabic Name"
                            onChange={(e) =>
                                onUpdate(item.id, {
                                    ar_variant_name: e.target.value,
                                })
                            }
                            placeholder="مثال: صندوق صغير"
                            required
                            value={item.ar_variant_name}
                        />
                    </Group>

                    <Group grow>
                        <Textarea
                            label="English Description (Optional)"
                            maxLength={1000}
                            minRows={3}
                            onChange={(e) =>
                                onUpdate(item.id, {
                                    en_description: e.target.value,
                                })
                            }
                            placeholder="Additional details..."
                            value={item.en_description}
                        />
                        <Textarea
                            dir="rtl"
                            label="Arabic Description (Optional)"
                            maxLength={1000}
                            minRows={3}
                            onChange={(e) =>
                                onUpdate(item.id, {
                                    ar_description: e.target.value,
                                })
                            }
                            placeholder="تفاصيل إضافية..."
                            value={item.ar_description}
                        />
                    </Group>

                    <FileButton accept="image/*" onChange={handleImageSelect}>
                        {(props) => (
                            <Button
                                {...props}
                                leftSection={<IconPhoto size={16} />}
                                size="sm"
                                variant="light"
                            >
                                {item.variant_photo_key ||
                                item.variant_photo_file
                                    ? "Change Image (Square)"
                                    : "Select Image (Square)"}
                            </Button>
                        )}
                    </FileButton>

                    {(item.variant_photo_key || previewUrl) && (
                        <Image
                            alt="Variant"
                            fit="contain"
                            h={200}
                            radius="md"
                            src={
                                previewUrl ||
                                `${process.env.NEXT_PUBLIC_ASSET_URL}/${item.variant_photo_key}`
                            }
                        />
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
