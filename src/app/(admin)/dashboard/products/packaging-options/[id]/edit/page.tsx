"use client";

import { use } from "react";

import { useRouter } from "next/navigation";

import { Container, Paper, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { PackagingOptionForm } from "@/features/dashboard-product/components";
import { rpc } from "@/lib/rpc";

export default function EditPackagingOptionPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const t = useTranslations("PackagingOptions");
    const router = useRouter();

    const { data, isLoading } = useQuery(
        rpc.dashboardProduct.getPackagingOptionById.queryOptions({
            input: { id: parseInt(id) },
        })
    );

    const updateMutation = useMutation({
        ...rpc.dashboardProduct.updatePackagingOption.mutationOptions(),
        onSuccess: () => {
            notifications.show({
                title: t("form.success.updated"),
                message: "",
                color: "green",
            });
            router.push("/dashboard/products/packaging-options");
        },
        onError: () => {
            notifications.show({
                title: t("form.errors.updateFailed"),
                message: "",
                color: "red",
            });
        },
    });

    const generateUrlMutation = useMutation(
        rpc.dashboardProduct.generateImageUploadUrl.mutationOptions()
    );

    const handleSubmit = async (formData: {
        en_name: string;
        ar_name: string;
        en_description: string;
        ar_description: string;
        photo?: File;
        photo_key?: string;
    }) => {
        try {
            let photoKey = formData.photo_key || data?.photo_key || "";

            // If new photo is provided, upload it
            if (formData.photo) {
                const urlData = await generateUrlMutation.mutateAsync({
                    mimeType: formData.photo.type,
                    size: formData.photo.size,
                });

                const uploadResponse = await fetch(urlData.uploadUrl, {
                    method: "PUT",
                    body: formData.photo,
                    headers: {
                        "Content-Type": formData.photo.type,
                    },
                });

                if (!uploadResponse.ok) {
                    throw new Error("Upload failed");
                }

                photoKey = urlData.key;
            }

            // Update packaging option
            await updateMutation.mutateAsync({
                id: parseInt(id),
                en_name: formData.en_name,
                ar_name: formData.ar_name,
                en_description: formData.en_description,
                ar_description: formData.ar_description,
                photo_key: photoKey,
            });
        } catch {
            notifications.show({
                title: t("form.errors.uploadFailed"),
                message: "",
                color: "red",
            });
        }
    };

    if (isLoading) {
        return (
            <Container size="md" py="xl">
                <Text ta="center">Loading...</Text>
            </Container>
        );
    }

    if (!data) {
        return (
            <Container size="md" py="xl">
                <Text ta="center" c="red">
                    Packaging option not found
                </Text>
            </Container>
        );
    }

    return (
        <Container size="md" py="xl">
            <Stack gap="lg">
                <Title order={2}>{t("editTitle")}</Title>

                <Paper shadow="sm" p="xl" radius="md" withBorder>
                    <PackagingOptionForm
                        initialData={{
                            en_name: data.en_name,
                            ar_name: data.ar_name,
                            en_description: data.en_description,
                            ar_description: data.ar_description,
                            photo_key: data.photo_key,
                        }}
                        onSubmit={handleSubmit}
                        onCancel={() =>
                            router.push("/dashboard/products/packaging-options")
                        }
                        isSubmitting={
                            updateMutation.isPending ||
                            generateUrlMutation.isPending
                        }
                        assetUrl={process.env.NEXT_PUBLIC_ASSET_URL}
                    />
                </Paper>
            </Stack>
        </Container>
    );
}
