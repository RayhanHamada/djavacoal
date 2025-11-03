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
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
    Alert,
    Button,
    Group,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconVideo } from "@tabler/icons-react";

import {
    EmptyState,
    SectionHeader,
    YouTubeThumbnail,
} from "@/features/dashboard-static-media/components/atoms";
import { useReels } from "@/features/dashboard-static-media/hooks";

interface ReelsManagerProps {
    title: string;
    description: string;
}

/**
 * Extract YouTube video ID from URL
 */
function extractVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/, // Direct ID
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }

    return null;
}

/**
 * Validate if URL is a YouTube Shorts URL
 */
function isYouTubeShorts(url: string): boolean {
    return url.includes("youtube.com/shorts/") || url.includes("youtu.be/");
}

/**
 * ReelsManager - Molecule component for managing YouTube Shorts reels
 */
export function ReelsManager({ title, description }: ReelsManagerProps) {
    const { reels, isLoading, saveReels, isSaving } = useReels();

    const [localReels, setLocalReels] = useState<
        Array<{ url: string; videoId: string }>
    >([]);
    const [newReelUrl, setNewReelUrl] = useState("");

    useEffect(() => {
        setLocalReels(reels);
    }, [reels]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = localReels.findIndex(
                (r) => r.videoId === active.id
            );
            const newIndex = localReels.findIndex((r) => r.videoId === over.id);

            const reordered = arrayMove(localReels, oldIndex, newIndex);
            setLocalReels(reordered);

            // Save immediately
            await saveReels(reordered);
        }
    };

    const handleAdd = async () => {
        if (!newReelUrl.trim()) {
            notifications.show({
                title: "Error",
                message: "Please enter a YouTube URL",
                color: "red",
            });
            return;
        }

        const videoId = extractVideoId(newReelUrl);
        if (!videoId) {
            notifications.show({
                title: "Error",
                message: "Invalid YouTube URL",
                color: "red",
            });
            return;
        }

        // Validate it's a Shorts URL
        if (!isYouTubeShorts(newReelUrl)) {
            notifications.show({
                title: "Warning",
                message: "This doesn't appear to be a YouTube Shorts URL",
                color: "yellow",
            });
        }

        // Check for duplicates
        if (localReels.some((r) => r.videoId === videoId)) {
            notifications.show({
                title: "Error",
                message: "This reel is already added",
                color: "red",
            });
            return;
        }

        const newReels = [...localReels, { url: newReelUrl.trim(), videoId }];
        await saveReels(newReels);
        setNewReelUrl("");
    };

    const handleDelete = async (videoId: string) => {
        const newReels = localReels.filter((r) => r.videoId !== videoId);
        await saveReels(newReels);
    };

    return (
        <Stack gap="md">
            <SectionHeader title={title} description={description} />

            <Alert color="blue" variant="light" title="YouTube Shorts">
                <Text size="sm">
                    Add YouTube Shorts URLs. These will be displayed as reels on
                    the website.
                </Text>
            </Alert>

            <Group align="flex-end">
                <TextInput
                    label="YouTube Shorts URL"
                    placeholder="https://www.youtube.com/shorts/VIDEO_ID"
                    value={newReelUrl}
                    onChange={(e) => setNewReelUrl(e.target.value)}
                    leftSection={<IconVideo size={18} />}
                    style={{ flex: 1 }}
                    disabled={isSaving}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleAdd();
                        }
                    }}
                />
                <Button
                    leftSection={<IconPlus size={18} />}
                    onClick={handleAdd}
                    loading={isSaving}
                >
                    Add
                </Button>
            </Group>

            {isLoading ? (
                <Text size="sm" c="dimmed">
                    Loading...
                </Text>
            ) : localReels.length === 0 ? (
                <EmptyState
                    title="No reels yet"
                    description="Add YouTube Shorts to get started"
                />
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={localReels.map((r) => r.videoId)}
                        strategy={verticalListSortingStrategy}
                    >
                        <SimpleGrid
                            cols={{ base: 2, sm: 3, md: 4, lg: 5 }}
                            spacing="md"
                        >
                            {localReels.map((reel) => (
                                <YouTubeThumbnail
                                    key={reel.videoId}
                                    id={reel.videoId}
                                    videoId={reel.videoId}
                                    onDelete={() => handleDelete(reel.videoId)}
                                />
                            ))}
                        </SimpleGrid>
                    </SortableContext>
                </DndContext>
            )}
        </Stack>
    );
}
