import type {} from "./use-product-form";
import type { ProductDetail } from "../server/schemas";

import { useRouter } from "next/navigation";

import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useFileUpload } from "./use-file-upload";
import { ProductFormValues } from "@/features/dashboard-product/utils";
import { client, rpc } from "@/lib/rpc";

export function useProductMutations(product?: ProductDetail) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { uploadAllFiles } = useFileUpload();

    const createMutation = useMutation({
        mutationFn: async (values: ProductFormValues) => {
            const uploadedValues = await uploadAllFiles(values);

            return await client.dashboardProduct.createProduct({
                en_name: uploadedValues.en_name,
                ar_name: uploadedValues.ar_name,
                en_description: uploadedValues.en_description,
                ar_description: uploadedValues.ar_description,
                medias: uploadedValues.medias.map((m, index) => {
                    if (m.media_type === "image") {
                        return {
                            media_type: "image" as const,
                            image_key: m.image_key,
                            order_index: index,
                        };
                    }
                    return {
                        media_type: "youtube" as const,
                        youtube_video_id: m.youtube_video_id,
                        video_custom_thumbnail_key:
                            m.video_custom_thumbnail_key,
                        order_index: index,
                    };
                }),
                specifications: uploadedValues.specifications.map(
                    (s, index) => ({
                        spec_photo_key: s.spec_photo_key,
                        order_index: index,
                    })
                ),
                variants: uploadedValues.variants.map((v, index) => ({
                    en_variant_name: v.en_variant_name,
                    ar_variant_name: v.ar_variant_name,
                    variant_sizes: v.variant_sizes,
                    variant_photo_key: v.variant_photo_key,
                    order_index: index,
                })),
                moq: uploadedValues.moq,
                production_capacity: uploadedValues.production_capacity,
                packaging_option_ids:
                    uploadedValues.packaging_option_ids.map(Number),
                is_hidden: uploadedValues.is_hidden,
                order_index: 0,
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: rpc.dashboardProduct.listProducts.key(),
            });
            notifications.show({
                title: "Success",
                message: "Product created successfully",
                color: "green",
            });
            router.push("/dashboard/products");
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Error",
                message: error.message,
                color: "red",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (values: ProductFormValues) => {
            if (!product) throw new Error("Product ID is required");

            const uploadedValues = await uploadAllFiles(values);

            return await client.dashboardProduct.updateProduct({
                id: product.id,
                en_name: uploadedValues.en_name,
                ar_name: uploadedValues.ar_name,
                en_description: uploadedValues.en_description,
                ar_description: uploadedValues.ar_description,
                medias: uploadedValues.medias.map((m, index) => {
                    if (m.media_type === "image") {
                        return {
                            media_type: "image" as const,
                            image_key: m.image_key,
                            order_index: index,
                        };
                    }
                    return {
                        media_type: "youtube" as const,
                        youtube_video_id: m.youtube_video_id,
                        video_custom_thumbnail_key:
                            m.video_custom_thumbnail_key,
                        order_index: index,
                    };
                }),
                specifications: uploadedValues.specifications.map(
                    (s, index) => ({
                        spec_photo_key: s.spec_photo_key,
                        order_index: index,
                    })
                ),
                variants: uploadedValues.variants.map((v, index) => ({
                    en_variant_name: v.en_variant_name,
                    ar_variant_name: v.ar_variant_name,
                    variant_sizes: v.variant_sizes,
                    variant_photo_key: v.variant_photo_key,
                    order_index: index,
                })),
                moq: uploadedValues.moq,
                production_capacity: uploadedValues.production_capacity,
                packaging_option_ids:
                    uploadedValues.packaging_option_ids.map(Number),
                is_hidden: uploadedValues.is_hidden,
                order_index: product.order_index,
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: rpc.dashboardProduct.getProductById.key(),
            });
            await queryClient.invalidateQueries({
                queryKey: rpc.dashboardProduct.listProducts.key(),
            });

            notifications.show({
                title: "Success",
                message: "Product updated successfully",
                color: "green",
            });
            router.push("/dashboard/products");
        },
        onError: (error: Error) => {
            notifications.show({
                title: "Error",
                message: error.message,
                color: "red",
            });
        },
    });

    return { createMutation, updateMutation };
}
