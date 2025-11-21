"use client";

import { useCallback, useEffect, useRef } from "react";

import {
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
import { notifications } from "@mantine/notifications";
import { useDebounce, useDebounceFn } from "ahooks";
import dayjs from "dayjs";

import { NewsImageUpload, type NewsImageUploadRef } from "../atoms";
import { NewsTagsSelect } from "../atoms/news-tags-select";
import { validateNewsForm, type NewsFormValues } from "../lib/form-schemas";
import { CreationMode } from "../lib/form-schemas";
import { BilingualContentEditor } from "../molecules/bilingual-content-editor";
import { BilingualTextInput } from "../molecules/bilingual-text-input";

interface NewsFormProps {
    /** Initial form data (for edit mode) */
    initialData?: Partial<NewsFormValues>;
    /** Whether the form is in edit mode */
    isEditMode?: boolean;
    /** Whether the form is submitting */
    isSubmitting?: boolean;
    /** Callback when form is submitted */
    onSubmit: (data: NewsFormValues) => void;
    /** Local storage key for persistence */
    storageKey: string;
    /** News article ID (required for edit mode) */
    newsId?: number;
}

/**
 * Generate slug from title
 */
function generateSlug(title: string) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+|-+/g, "-")
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
    newsId,
}: NewsFormProps) {
    // Ref for image upload component
    const imageUploadRef = useRef<NewsImageUploadRef>(null);

    // Local storage for persistence
    const [storedData, setStoredData, removeStoredData] = useLocalStorage({
        key: storageKey,
        defaultValue: initialData,
    });

    const { run: debouncedSetStoredData } = useDebounceFn(setStoredData, {
        wait: 500,
    });

    // Initialize form with Mantine's useForm
    const form = useForm<NewsFormValues>({
        mode: "uncontrolled",
        initialValues: {
            slug: "",
            imageKey: undefined,
            enTitle: "",
            arTitle: "",
            enContent: "",
            arContent: "",
            metadataTitle: "",
            metadataDescription: "",
            metadataTags: [],
            mode: "fresh",
            status: "draft",
            publishedAt: undefined,
            useAutoMetadataDescription: true,
            ...storedData,
            ...initialData,
        },
        validate: validateNewsForm,
        onValuesChange(values) {
            debouncedSetStoredData(values);
        },
    });

    // Get current form values with debounce for auto-generation
    const values = form.getValues();
    const debouncedEnTitle = useDebounce(values.enTitle, { wait: 500 });

    // Auto-generate slug from English title
    useEffect(() => {
        if (isEditMode) return;

        const newSlug = generateSlug(debouncedEnTitle);
        form.setFieldValue("slug", newSlug);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedEnTitle, isEditMode]);

    // Auto-copy English title to metadata title
    useEffect(() => {
        form.setFieldValue("metadataTitle", debouncedEnTitle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedEnTitle]);

    const handleEnFirstParagraphChange = useCallback(
        (firstParagraph: string) => {
            if (!form.getValues().useAutoMetadataDescription) return;

            const description = firstParagraph.slice(0, 160);
            form.setFieldValue("metadataDescription", description);
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const handleSubmit = useCallback(
        async (
            values: NewsFormValues,
            status: "draft" | "published" | "preserve"
        ) => {
            try {
                // Upload image if there's a pending file
                const imageKey =
                    await imageUploadRef.current?.uploadImageFile();

                const submittedValues = {
                    ...values,
                    // Use the uploaded image key if available, otherwise keep existing
                    imageKey: imageKey || values.imageKey,
                    // If status is 'preserve', keep the existing status from values
                    status: status === "preserve" ? values.status : status,
                    // For published status, ensure publishedAt is set
                    publishedAt:
                        status === "published"
                            ? values.publishedAt || new Date()
                            : values.publishedAt,
                };
                onSubmit(submittedValues);
                // Clear local storage on successful submit
                removeStoredData();
            } catch (error) {
                console.error("Failed to submit form:", error);
                notifications.show({
                    title: "Submission Failed",
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to submit. Please try again.",
                    color: "red",
                });
            }
        },
        [onSubmit, removeStoredData]
    );

    const handleSaveDraft = form.onSubmit(async (values) => {
        await handleSubmit(values, "draft");
    });

    const handleSave = form.onSubmit(async (values) => {
        await handleSubmit(values, "preserve");
    });

    const handlePublish = form.onSubmit(async (values) => {
        await handleSubmit(values, "published");
    });

    return (
        <form onSubmit={handlePublish}>
            <Stack gap="xl">
                {/* Image Upload */}
                <Stack gap="xs">
                    <Text size="sm" fw={500}>
                        News Image
                    </Text>
                    <Text size="xs" c="dimmed">
                        Upload a cover image for your news article. Recommended
                        size: 1024×768 pixels (4:3 ratio)
                    </Text>
                    <NewsImageUpload
                        ref={imageUploadRef}
                        imageKey={form.getValues().imageKey}
                        onImageUploaded={(key: string) =>
                            form.setFieldValue("imageKey", key)
                        }
                        onImageRemoved={() =>
                            form.setFieldValue("imageKey", undefined)
                        }
                        disabled={isSubmitting}
                        newsId={newsId}
                        isEditMode={isEditMode}
                    />
                </Stack>

                <Divider />

                {/* Titles */}
                <BilingualTextInput
                    label="News Title"
                    enValue={form.getValues().enTitle}
                    arValue={form.getValues().arTitle}
                    onEnChange={(value) => form.setFieldValue("enTitle", value)}
                    onArChange={(value) => form.setFieldValue("arTitle", value)}
                    required
                    disabled={isSubmitting}
                    placeholder="Enter news title"
                    enError={form.errors.enTitle as string}
                    arError={form.errors.arTitle as string}
                />

                {/* Slug (editable in create, readonly in edit) */}
                <Stack>
                    <TextInput
                        label="URL Slug"
                        description="Permanent and auto-generated from English title, URL-safe"
                        key={form.key("slug")}
                        {...form.getInputProps("slug")}
                        required
                        readOnly
                    />
                    <Text size="xs" c="dimmed">
                        Will be accessible at:{" "}
                        <Text component="span" fw={500}>
                            {process.env.NEXT_PUBLIC_BASE_URL}news/
                            {form.getValues().slug}
                        </Text>
                    </Text>
                </Stack>

                <Divider />

                {/* Content */}
                <BilingualContentEditor
                    label="News Content"
                    enContent={form.getValues().enContent}
                    onEnFirstParagraphChange={handleEnFirstParagraphChange}
                    arContent={form.getValues().arContent}
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
                        value={form.getValues().metadataTitle}
                        readOnly
                        description="Automatically copied from English title"
                        disabled={isSubmitting}
                    />

                    {/* Metadata Description */}
                    <Stack gap="xs">
                        <Radio.Group
                            value={
                                form.getValues().useAutoMetadataDescription
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
                                form.getValues().useAutoMetadataDescription
                            }
                            readOnly={
                                form.getValues().useAutoMetadataDescription
                            }
                        />
                        <Text size="xs" c="dimmed" ta="right">
                            {form.getValues().metadataDescription.length}/160
                        </Text>
                    </Stack>

                    {/* Keywords/Tags */}
                    <NewsTagsSelect
                        label="Keywords/Tags"
                        description="Add relevant keywords to categorize your news article"
                        value={form.getValues().metadataTags}
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

                    {!isEditMode && (
                        <Radio.Group
                            value={form.getValues().mode}
                            onChange={(value) =>
                                form.setFieldValue(
                                    "mode",
                                    value as CreationMode
                                )
                            }
                            label="Creation Mode"
                            description="Choose how to handle publication date"
                        >
                            <Stack mt="xs" gap="xs">
                                <Radio
                                    value="fresh"
                                    label="Fresh Create - Draft and publish workflow with optional scheduling"
                                    disabled={isSubmitting}
                                />
                                <Radio
                                    value="migration"
                                    label="Migration - Set custom publication date for migrating existing articles"
                                    disabled={isSubmitting}
                                />
                            </Stack>
                        </Radio.Group>
                    )}

                    {(form.getValues().mode === "migration" || isEditMode) && (
                        <DateTimePicker
                            label="Publication Date & Time"
                            valueFormat="dddd, DD MMMM YYYY HH:mm"
                            locale="id-ID"
                            description={
                                form.getValues().mode === "migration"
                                    ? "Set the original publication date for this migrated article"
                                    : "Set or update the publication date"
                            }
                            excludeDate={
                                form.getValues().mode === "migration"
                                    ? (d) => dayjs(d).isAfter(dayjs())
                                    : undefined
                            }
                            value={form.getValues().publishedAt}
                            onChange={(v) =>
                                form.setFieldValue(
                                    "publishedAt",
                                    v ? dayjs(v).toDate() : undefined
                                )
                            }
                            disabled={isSubmitting}
                            clearable
                            required={form.getValues().mode === "migration"}
                        />
                    )}

                    {form.getValues().mode === "fresh" && !isEditMode && (
                        <DateTimePicker
                            label="Scheduled Publication Date (Optional)"
                            valueFormat="dddd, DD MMMM YYYY HH:mm"
                            locale="id-ID"
                            description="Leave empty to publish immediately, or set a future date to schedule"
                            value={form.getValues().publishedAt}
                            onChange={(v) =>
                                form.setFieldValue(
                                    "publishedAt",
                                    v ? dayjs(v).toDate() : undefined
                                )
                            }
                            disabled={isSubmitting}
                            clearable
                            minDate={new Date()}
                        />
                    )}

                    {form.getValues().publishedAt &&
                        dayjs(form.getValues().publishedAt).isAfter(
                            dayjs()
                        ) && (
                            <Text size="xs" c="blue">
                                <b>Future date is set.</b> Article will be
                                visible on the selected date and time.
                            </Text>
                        )}
                </Stack>

                <Divider />

                {/* Submit Buttons */}
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Button
                            fullWidth
                            type="submit"
                            loading={isSubmitting}
                            size="md"
                        >
                            {isEditMode
                                ? "Save & Publish"
                                : form.getValues().mode === "migration"
                                  ? "Save & Publish"
                                  : form.getValues().publishedAt &&
                                      dayjs(
                                          form.getValues().publishedAt
                                      ).isAfter(dayjs())
                                    ? "Schedule for Publication"
                                    : "Publish Now"}
                        </Button>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Button
                            fullWidth
                            variant="light"
                            onClick={() =>
                                isEditMode ? handleSave() : handleSaveDraft()
                            }
                            disabled={isSubmitting}
                            size="md"
                        >
                            {isEditMode ? "Save" : "Save as Draft"}
                        </Button>
                    </Grid.Col>
                </Grid>
            </Stack>
        </form>
    );
}
