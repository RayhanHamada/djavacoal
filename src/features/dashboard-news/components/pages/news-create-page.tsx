"use client";

import { useCallback } from "react";

import { useRouter } from "next/navigation";

import { Container, Paper, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

import { NewsForm, NewsFormValues } from "..";
import { rpc } from "@/lib/rpc";

/**
 * NewsCreatePage - Page for creating new news articles
 */
export function NewsCreatePage() {
    const router = useRouter();

    // Create mutation
    const createMutation = useMutation(
        rpc.dashboardNews.createNews.mutationOptions({
            onSuccess: (_, variables) => {
                const statusMessages = {
                    draft: "News article saved as draft",
                    published: "News article published successfully",
                    unpublished: "News article saved as unpublished",
                };
                const message =
                    variables.status && statusMessages[variables.status]
                        ? statusMessages[variables.status]
                        : "News article created";
                notifications.show({
                    title: "Success",
                    message,
                    color: "green",
                });
                router.push(`/dashboard/news`);
            },
            onError: (error) => {
                notifications.show({
                    title: "Error",
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to create news article",
                    color: "red",
                });
            },
        })
    );

    const handleSubmit = useCallback(
        (formData: NewsFormValues) => {
            createMutation.mutate({
                slug: formData.slug,
                imageKey: formData.imageKey,
                enTitle: formData.enTitle,
                arTitle: formData.arTitle,
                enContent: formData.enContent,
                arContent: formData.arContent,
                metadataTitle: formData.metadataTitle,
                metadataDescription: formData.metadataDescription,
                metadataTags: formData.metadataTags,
                mode: formData.mode,
                status: formData.status,
                publishedAt: formData.publishedAt,
            });
        },
        [createMutation]
    );

    return (
        <Container size="lg" py="xl">
            <Paper p="xl" withBorder>
                <Title order={2} mb="xl">
                    Create News Article
                </Title>

                <NewsForm
                    isEditMode={false}
                    isSubmitting={createMutation.isPending}
                    onSubmit={handleSubmit}
                    storageKey="news-create-draft"
                />
            </Paper>
        </Container>
    );
}
