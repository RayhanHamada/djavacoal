"use client";

import type { PackagingOptionFormValues } from "../../utils/form-schemas";

import {
    Box,
    Button,
    FileButton,
    Group,
    Image,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { IconPhoto, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

import { usePackagingOptionForm } from "../../hooks";
import { RichTextEditor } from "../atoms";

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

    const {
        form,
        photoPreview,
        handlePhotoChange,
        handleRemovePhoto,
        getSubmitData,
    } = usePackagingOptionForm({ initialData, assetUrl });

    const handleSubmit = form.onSubmit((values) => {
        onSubmit(getSubmitData(values));
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

                <Box>
                    <Text size="sm" fw={500} mb="xs">
                        {t("enDescription")}{" "}
                        <span style={{ color: "red" }}>*</span>
                    </Text>
                    <RichTextEditor
                        value={form.getValues().en_description}
                        onChange={(value) =>
                            form.setFieldValue("en_description", value)
                        }
                        placeholder={t("enDescriptionPlaceholder")}
                        error={form.errors.en_description}
                    />
                </Box>

                <Box>
                    <Text size="sm" fw={500} mb="xs">
                        {t("arDescription")}{" "}
                        <span style={{ color: "red" }}>*</span>
                    </Text>
                    <RichTextEditor
                        value={form.getValues().ar_description}
                        onChange={(value) =>
                            form.setFieldValue("ar_description", value)
                        }
                        placeholder={t("arDescriptionPlaceholder")}
                        error={form.errors.ar_description}
                    />
                </Box>

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
                            (!form.getValues().photo_key && !photoPreview)
                        }
                    >
                        {initialData ? t("submitEdit") : t("submitCreate")}
                    </Button>
                </Group>
            </Stack>
        </form>
    );
}
