import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

import { rpc } from "@/lib/rpc";

export function useImageUpload() {
    const generateUrlMutation = useMutation(
        rpc.dashboardProduct.generateImageUploadUrl.mutationOptions()
    );

    const uploadImage = async (photo: File): Promise<string> => {
        const urlData = await generateUrlMutation.mutateAsync({
            mimeType: photo.type,
            size: photo.size,
        });

        const uploadResponse = await fetch(urlData.uploadUrl, {
            method: "PUT",
            body: photo,
            headers: {
                "Content-Type": photo.type,
            },
        });

        if (!uploadResponse.ok) {
            notifications.show({
                title: "Failed to upload image",
                message: "",
                color: "red",
            });
            throw new Error("Upload failed");
        }

        return urlData.key;
    };

    return {
        uploadImage,
        isUploading: generateUrlMutation.isPending,
    };
}
