"use client";

import { useMemo, useState } from "react";

import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";

import { rpc } from "@/lib/rpc";

/**
 * Hook for managing a photo list (carousel, galleries, etc.)
 */
export function usePhotoList(
    kvKey:
        | "home_carousel_photo"
        | "visit_our_factory_photo"
        | "factory_photo"
        | "factory_gallery_photos"
        | "product_gallery_photos"
) {
    // Fetch photo list
    const { data, isLoading } = useQuery(
        rpc.staticMedia.getPhotoList.queryOptions({
            input: { kvKey },
        })
    );

    // Save photo list mutation
    const saveMutation = useMutation(
        rpc.staticMedia.savePhotoList.mutationOptions({
            onSuccess: (_, __, ___, context) => {
                context.client.invalidateQueries({
                    queryKey: rpc.staticMedia.getPhotoList.key({
                        input: {
                            kvKey,
                        },
                    }),
                });
                notifications.show({
                    title: "Success",
                    message: "Photos updated successfully",
                    color: "green",
                });
            },
            onError: () => {
                notifications.show({
                    title: "Error",
                    message: "Failed to update photos",
                    color: "red",
                });
            },
        })
    );

    // Delete photo mutation
    const deleteMutation = useMutation(
        rpc.staticMedia.deletePhoto.mutationOptions({
            onError: () => {
                notifications.show({
                    title: "Error",
                    message: "Failed to delete photo",
                    color: "red",
                });
            },
        })
    );

    const photos = useMemo(() => data?.photos || [], [data?.photos]);

    const savePhotos = async (photoKeys: string[]) => {
        await saveMutation.mutateAsync({ kvKey, photoKeys });
    };

    const deletePhoto = async (key: string) => {
        await deleteMutation.mutateAsync({ key });
    };

    return {
        photos,
        isLoading,
        savePhotos,
        deletePhoto,
        isSaving: saveMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}

/**
 * Hook for uploading photos
 */
export function usePhotoUpload(
    prefix:
        | "carousel"
        | "factory-visit"
        | "factory-photo"
        | "reels"
        | "factory-gallery"
        | "product-gallery"
) {
    const [isUploading, setIsUploading] = useState(false);

    const generateUrlMutation = useMutation(
        rpc.staticMedia.generateUploadUrl.mutationOptions()
    );

    const uploadPhoto = async (file: File): Promise<string> => {
        setIsUploading(true);
        try {
            // Generate presigned URL
            const { uploadUrl, key } = await generateUrlMutation.mutateAsync({
                mimeType: file.type,
                size: file.size,
                prefix,
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

            return key;
        } finally {
            setIsUploading(false);
        }
    };

    return {
        uploadPhoto,
        isUploading,
    };
}
