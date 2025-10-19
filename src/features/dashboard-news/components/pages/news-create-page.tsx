"use client";

import { useRouter } from "next/navigation";

import { Container, Paper, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

import { NewsForm, NewsFormValues } from "..";
import { client } from "@/lib/rpc";

/**
 * NewsCreatePage - Page for creating new news articles
 */
export function NewsCreatePage() {
    const router = useRouter();

    // Create mutation
    const createMutation = useMutation({
        mutationFn: async ({
            data,
            publish,
        }: {
            data: Parameters<typeof client.dashboardNews.createNews>[0];
            publish: boolean;
        }) => {
            return await client.dashboardNews.createNews({
                ...data,
                isPublished: publish,
            });
        },
        onSuccess: (result, variables) => {
            notifications.show({
                title: "Success",
                message: variables.publish
                    ? "News article created and published"
                    : "News article created as draft",
                color: "green",
            });
            router.push(`/dashboard/news/${result.id}/edit`);
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
    });

    const handleSubmit = (formData: NewsFormValues, publish: boolean) => {
        createMutation.mutate({
            data: {
                slug: formData.slug,
                imageKey: formData.imageKey,
                enTitle: formData.enTitle,
                arTitle: formData.arTitle,
                enContent: formData.enContent,
                arContent: formData.arContent,
                metadataTitle: formData.metadataTitle,
                metadataDescription: formData.metadataDescription,
                metadataTags: formData.metadataTags,
                publishedAt: formData.publishedAt,
                isPublished: publish,
            },
            publish,
        });
    };

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
