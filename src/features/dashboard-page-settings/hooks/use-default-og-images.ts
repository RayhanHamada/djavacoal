"use client";

import type { OgImagePlatformId } from "@/features/dashboard-page-settings/lib/constants";

import { useState } from "react";

import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";

import { rpc } from "@/lib/rpc";

/**
 * Hook for managing default OG images for all platforms
 */
export function useDefaultOgImages() {
    // Fetch all default OG images
    const { data, isLoading, refetch } = useQuery(
        rpc.pageSettings.getAllDefaultOgImages.queryOptions()
    );

    return {
        images: data?.images ?? [],
        isLoading,
        refetch,
    };
}

/**
 * Hook for uploading default OG images
 */
export function useDefaultOgImageUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadingPlatformId, setUploadingPlatformId] =
        useState<OgImagePlatformId | null>(null);

    const generateUrlMutation = useMutation(
        rpc.pageSettings.generateDefaultOgImageUploadUrl.mutationOptions()
    );

    const saveImageMutation = useMutation(
        rpc.pageSettings.saveDefaultOgImage.mutationOptions({
            onSuccess: (_, __, ___, context) => {
                context.client.invalidateQueries({
                    queryKey: rpc.pageSettings.getAllDefaultOgImages.key(),
                });
            },
        })
    );

    const uploadImage = async (
        platformId: OgImagePlatformId,
        file: File
    ): Promise<string> => {
        setIsUploading(true);
        setUploadingPlatformId(platformId);

        try {
            // Generate presigned URL
            const { uploadUrl, key } = await generateUrlMutation.mutateAsync({
                platformId,
                contentType: file.type,
                fileSize: file.size,
            });

            // Upload to R2
            const uploadResponse = await fetch(uploadUrl, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                },
            });

            if (!uploadResponse.ok) {
                throw new Error("Upload failed");
            }

            // Save the R2 key to KV
            await saveImageMutation.mutateAsync({
                platformId,
                r2Key: key,
            });

            return key;
        } finally {
            setIsUploading(false);
            setUploadingPlatformId(null);
        }
    };

    return {
        uploadImage,
        isUploading,
        uploadingPlatformId,
    };
}

/**
 * Hook for deleting default OG images
 */
export function useDefaultOgImageDelete() {
    const deleteMutation = useMutation(
        rpc.pageSettings.deleteDefaultOgImage.mutationOptions({
            onSuccess: (_, __, ___, context) => {
                context.client.invalidateQueries({
                    queryKey: rpc.pageSettings.getAllDefaultOgImages.key(),
                });
                notifications.show({
                    title: "Success",
                    message: "Image deleted successfully",
                    color: "green",
                });
            },
            onError: () => {
                notifications.show({
                    title: "Error",
                    message: "Failed to delete image",
                    color: "red",
                });
            },
        })
    );

    const deleteImage = async (platformId: OgImagePlatformId) => {
        await deleteMutation.mutateAsync({ platformId });
    };

    return {
        deleteImage,
        isDeleting: deleteMutation.isPending,
    };
}
