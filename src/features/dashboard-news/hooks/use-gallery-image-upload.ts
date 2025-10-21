import { useCallback } from "react";

import { nanoid } from "nanoid";

import { client } from "@/lib/rpc";

interface UploadResult {
    /** The R2 key where the image is stored */
    key: string;
    /** The public URL to access the image */
    url: string;
    /** The photo ID */
    photoId: string;
}

/**
 * Hook for uploading images to gallery path in R2
 * Used by rich text editors to upload images that should appear in gallery
 */
export function useGalleryImageUpload() {
    const uploadImage = useCallback(
        async (file: File): Promise<UploadResult> => {
            // Generate unique photo ID
            const photoId = nanoid();

            // Get presigned upload URL from gallery server
            const { uploadUrl, key } = await client.gallery.createPresignedUrl({
                name: photoId,
                mimeType: file.type,
                size: file.size,
            }); // Upload file to R2
            const uploadResponse = await fetch(uploadUrl, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                },
            });

            if (!uploadResponse.ok) {
                throw new Error("Failed to upload image to R2");
            }

            // Note: We don't call confirmUpload here because:
            // 1. Rich text editor images don't need name/description metadata
            // 2. They should appear in gallery but without explicit metadata
            // 3. The file is already uploaded and accessible via R2

            // Return public URL
            const url = `${process.env.NEXT_PUBLIC_ASSET_URL}/${key}`;

            return {
                key,
                url,
                photoId,
            };
        },
        []
    );

    return { uploadImage };
}
