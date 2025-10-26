"use client";

import { useEffect, useState } from "react";

import {
    Box,
    Button,
    FileButton,
    Group,
    Image,
    Stack,
    Text,
    Textarea,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPhoto, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

import {
    validatePackagingOptionFormSchema,
    type PackagingOptionFormValues,
} from "../../utils/form-schemas";

type PackagingOptionFormProps = {
    initialData?: PackagingOptionFormValues;
    onSubmit: (data: PackagingOptionFormValues & { photo?: File }) => void;
    onCancel: () => void;
    isSubmitting: boolean;
    assetUrl?: string;
};

export function PackagingOptionForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
    assetUrl = "",
}: PackagingOptionFormProps) {
    const t = useTranslations("PackagingOptions.form");

    const form = useForm<PackagingOptionFormValues>({
        mode: "uncontrolled",
        initialValues: {
            en_name: initialData?.en_name || "",
            ar_name: initialData?.ar_name || "",
            en_description: initialData?.en_description || "",
            ar_description: initialData?.ar_description || "",
            photo_key: initialData?.photo_key,
        },
        validate: validatePackagingOptionFormSchema,
    });

    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        initialData?.photo_key ? `${assetUrl}${initialData.photo_key}` : null
    );

    useEffect(() => {
        if (photoFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(photoFile);
        }
    }, [photoFile]);

    const handlePhotoChange = (file: File | null) => {
        if (file) {
            setPhotoFile(file);
        }
    };

    const handleRemovePhoto = () => {
        setPhotoFile(null);
        setPhotoPreview(null);
        form.setFieldValue("photo_key", undefined);
    };

    const handleSubmit = form.onSubmit((values) => {
        onSubmit({
            ...values,
            photo: photoFile || undefined,
        });
    });

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="md">
                <TextInput
                    label={t("enName")}
                    placeholder={t("enNamePlaceholder")}
                    required
                    key={form.key("en_name")}
                    {...form.getInputProps("en_name")}
                />

                <TextInput
                    label={t("arName")}
                    placeholder={t("arNamePlaceholder")}
                    required
                    key={form.key("ar_name")}
                    {...form.getInputProps("ar_name")}
                />

                <Textarea
                    label={t("enDescription")}
                    placeholder={t("enDescriptionPlaceholder")}
                    required
                    minRows={3}
                    key={form.key("en_description")}
                    {...form.getInputProps("en_description")}
                />

                <Textarea
                    label={t("arDescription")}
                    placeholder={t("arDescriptionPlaceholder")}
                    required
                    minRows={3}
                    key={form.key("ar_description")}
                    {...form.getInputProps("ar_description")}
                />

                <Box>
                    <Text size="sm" fw={500} mb="xs">
                        {t("image")}
                    </Text>
                    {photoPreview ? (
                        <Stack gap="sm">
                            <Image
                                src={photoPreview}
                                alt="Preview"
                                radius="md"
                                h={200}
                                fit="contain"
                            />
                            <Button
                                variant="light"
                                color="red"
                                leftSection={<IconTrash size={16} />}
                                onClick={handleRemovePhoto}
                            >
                                {t("removeImage")}
                            </Button>
                        </Stack>
                    ) : (
                        <FileButton
                            onChange={handlePhotoChange}
                            accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                        >
                            {(props) => (
                                <Button
                                    {...props}
                                    variant="light"
                                    leftSection={<IconPhoto size={16} />}
                                    fullWidth
                                >
                                    {t("imageHint")}
                                </Button>
                            )}
                        </FileButton>
                    )}
                </Box>

                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={onCancel}>
                        {t("cancel")}
                    </Button>
                    <Button
                        type="submit"
                        loading={isSubmitting}
                        disabled={
                            !form.isValid() ||
                            (!photoFile && !form.getValues().photo_key)
                        }
                    >
                        {initialData ? t("submitEdit") : t("submitCreate")}
                    </Button>
                </Group>
            </Stack>
        </form>
    );
}
