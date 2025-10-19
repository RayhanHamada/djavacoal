"use client";

import { useEffect } from "react";

import {
    Box,
    Button,
    Divider,
    Grid,
    Group,
    Radio,
    Stack,
    Text,
    TextInput,
    Textarea,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";
import { useDebounce } from "ahooks";
import { zodResolver } from "mantine-form-zod-resolver";

import { NewsImageUpload } from "../atoms/news-image-upload";
import { NewsTagsSelect } from "../atoms/news-tags-select";
import {
    getInitialNewsFormValues,
    newsFormSchema,
    NewsFormValues,
} from "../lib/form-schemas";
import { BilingualContentEditor } from "../molecules/bilingual-content-editor";
import { BilingualTextInput } from "../molecules/bilingual-text-input";

interface NewsFormProps {
    /** Initial form data (for edit mode) */
    initialData?: Partial<NewsFormValues>;
    /** Whether the form is in edit mode */
    isEditMode?: boolean;
    /** Whether the form is submitting */
    isSubmitting?: boolean;
    /** Callback when form is submitted (publish) */
    onSubmit: (data: NewsFormValues, publish: boolean) => void;
    /** Local storage key for persistence */
    storageKey: string;
}

/**
 * Extract first paragraph text from HTML content (plain text only, max 160 chars)
 */
function extractFirstParagraph(html: string): string {
    // Create a temporary div to parse HTML
    const div = document.createElement("div");
    div.innerHTML = html;

    // Find first paragraph
    const firstP = div.querySelector("p");
    const text = firstP?.textContent || "";

    // Return max 160 characters
    return text.slice(0, 160);
}

/**
 * Generate slug from title
 */
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

/**
 * NewsForm component for creating and editing news articles
 * Supports local storage persistence and bilingual content
 */
export function NewsForm({
    storageKey,
    initialData,
    isEditMode = false,
    isSubmitting = false,
    onSubmit,
    // storageKey,
}: NewsFormProps) {
    // Local storage for persistence
    const [storedData, setStoredData, removeStoredData] = useLocalStorage<
        Partial<NewsFormValues>
    >({
        key: storageKey,
        defaultValue: initialData || {},
    });

    // Initialize form with Mantine's useForm
    const form = useForm<NewsFormValues>({
        mode: "controlled",
        initialValues: getInitialNewsFormValues({
            ...storedData,
            ...initialData,
        }),
        validate: zodResolver(newsFormSchema),
    });

    // Get current form values
    const values = form.values;
    const debouncedValue = useDebounce(values, { wait: 500 });

    // Update local storage when form values change
    useEffect(() => {
        setStoredData(values);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);

    // Auto-generate slug from English title
    useEffect(() => {
        if (isEditMode) return;

        const newSlug = generateSlug(debouncedValue.enTitle);
        form.setFieldValue("slug", newSlug);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue.enTitle, isEditMode]);

    // Auto-copy English title to metadata title
    useEffect(() => {
        form.setFieldValue("metadataTitle", debouncedValue.enTitle);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue.enTitle]);

    // Auto-generate metadata description from first paragraph
    useEffect(() => {
        if (
            debouncedValue.useAutoMetadataDescription &&
            debouncedValue.enContent
        ) {
            const description = extractFirstParagraph(debouncedValue.enContent);
            form.setFieldValue("metadataDescription", description);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue.enContent, debouncedValue.useAutoMetadataDescription]);

    const handleSubmit = (values: NewsFormValues, publish: boolean) => {
        onSubmit(values, publish);
        // Clear local storage on successful submit
        removeStoredData();
    };

    return (
        <form onSubmit={form.onSubmit((values) => handleSubmit(values, true))}>
            <Stack gap="xl">
                {/* Image Upload */}
                <Box>
                    <Text size="sm" fw={500} mb="xs">
                        News Image (4:3 ratio)
                    </Text>
                    <NewsImageUpload
                        imageKey={values.imageKey}
                        onImageUploaded={(key) =>
                            form.setFieldValue("imageKey", key)
                        }
                        onImageRemoved={() =>
                            form.setFieldValue("imageKey", undefined)
                        }
                        disabled={isSubmitting}
                    />
                </Box>

                <Divider />

                {/* Titles */}
                <BilingualTextInput
                    label="News Title"
                    enValue={values.enTitle}
                    arValue={values.arTitle}
                    onEnChange={(value) => form.setFieldValue("enTitle", value)}
                    onArChange={(value) => form.setFieldValue("arTitle", value)}
                    required
                    disabled={isSubmitting}
                    placeholder="Enter news title"
                    enError={form.errors.enTitle as string}
                    arError={form.errors.arTitle as string}
                />

                {/* Slug (editable in create, readonly in edit) */}
                <TextInput
                    label="URL Slug"
                    description="Auto-generated from English title, URL-safe"
                    key={form.key("slug")}
                    {...form.getInputProps("slug")}
                    required
                    disabled
                    readOnly
                />

                <Divider />

                {/* Content */}
                <BilingualContentEditor
                    label="News Content"
                    enContent={values.enContent}
                    arContent={values.arContent}
                    onEnChange={(content) =>
                        form.setFieldValue("enContent", content)
                    }
                    onArChange={(content) =>
                        form.setFieldValue("arContent", content)
                    }
                    disabled={isSubmitting}
                />
                {form.errors.enContent && (
                    <Text size="sm" c="red">
                        {form.errors.enContent}
                    </Text>
                )}
                {form.errors.arContent && (
                    <Text size="sm" c="red">
                        {form.errors.arContent}
                    </Text>
                )}

                <Divider />

                {/* Metadata Section */}
                <Stack gap="md">
                    <Text size="lg" fw={600}>
                        SEO Metadata
                    </Text>

                    {/* Metadata Title (readonly, copy of English title) */}
                    <TextInput
                        label="Metadata Title"
                        value={values.metadataTitle}
                        readOnly
                        description="Automatically copied from English title"
                        disabled={isSubmitting}
                    />

                    {/* Metadata Description */}
                    <Stack gap="xs">
                        <Radio.Group
                            value={
                                values.useAutoMetadataDescription
                                    ? "auto"
                                    : "manual"
                            }
                            onChange={(value) =>
                                form.setFieldValue(
                                    "useAutoMetadataDescription",
                                    value === "auto"
                                )
                            }
                        >
                            <Group>
                                <Radio
                                    value="auto"
                                    label="Use content of the first paragraph"
                                    disabled={isSubmitting}
                                />
                                <Radio
                                    value="manual"
                                    label="Add manually"
                                    disabled={isSubmitting}
                                />
                            </Group>
                        </Radio.Group>

                        <Textarea
                            label="Metadata Description"
                            description="Maximum 160 characters"
                            key={form.key("metadataDescription")}
                            {...form.getInputProps("metadataDescription")}
                            maxLength={160}
                            rows={3}
                            required
                            disabled={
                                isSubmitting ||
                                values.useAutoMetadataDescription
                            }
                            readOnly={values.useAutoMetadataDescription}
                        />
                        <Text size="xs" c="dimmed" ta="right">
                            {values.metadataDescription.length}/160
                        </Text>
                    </Stack>

                    {/* Tags */}
                    <NewsTagsSelect
                        label="Tags"
                        value={values.metadataTags}
                        onChange={(tags) =>
                            form.setFieldValue("metadataTags", tags)
                        }
                        disabled={isSubmitting}
                        error={form.errors.metadataTags as string}
                    />
                </Stack>

                <Divider />

                {/* Publication Settings */}
                <Stack gap="md">
                    <Text size="lg" fw={600}>
                        Publication Settings
                    </Text>

                    <DateTimePicker
                        label="Publication Date & Time"
                        description="Set the publication date and time"
                        key={form.key("publishedAt")}
                        {...form.getInputProps("publishedAt")}
                        required
                        disabled={isSubmitting}
                        clearable={false}
                    />
                </Stack>

                <Divider />

                {/* Submit Buttons */}
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Button
                            fullWidth
                            type="submit"
                            loading={isSubmitting}
                            size="lg"
                        >
                            Submit & Publish
                        </Button>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Button
                            fullWidth
                            variant="light"
                            onClick={() =>
                                form.onSubmit((values) =>
                                    handleSubmit(values, false)
                                )()
                            }
                            disabled={isSubmitting}
                            size="lg"
                        >
                            Save as Unpublished
                        </Button>
                    </Grid.Col>
                </Grid>
            </Stack>
        </form>
    );
}
