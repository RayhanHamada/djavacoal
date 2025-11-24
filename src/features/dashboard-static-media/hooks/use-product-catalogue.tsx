"use client";

import { useState } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";

import { rpc } from "@/lib/rpc";

/**
 * Hook for managing product catalogue PDF upload
 */
export function useProductCatalogue() {
    const [isUploading, setIsUploading] = useState(false);

    // Query to get current catalogue
    const { data, isLoading } = useQuery(
        rpc.staticMedia.getProductCatalogue.queryOptions()
    );

    // Mutation to generate presigned URL for PDF upload
    const generateUrlMutation = useMutation(
        rpc.staticMedia.generatePdfUploadUrl.mutationOptions()
    );

    // Mutation to save catalogue file key
    const saveMutation = useMutation(
        rpc.staticMedia.saveProductCatalogue.mutationOptions({
            onSuccess: (_, __, ___, context) => {
                context.client.invalidateQueries({
                    queryKey: rpc.staticMedia.getProductCatalogue.key(),
                });
            },
        })
    );

    // Mutation to delete catalogue
    const deleteMutation = useMutation(
        rpc.staticMedia.deleteProductCatalogue.mutationOptions({
            onSuccess: (_, __, ___, context) => {
                context.client.invalidateQueries({
                    queryKey: rpc.staticMedia.getProductCatalogue.key(),
                });
            },
        })
    );

    /**
     * Upload PDF file to R2
     */
    const uploadPdf = async (file: File): Promise<string> => {
        // Validate file type
        if (file.type !== "application/pdf") {
            throw new Error("Only PDF files are allowed");
        }

        // Validate file size (50MB max)
        const maxSize = 50 * 1024 * 1024; // 50MB in bytes
        if (file.size > maxSize) {
            throw new Error("File size must not exceed 50MB");
        }

        // Generate presigned URL
        const { uploadUrl, key } = await generateUrlMutation.mutateAsync({
            mimeType: "application/pdf",
            size: file.size,
            fileName: file.name,
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
            throw new Error("Failed to upload file to R2");
        }

        return key;
    };

    /**
     * Save catalogue (upload and save key)
     */
    const saveCatalogue = async (file: File) => {
        setIsUploading(true);
        try {
            const key = await uploadPdf(file);
            await saveMutation.mutateAsync({ fileKey: key });
        } finally {
            setIsUploading(false);
        }
    };

    /**
     * Delete catalogue
     */
    const deleteCatalogue = async () => {
        if (!data?.fileKey) {
            throw new Error("No catalogue to delete");
        }
        await deleteMutation.mutateAsync({ fileKey: data.fileKey });
    };

    return {
        // Data
        catalogue: data || { fileKey: null, fileUrl: null },

        // Loading states
        isLoading,
        isUploading,
        isDeleting: deleteMutation.isPending,

        // Actions
        uploadPdf,
        saveCatalogue,
        deleteCatalogue,
    };
}
