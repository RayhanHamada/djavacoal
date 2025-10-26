import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { rpc } from "@/lib/rpc";

export function useImageUpload() {
    const t = useTranslations("PackagingOptions");

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
                title: t("form.errors.uploadFailed"),
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
