"use client";

import { useRouter } from "next/navigation";

import { Container, Paper, Stack, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { PackagingOptionForm } from "@/features/dashboard-product/components";
import { rpc } from "@/lib/rpc";

export default function CreatePackagingOptionPage() {
    const t = useTranslations("PackagingOptions");
    const router = useRouter();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        ...rpc.dashboardProduct.createPackagingOption.mutationOptions(),
        onSuccess: () => {
            // Invalidate both list and individual queries
            queryClient.invalidateQueries({
                queryKey: rpc.dashboardProduct.listPackagingOptions.key(),
            });
            queryClient.invalidateQueries({
                queryKey: rpc.dashboardProduct.getPackagingOptionById.key(),
            });

            notifications.show({
                title: t("form.success.created"),
                message: "",
                color: "green",
            });
            router.push("/dashboard/products/packaging-options");
        },
        onError: () => {
            notifications.show({
                title: t("form.errors.createFailed"),
                message: "",
                color: "red",
            });
        },
    });

    const generateUrlMutation = useMutation(
        rpc.dashboardProduct.generateImageUploadUrl.mutationOptions()
    );

    const handleSubmit = async (data: {
        en_name: string;
        ar_name: string;
        en_description: string;
        ar_description: string;
        photo?: File;
    }) => {
        if (!data.photo) return;

        try {
            // Generate presigned URL
            const urlData = await generateUrlMutation.mutateAsync({
                mimeType: data.photo.type,
                size: data.photo.size,
            });

            // Upload to R2
            const uploadResponse = await fetch(urlData.uploadUrl, {
                method: "PUT",
                body: data.photo,
                headers: {
                    "Content-Type": data.photo.type,
                },
            });

            if (!uploadResponse.ok) {
                throw new Error("Upload failed");
            }

            // Create packaging option
            await createMutation.mutateAsync({
                en_name: data.en_name,
                ar_name: data.ar_name,
                en_description: data.en_description,
                ar_description: data.ar_description,
                photo_key: urlData.key,
            });
        } catch {
            notifications.show({
                title: t("form.errors.uploadFailed"),
                message: "",
                color: "red",
            });
        }
    };

    return (
        <Container size="md" py="xl">
            <Stack gap="lg">
                <Title order={2}>{t("createTitle")}</Title>

                <Paper shadow="sm" p="xl" radius="md" withBorder>
                    <PackagingOptionForm
                        onSubmit={handleSubmit}
                        onCancel={() =>
                            router.push("/dashboard/products/packaging-options")
                        }
                        isSubmitting={
                            createMutation.isPending ||
                            generateUrlMutation.isPending
                        }
                    />
                </Paper>
            </Stack>
        </Container>
    );
}
