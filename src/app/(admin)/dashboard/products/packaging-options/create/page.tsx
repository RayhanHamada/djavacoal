"use client";

import { useRouter } from "next/navigation";

import { Container, Paper, Stack, Title } from "@mantine/core";
import { useTranslations } from "next-intl";

import { PackagingOptionForm } from "@/features/dashboard-product/components";
import {
    useImageUpload,
    usePackagingOptionMutations,
} from "@/features/dashboard-product/hooks";

export default function CreatePackagingOptionPage() {
    const t = useTranslations("PackagingOptions");
    const router = useRouter();

    const { createMutation } = usePackagingOptionMutations();
    const { uploadImage, isUploading } = useImageUpload();

    const handleSubmit = async (data: {
        en_name: string;
        ar_name: string;
        en_description: string;
        ar_description: string;
        photo?: File;
    }) => {
        if (!data.photo) return;

        try {
            const photoKey = await uploadImage(data.photo);

            await createMutation.mutateAsync({
                en_name: data.en_name,
                ar_name: data.ar_name,
                en_description: data.en_description,
                ar_description: data.ar_description,
                photo_key: photoKey,
            });
        } catch (error) {
            // Error handling is done in the hooks
            console.error("Failed to create packaging option:", error);
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
                        isSubmitting={createMutation.isPending || isUploading}
                    />
                </Paper>
            </Stack>
        </Container>
    );
}
