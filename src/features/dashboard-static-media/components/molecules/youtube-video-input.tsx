"use client";

import { useEffect, useState } from "react";

import {
    Alert,
    Button,
    Group,
    Image,
    Paper,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy, IconVideo } from "@tabler/icons-react";

import { SectionHeader } from "@/features/dashboard-static-media/components/atoms";
import { useYouTubeUrl } from "@/features/dashboard-static-media/hooks";

interface YouTubeVideoInputProps {
    title: string;
    description: string;
}

/**
 * Extract YouTube video ID from URL
 */
function extractVideoId(url: string): string | null {
    const match = url.match(
        /^https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
    );

    return match?.at(1) ?? null;
}

/**
 * YouTubeVideoInput - Molecule component for managing a single YouTube video URL
 */
export function YouTubeVideoInput({
    title,
    description,
}: YouTubeVideoInputProps) {
    const { url, isLoading, saveUrl, isSaving } = useYouTubeUrl();

    const [inputValue, setInputValue] = useState("");
    const [previewVideoId, setPreviewVideoId] = useState<string | null>(null);

    useEffect(() => {
        if (url) {
            setInputValue(url);
        }
    }, [url]);

    useEffect(() => {
        const id = extractVideoId(inputValue);
        setPreviewVideoId(id);
    }, [inputValue]);

    const handleSave = async () => {
        if (!inputValue.trim()) {
            notifications.show({
                title: "Error",
                message: "Please enter a YouTube embed URL",
                color: "red",
            });
            return;
        }

        const id = extractVideoId(inputValue);
        if (!id) {
            notifications.show({
                title: "Error",
                message:
                    "Invalid YouTube embed URL. Please use format: https://www.youtube.com/embed/VIDEO_ID",
                color: "red",
            });
            return;
        }

        await saveUrl(inputValue.trim());
    };

    const thumbnailUrl = previewVideoId
        ? `https://img.youtube.com/vi/${previewVideoId}/maxresdefault.jpg`
        : null;

    return (
        <Stack gap="md">
            <SectionHeader title={title} description={description} />

            <Alert color="blue" variant="light" title="YouTube Embed URL">
                <Text size="sm">
                    Paste a YouTube embed URL in the format:
                    https://www.youtube.com/embed/VIDEO_ID
                </Text>
            </Alert>

            {isLoading ? (
                <Paper p="xl" withBorder>
                    <Text size="sm" c="dimmed">
                        Loading...
                    </Text>
                </Paper>
            ) : (
                <Stack gap="md">
                    <TextInput
                        label="YouTube Embed URL"
                        placeholder="https://www.youtube.com/embed/VIDEO_ID"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        leftSection={<IconVideo size={18} />}
                        disabled={isSaving}
                    />

                    {thumbnailUrl && (
                        <Paper p="md" withBorder radius="md">
                            <Stack gap="sm">
                                <Text size="sm" fw={500}>
                                    Preview:
                                </Text>
                                <Image
                                    src={thumbnailUrl}
                                    alt="YouTube thumbnail"
                                    h={200}
                                    fit="contain"
                                    fallbackSrc="https://via.placeholder.com/400x225?text=YouTube+Video"
                                />
                            </Stack>
                        </Paper>
                    )}

                    <Group>
                        <Button
                            leftSection={<IconDeviceFloppy size={18} />}
                            onClick={handleSave}
                            loading={isSaving}
                            disabled={!previewVideoId}
                        >
                            Save
                        </Button>
                    </Group>
                </Stack>
            )}
        </Stack>
    );
}
