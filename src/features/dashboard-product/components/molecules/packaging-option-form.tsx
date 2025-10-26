"use client";

import { useState } from "react";

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
import { IconPhoto, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

type PackagingOptionFormData = {
    en_name: string;
    ar_name: string;
    en_description: string;
    ar_description: string;
    photo?: File;
    photo_key?: string;
};

type PackagingOptionFormProps = {
    initialData?: PackagingOptionFormData;
    onSubmit: (data: PackagingOptionFormData & { photo?: File }) => void;
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

    const [formData, setFormData] = useState<PackagingOptionFormData>({
        en_name: initialData?.en_name || "",
        ar_name: initialData?.ar_name || "",
        en_description: initialData?.en_description || "",
        ar_description: initialData?.ar_description || "",
        photo_key: initialData?.photo_key,
    });

    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        initialData?.photo_key ? `${assetUrl}${initialData.photo_key}` : null
    );

    const handlePhotoChange = (file: File | null) => {
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setPhotoFile(null);
        setPhotoPreview(null);
        setFormData({ ...formData, photo_key: undefined });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            photo: photoFile || undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="md">
                <TextInput
                    label={t("enName")}
                    placeholder={t("enNamePlaceholder")}
                    value={formData.en_name}
                    onChange={(e) =>
                        setFormData({ ...formData, en_name: e.target.value })
                    }
                    required
                />

                <TextInput
                    label={t("arName")}
                    placeholder={t("arNamePlaceholder")}
                    value={formData.ar_name}
                    onChange={(e) =>
                        setFormData({ ...formData, ar_name: e.target.value })
                    }
                    required
                />

                <Textarea
                    label={t("enDescription")}
                    placeholder={t("enDescriptionPlaceholder")}
                    value={formData.en_description}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            en_description: e.target.value,
                        })
                    }
                    required
                    minRows={3}
                />

                <Textarea
                    label={t("arDescription")}
                    placeholder={t("arDescriptionPlaceholder")}
                    value={formData.ar_description}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            ar_description: e.target.value,
                        })
                    }
                    required
                    minRows={3}
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
                            !formData.en_name ||
                            !formData.ar_name ||
                            !formData.en_description ||
                            !formData.ar_description ||
                            (!photoFile && !formData.photo_key)
                        }
                    >
                        {initialData ? t("submitEdit") : t("submitCreate")}
                    </Button>
                </Group>
            </Stack>
        </form>
    );
}
