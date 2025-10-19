"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
    Alert,
    Box,
    Button,
    Container,
    Group,
    Loader,
    Paper,
    Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck, IconLoader } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { NewsForm } from "..";
import { client, rpc } from "@/lib/rpc";

interface NewsEditPageProps {
    newsId: number;
}

/**
 * NewsEditPage - Page for editing existing news articles
 * Includes auto-save for unpublished articles
 */
export function NewsEditPage({ newsId }: NewsEditPageProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isAutoSaving, setIsAutoSaving] = useState(false);

    // Fetch news article
    const { data, isLoading, error } = useQuery(
        rpc.dashboardNews.getNewsById.queryOptions({
            input: {
                id: newsId,
            },
        })
    );

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async ({
            data: formData,
            publish,
        }: {
            data: any;
            publish: boolean;
        }) => {
            return await client.dashboardNews.updateNews({
                id: newsId,
                imageKey: formData.imageKey,
                enTitle: formData.enTitle,
                arTitle: formData.arTitle,
                enContent: formData.enContent,
                arContent: formData.arContent,
                metadataDescription: formData.metadataDescription,
                metadataTags: formData.metadataTags,
                publishedAt: formData.publishedAt,
                isPublished: publish,
            });
        },
        onSuccess: (_, variables) => {
            if (variables.publish) {
                notifications.show({
                    title: "Success",
                    message: "News article updated and republished",
                    color: "green",
                });
            } else {
                notifications.show({
                    title: "Saved",
                    message: "News article updated",
                    color: "green",
                    icon: <IconCheck size={18} />,
                });
            }
            setHasUnsavedChanges(false);
            setIsAutoSaving(false);
            queryClient.invalidateQueries({
                queryKey: ["dashboardNews", "getNewsById", newsId],
            });
        },
        onError: (error) => {
            setIsAutoSaving(false);
            notifications.show({
                title: "Error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to update news article",
                color: "red",
            });
        },
    });

    const handleSubmit = (formData: any, publish: boolean) => {
        updateMutation.mutate({ data: formData, publish });
    };

    // Auto-save is handled by detecting changes in form data
    // For published articles, we show a notification instead of auto-saving
    // TODO: Implement auto-save logic with debounce if needed

    if (isLoading) {
        return (
            <Container>
                <Box p="xl" style={{ textAlign: "center" }}>
                    <Loader size="lg" />
                </Box>
            </Container>
        );
    }

    if (error || !data) {
        return (
            <Container>
                <Paper p="xl" withBorder>
                    <Title order={3} c="red">
                        Error loading news article
                    </Title>
                    <Box mt="md">
                        {error instanceof Error
                            ? error.message
                            : "News article not found"}
                    </Box>
                    <Button
                        mt="lg"
                        onClick={() => router.push("/dashboard/news")}
                    >
                        Back to News List
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container size="lg" py="xl">
            <Paper p="xl" withBorder>
                <Group justify="space-between" align="center" mb="xl">
                    <Title order={2}>Edit News Article</Title>
                    {isAutoSaving && (
                        <Group gap="xs">
                            <IconLoader size={16} />
                            <Box component="span" c="dimmed" fz="sm">
                                Saving...
                            </Box>
                        </Group>
                    )}
                </Group>

                {/* Unsaved changes alert for published articles */}
                {hasUnsavedChanges && data.isPublished && (
                    <Alert
                        icon={<IconAlertCircle size={18} />}
                        title="Unsaved Changes"
                        color="orange"
                        mb="lg"
                        withCloseButton={false}
                    >
                        <Group justify="space-between" align="center">
                            <Box>
                                You have unsaved changes. Click the button to
                                save and republish.
                            </Box>
                            <Button
                                size="sm"
                                onClick={() => {
                                    // Get form data from local storage
                                    const stored = localStorage.getItem(
                                        `news-edit-${newsId}`
                                    );
                                    if (stored) {
                                        const formData = JSON.parse(stored);
                                        handleSubmit(formData, true);
                                    }
                                }}
                                loading={updateMutation.isPending}
                            >
                                Save and Republish
                            </Button>
                        </Group>
                    </Alert>
                )}

                <NewsForm
                    initialData={{
                        slug: data.slug,
                        imageKey: data.imageKey || undefined,
                        enTitle: data.enTitle,
                        arTitle: data.arTitle,
                        enContent: data.enContent,
                        arContent: data.arContent,
                        metadataTitle: data.metadataTitle,
                        metadataDescription: data.metadataDescription,
                        metadataTags: data.metadataTags,
                        publishedAt: data.publishedAt
                            ? new Date(data.publishedAt)
                            : new Date(),
                        useAutoMetadataDescription: false,
                    }}
                    isEditMode={true}
                    isSubmitting={updateMutation.isPending}
                    onSubmit={handleSubmit}
                    storageKey={`news-edit-${newsId}`}
                />
            </Paper>
        </Container>
    );
}
