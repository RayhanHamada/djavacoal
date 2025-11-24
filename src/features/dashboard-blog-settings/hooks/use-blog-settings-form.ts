import type { BlogSettingsFormValues } from "@/features/dashboard-blog-settings/lib";

import { useEffect, useState } from "react";

import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
    DEFAULT_BLOG_CHANGEFREQ,
    DEFAULT_BLOG_PRIORITY,
    UI_TEXT,
} from "@/features/dashboard-blog-settings/lib";
import { rpc } from "@/lib/rpc";

/**
 * Custom hook for managing blog settings form state and operations
 * Encapsulates data fetching, mutations, and form state management
 */
export function useBlogSettingsForm() {
    const [formValues, setFormValues] = useState<BlogSettingsFormValues>({
        changefreq: DEFAULT_BLOG_CHANGEFREQ,
        priority: DEFAULT_BLOG_PRIORITY,
    });

    // Fetch current settings
    const settingsQuery = useQuery(
        rpc.blogSettings.getBlogSettings.queryOptions({
            input: {},
        })
    );

    // Update mutation
    const updateMutation = useMutation(
        rpc.blogSettings.updateBlogSettings.mutationOptions({
            onSuccess: (_, __, ___, { client }) => {
                notifications.show({
                    title: UI_TEXT.SUCCESS_TITLE,
                    message: UI_TEXT.SUCCESS_MESSAGE,
                    color: "green",
                });
                client.invalidateQueries({
                    queryKey: rpc.blogSettings.getBlogSettings.key(),
                });
            },
            onError: () => {
                notifications.show({
                    title: UI_TEXT.ERROR_TITLE,
                    message: UI_TEXT.ERROR_MESSAGE,
                    color: "red",
                });
            },
        })
    );

    // Sync form values with fetched data
    useEffect(() => {
        if (settingsQuery.data) {
            setFormValues({
                changefreq: settingsQuery.data.sitemap_changefreq,
                priority: settingsQuery.data.sitemap_priority,
            });
        }
    }, [settingsQuery.data]);

    const handleSave = async () => {
        await updateMutation.mutateAsync({
            sitemap_changefreq: formValues.changefreq,
            sitemap_priority: formValues.priority,
        });
    };

    return {
        formValues,
        setFormValues,
        isLoading: settingsQuery.isLoading,
        isSaving: updateMutation.isPending,
        handleSave,
    };
}
