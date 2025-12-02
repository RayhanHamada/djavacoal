"use client";

import { Stack, TagsInput, Textarea } from "@mantine/core";

import {
    METADATA_DESCRIPTION_MAX_LENGTH,
    METADATA_KEYWORD_MAX_LENGTH,
    METADATA_KEYWORDS_MAX_COUNT,
} from "../../lib/constants";

interface SeoMetadataSectionProps {
    /** Current metadata description value */
    description: string;
    /** Current metadata keywords array */
    keywords: string[];
    /** Callback when description changes */
    onDescriptionChange: (value: string) => void;
    /** Callback when keywords change */
    onKeywordsChange: (value: string[]) => void;
    /** Whether the form is disabled */
    disabled?: boolean;
    /** Description field error message */
    descriptionError?: string;
    /** Keywords field error message */
    keywordsError?: string;
}

/**
 * SEO Metadata Section Component
 *
 * Provides input fields for SEO metadata:
 * - Description: free text up to 160 characters
 * - Keywords: tag-based input, max 20 items, each max 30 characters
 *
 * Used in product create/edit forms for search engine optimization.
 */
export function SeoMetadataSection({
    description,
    keywords,
    onDescriptionChange,
    onKeywordsChange,
    disabled = false,
    descriptionError,
    keywordsError,
}: SeoMetadataSectionProps) {
    const descriptionCharCount = description.length;
    const isDescriptionOverLimit =
        descriptionCharCount > METADATA_DESCRIPTION_MAX_LENGTH;

    return (
        <Stack gap="md">
            {/* Description Field */}
            <Textarea
                label="Meta Description"
                description={`A brief description for search engines (${descriptionCharCount}/${METADATA_DESCRIPTION_MAX_LENGTH} characters)`}
                placeholder="Enter a concise description for search engine results..."
                value={description}
                onChange={(event) =>
                    onDescriptionChange(event.currentTarget.value)
                }
                maxLength={METADATA_DESCRIPTION_MAX_LENGTH}
                disabled={disabled}
                error={descriptionError}
                autosize
                minRows={2}
                maxRows={4}
                styles={{
                    description: {
                        color: isDescriptionOverLimit
                            ? "var(--mantine-color-red-6)"
                            : undefined,
                    },
                }}
            />

            {/* Keywords Field */}
            <TagsInput
                label="Meta Keywords"
                description={`Add keywords for SEO (${keywords.length}/${METADATA_KEYWORDS_MAX_COUNT} keywords)`}
                placeholder={
                    keywords.length < METADATA_KEYWORDS_MAX_COUNT
                        ? "Type a keyword and press Enter..."
                        : "Maximum keywords reached"
                }
                value={keywords}
                onChange={(value) => {
                    // Filter out keywords that exceed max length and limit count
                    const validKeywords = value
                        .filter((k) => k.length <= METADATA_KEYWORD_MAX_LENGTH)
                        .slice(0, METADATA_KEYWORDS_MAX_COUNT);
                    onKeywordsChange(validKeywords);
                }}
                maxTags={METADATA_KEYWORDS_MAX_COUNT}
                disabled={disabled}
                error={keywordsError}
                clearable
            />
        </Stack>
    );
}
