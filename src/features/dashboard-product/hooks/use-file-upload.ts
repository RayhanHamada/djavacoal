import type { MediaItem } from "../components/molecules/media-list-input";
import type { SpecificationItem } from "../components/molecules/specification-list-input";
import type { VariantItem } from "../components/molecules/variant-list-input";

import { notifications } from "@mantine/notifications";

import { client } from "@/lib/rpc";

interface UploadableFormValues {
    medias: MediaItem[];
    specifications: SpecificationItem[];
    variants: VariantItem[];
}

export function useFileUpload() {
    async function uploadAllFiles<T extends UploadableFormValues>(
        values: T
    ): Promise<T> {
        const uploadedValues = { ...values };

        // Count total files to upload
        const totalFiles =
            uploadedValues.medias.filter(
                (m) =>
                    (m.media_type === "image" && m.image_file) ||
                    (m.media_type === "youtube" &&
                        m.video_custom_thumbnail_file)
            ).length +
            uploadedValues.specifications.filter((s) => s.spec_photo_file)
                .length +
            uploadedValues.variants.filter((v) => v.variant_photo_file).length;

        if (totalFiles) {
            notifications.show({
                id: "uploading-files",
                loading: true,
                title: "Uploading Files",
                message: `Uploading ${totalFiles} file(s)...`,
                autoClose: false,
                withCloseButton: false,
            });
        }

        try {
            // Upload media files
            for (let i = 0; i < uploadedValues.medias.length; i++) {
                const media = uploadedValues.medias[i];

                if (media.media_type === "image" && media.image_file) {
                    const { upload_url, key } =
                        await client.dashboardProduct.generateProductUploadUrl({
                            file_name: media.image_file.name,
                            upload_type: "media",
                            mime_type: media.image_file.type,
                        });

                    await fetch(upload_url, {
                        method: "PUT",
                        body: media.image_file,
                        headers: { "Content-Type": media.image_file.type },
                    });

                    uploadedValues.medias[i] = {
                        ...media,
                        image_key: key,
                        image_file: undefined,
                    };
                } else if (
                    media.media_type === "youtube" &&
                    media.video_custom_thumbnail_file
                ) {
                    const { upload_url, key } =
                        await client.dashboardProduct.generateProductUploadUrl({
                            file_name: media.video_custom_thumbnail_file.name,
                            upload_type: "video-thumbnail",
                            mime_type: media.video_custom_thumbnail_file.type,
                        });

                    await fetch(upload_url, {
                        method: "PUT",
                        body: media.video_custom_thumbnail_file,
                        headers: {
                            "Content-Type":
                                media.video_custom_thumbnail_file.type,
                        },
                    });

                    uploadedValues.medias[i] = {
                        ...media,
                        video_custom_thumbnail_key: key,
                        video_custom_thumbnail_file: undefined,
                    };
                }
            }

            // Upload specification files
            for (let i = 0; i < uploadedValues.specifications.length; i++) {
                const spec = uploadedValues.specifications[i];

                if (spec.spec_photo_file) {
                    const { upload_url, key } =
                        await client.dashboardProduct.generateProductUploadUrl({
                            file_name: spec.spec_photo_file.name,
                            upload_type: "specification",
                            mime_type: spec.spec_photo_file.type,
                        });

                    await fetch(upload_url, {
                        method: "PUT",
                        body: spec.spec_photo_file,
                        headers: { "Content-Type": spec.spec_photo_file.type },
                    });

                    uploadedValues.specifications[i] = {
                        ...spec,
                        spec_photo_key: key,
                        spec_photo_file: undefined,
                    };
                }
            }

            // Upload variant files
            for (let i = 0; i < uploadedValues.variants.length; i++) {
                const variant = uploadedValues.variants[i];

                if (variant.variant_photo_file) {
                    const { upload_url, key } =
                        await client.dashboardProduct.generateProductUploadUrl({
                            file_name: variant.variant_photo_file.name,
                            upload_type: "variant",
                            mime_type: variant.variant_photo_file.type,
                        });

                    await fetch(upload_url, {
                        method: "PUT",
                        body: variant.variant_photo_file,
                        headers: {
                            "Content-Type": variant.variant_photo_file.type,
                        },
                    });

                    uploadedValues.variants[i] = {
                        ...variant,
                        variant_photo_key: key,
                        variant_photo_file: undefined,
                    };
                }
            }

            if (totalFiles) {
                notifications.update({
                    id: "uploading-files",
                    loading: false,
                    title: "Upload Complete",
                    message: `Successfully uploaded ${totalFiles} file(s)`,
                    color: "green",
                    autoClose: 2000,
                });
            }

            return uploadedValues;
        } catch (error) {
            if (totalFiles) {
                notifications.update({
                    id: "uploading-files",
                    loading: false,
                    title: "Upload Failed",
                    message: "Failed to upload files. Please try again.",
                    color: "red",
                    autoClose: 3000,
                });
            }
            throw error;
        }
    }

    return {
        uploadAllFiles,
    };
}
