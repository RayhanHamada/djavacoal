"use client";

import { useCallback, useEffect } from "react";

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
import { useDebounce, useDebounceFn } from "ahooks";
import dayjs from "dayjs";

import { NewsImageUpload } from "../atoms/news-image-upload";
import { NewsTagsSelect } from "../atoms/news-tags-select";
import { validateNewsForm, type NewsFormValues } from "../lib/form-schemas";
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
}: NewsFormProps) {
    // Local storage for persistence
    const [storedData, setStoredData, removeStoredData] = useLocalStorage({
        key: storageKey,
        defaultValue: initialData,
    });

    const { run: debouncedSetStoredData } = useDebounceFn(setStoredData, {
        wait: 500,
    });

    // Initialize form with Mantine's useForm
    const form = useForm({
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
            publishedAt: new Date(),
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
        (values: NewsFormValues, publish: boolean) => {
            console.log("should be handled");
            onSubmit(values, publish);
            // Clear local storage on successful submit
            removeStoredData();
        },
        [onSubmit, removeStoredData]
    );

    const handleSaveUnpublished = form.onSubmit((values) =>
        handleSubmit(values, false)
    );

    const handleSavePublished = form.onSubmit((values) =>
        handleSubmit(values, true)
    );

    return (
        <form onSubmit={handleSavePublished}>
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
                        imageKey={form.getValues().imageKey}
                        onImageUploaded={(key) =>
                            form.setFieldValue("imageKey", key)
                        }
                        onImageRemoved={() =>
                            form.setFieldValue("imageKey", undefined)
                        }
                        disabled={isSubmitting}
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
                        ></Textarea>
                        <Text size="xs" c="dimmed" ta="right">
                            {form.getValues().metadataDescription.length}/160
                        </Text>
                    </Stack>

                    {/* Tags */}
                    <NewsTagsSelect
                        label="Tags"
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

                    <DateTimePicker
                        label="Publication Date & Time"
                        valueFormat="dddd, DD MMMM YYYY HH:mm"
                        locale="id-ID"
                        description="Set the publication date and time."
                        key={form.key("publishedAt")}
                        {...form.getInputProps("publishedAt")}
                        onChange={(v) =>
                            form.setFieldValue("publishedAt", dayjs(v).toDate())
                        }
                        required
                        disabled={isSubmitting}
                        clearable={false}
                    />
                    {dayjs(form.getValues().publishedAt).isAfter(dayjs()) && (
                        <Text size="xs" c="blue">
                            <b>Future date is set.</b> News will be listed on
                            the selected date and time.
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
                            Submit & Publish
                        </Button>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Button
                            fullWidth
                            variant="light"
                            onClick={() => handleSaveUnpublished()}
                            disabled={isSubmitting}
                            size="md"
                        >
                            Save as Unpublished
                        </Button>
                        <Text>{isSubmitting}</Text>
                    </Grid.Col>
                </Grid>
            </Stack>
            {JSON.stringify(form.errors)}
        </form>
    );
}
