"use client";

import { useMemo } from "react";

import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";

import { rpc } from "@/lib/rpc";

interface ReelItem {
    url: string;
    videoId: string;
}

/**
 * Hook for managing YouTube video URL (who we are section)
 */
export function useYouTubeUrl() {
    // Fetch YouTube URL
    const { data, isLoading } = useQuery(
        rpc.staticMedia.getYouTubeUrl.queryOptions({
            input: {
                kvKey: "who_we_are_video",
            },
        })
    );

    // Save URL mutation
    const saveMutation = useMutation(
        rpc.staticMedia.saveYouTubeUrl.mutationOptions({
            onSuccess: async (_, __, ___, { client }) => {
                notifications.show({
                    title: "Success",
                    message: "YouTube video updated successfully",
                    color: "green",
                });

                await Promise.all([
                    client.invalidateQueries({
                        queryKey: rpc.staticMedia.getYouTubeUrl.key({
                            input: {
                                kvKey: "who_we_are_video",
                            },
                        }),
                    }),
                ]);
            },
            onError: () => {
                notifications.show({
                    title: "Error",
                    message: "Failed to update YouTube video",
                    color: "red",
                });
            },
        })
    );

    const saveUrl = async (url: string) => {
        await saveMutation.mutateAsync({
            kvKey: "who_we_are_video",
            url,
        });
    };

    return {
        url: data?.url || null,
        videoId: data?.videoId || null,
        isLoading,
        saveUrl,
        isSaving: saveMutation.isPending,
    };
}

/**
 * Hook for managing reels (YouTube Shorts)
 */
export function useReels() {
    // Fetch reels
    const { data, isLoading } = useQuery(
        rpc.staticMedia.getReels.queryOptions({
            input: {},
        })
    );

    // Save reels mutation
    const saveMutation = useMutation(
        rpc.staticMedia.saveReels.mutationOptions({
            onSuccess: async (_, __, ___, { client }) => {
                notifications.show({
                    title: "Success",
                    message: "Reels updated successfully",
                    color: "green",
                });

                await Promise.all([
                    client.invalidateQueries({
                        queryKey: rpc.staticMedia.getReels.key({ input: {} }),
                    }),
                ]);
            },
            onError: () => {
                notifications.show({
                    title: "Error",
                    message: "Failed to update reels",
                    color: "red",
                });
            },
        })
    );

    const reels = useMemo(() => data?.reels || [], [data?.reels]);

    const saveReels = async (reels: ReelItem[]) => {
        await saveMutation.mutateAsync({ reels });
    };

    return {
        reels,
        isLoading,
        saveReels,
        isSaving: saveMutation.isPending,
    };
}
