"use client";

import { useEffect, useState } from "react";

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
import { useLocalStorage } from "@mantine/hooks";

import { NewsImageUpload } from "../atoms/news-image-upload";
import { NewsTagsSelect } from "../atoms/news-tags-select";
import { BilingualContentEditor } from "../molecules/bilingual-content-editor";
import { BilingualTextInput } from "../molecules/bilingual-text-input";

interface NewsFormData {
    slug: string;
    imageKey?: string;
    enTitle: string;
    arTitle: string;
    enContent: string;
    arContent: string;
    metadataTitle: string;
    metadataDescription: string;
    metadataTags: string[];
    publishedAt: Date;
    useAutoMetadataDescription: boolean;
}

interface NewsFormProps {
    /** Initial form data (for edit mode) */
    initialData?: Partial<NewsFormData>;
    /** Whether the form is in edit mode */
    isEditMode?: boolean;
    /** Whether the form is submitting */
    isSubmitting?: boolean;
    /** Callback when form is submitted (publish) */
    onSubmit: (data: NewsFormData, publish: boolean) => void;
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
    initialData,
    isEditMode = false,
    isSubmitting = false,
    onSubmit,
    storageKey,
}: NewsFormProps) {
    // Local storage for persistence
    const [storedData, setStoredData, removeStoredData] = useLocalStorage<
        Partial<NewsFormData>
    >({
        key: storageKey,
        defaultValue: initialData || {},
    });

    // Form state
    const [formData, setFormData] = useState<NewsFormData>({
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
    });

    // Update local storage when form data changes
    useEffect(() => {
        setStoredData(formData);
    }, [formData, setStoredData]);

    // Auto-generate slug from English title
    useEffect(() => {
        if (!isEditMode && formData.enTitle) {
            const newSlug = generateSlug(formData.enTitle);
            setFormData((prev) => ({ ...prev, slug: newSlug }));
        }
    }, [formData.enTitle, isEditMode]);

    // Auto-copy English title to metadata title
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            metadataTitle: formData.enTitle,
        }));
    }, [formData.enTitle]);

    // Auto-generate metadata description from first paragraph
    useEffect(() => {
        if (formData.useAutoMetadataDescription && formData.enContent) {
            const description = extractFirstParagraph(formData.enContent);
            setFormData((prev) => ({
                ...prev,
                metadataDescription: description,
            }));
        }
    }, [formData.enContent, formData.useAutoMetadataDescription]);

    const updateField = <K extends keyof NewsFormData>(
        field: K,
        value: NewsFormData[K]
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (publish: boolean) => {
        onSubmit(formData, publish);
        // Clear local storage on successful submit
        removeStoredData();
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(true);
            }}
        >
            <Stack gap="xl">
                {/* Image Upload */}
                <Box>
                    <Text size="sm" fw={500} mb="xs">
                        News Image (4:3 ratio)
                    </Text>
                    <NewsImageUpload
                        imageKey={formData.imageKey}
                        onImageUploaded={(key) => updateField("imageKey", key)}
                        onImageRemoved={() =>
                            updateField("imageKey", undefined)
                        }
                        disabled={isSubmitting}
                    />
                </Box>

                <Divider />

                {/* Titles */}
                <BilingualTextInput
                    label="News Title"
                    enValue={formData.enTitle}
                    arValue={formData.arTitle}
                    onEnChange={(value) => updateField("enTitle", value)}
                    onArChange={(value) => updateField("arTitle", value)}
                    required
                    disabled={isSubmitting}
                    placeholder="Enter news title"
                />

                {/* Slug (editable in create, readonly in edit) */}
                <TextInput
                    label="URL Slug"
                    description="Auto-generated from English title, URL-safe"
                    value={formData.slug}
                    onChange={(e) => updateField("slug", e.currentTarget.value)}
                    required
                    disabled={isSubmitting}
                    readOnly={isEditMode}
                />

                <Divider />

                {/* Content */}
                <BilingualContentEditor
                    label="News Content"
                    enContent={formData.enContent}
                    arContent={formData.arContent}
                    onEnChange={(content) => updateField("enContent", content)}
                    onArChange={(content) => updateField("arContent", content)}
                    disabled={isSubmitting}
                />

                <Divider />

                {/* Metadata Section */}
                <Stack gap="md">
                    <Text size="lg" fw={600}>
                        SEO Metadata
                    </Text>

                    {/* Metadata Title (readonly, copy of English title) */}
                    <TextInput
                        label="Metadata Title"
                        value={formData.metadataTitle}
                        readOnly
                        description="Automatically copied from English title"
                        disabled={isSubmitting}
                    />

                    {/* Metadata Description */}
                    <Stack gap="xs">
                        <Radio.Group
                            value={
                                formData.useAutoMetadataDescription
                                    ? "auto"
                                    : "manual"
                            }
                            onChange={(value) =>
                                updateField(
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
                            value={formData.metadataDescription}
                            onChange={(e) =>
                                updateField(
                                    "metadataDescription",
                                    e.currentTarget.value
                                )
                            }
                            maxLength={160}
                            rows={3}
                            required
                            disabled={
                                isSubmitting ||
                                formData.useAutoMetadataDescription
                            }
                            readOnly={formData.useAutoMetadataDescription}
                        />
                        <Text size="xs" c="dimmed" ta="right">
                            {formData.metadataDescription.length}/160
                        </Text>
                    </Stack>

                    {/* Tags */}
                    <NewsTagsSelect
                        label="Tags"
                        value={formData.metadataTags}
                        onChange={(tags) => updateField("metadataTags", tags)}
                        disabled={isSubmitting}
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
                        value={formData.publishedAt}
                        onChange={(date) => {
                            if (date) {
                                updateField("publishedAt", new Date(date));
                            }
                        }}
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
                            onClick={() => handleSubmit(false)}
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
