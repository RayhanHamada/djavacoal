"use client";

import type { PackagingOptionFormValues } from "../../lib/form-schemas";

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

import { usePackagingOptionForm } from "../../hooks";
import { RichTextEditor } from "../atoms";

type PackagingOptionFormProps = {
    initialData?: PackagingOptionFormValues;
    onSubmit(
        data: PackagingOptionFormValues & {
            photo?: File;
        }
    ): void;
    onCancel(): void;
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
                    label="English Name"
                    placeholder="Enter packaging option name in English"
                    required
                    key={form.key("en_name")}
                    {...form.getInputProps("en_name")}
                />

                <TextInput
                    label="Arabic Name"
                    placeholder="Enter packaging option name in Arabic"
                    required
                    key={form.key("ar_name")}
                    {...form.getInputProps("ar_name")}
                />

                <Box>
                    <Text size="sm" fw={500} mb="xs">
                        English Description{" "}
                        <span style={{ color: "red" }}>*</span>
                    </Text>
                    <RichTextEditor
                        value={form.getValues().en_description}
                        onChange={(value) =>
                            form.setFieldValue("en_description", value)
                        }
                        placeholder="Enter description in English"
                        error={form.errors.en_description}
                    />
                </Box>

                <Box>
                    <Text size="sm" fw={500} mb="xs">
                        Arabic Description{" "}
                        <span style={{ color: "red" }}>*</span>
                    </Text>
                    <RichTextEditor
                        value={form.getValues().ar_description}
                        onChange={(value) =>
                            form.setFieldValue("ar_description", value)
                        }
                        placeholder="Enter description in Arabic"
                        error={form.errors.ar_description}
                    />
                </Box>

                <Box>
                    <Text size="sm" fw={500} mb="xs">
                        Image
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
                                Remove Image
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
                                    Upload Image
                                </Button>
                            )}
                        </FileButton>
                    )}
                </Box>

                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={isSubmitting}
                        disabled={
                            !form.isValid() ||
                            (!form.getValues().photo_key && !photoPreview)
                        }
                    >
                        {initialData ? "Update" : "Create"}
                    </Button>
                </Group>
            </Stack>
        </form>
    );
}
