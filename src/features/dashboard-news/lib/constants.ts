/**
 * Constants for dashboard news feature
 */

import { NEWS_STATUS } from "@/adapters/d1/constants";

/**
 * Pagination defaults
 */
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

/**
 * Slug validation
 */
export const SLUG_MIN_LENGTH = 1;
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SLUG_ERROR_MESSAGE =
    "Slug must be kebab-case (lowercase letters, numbers, and hyphens only)";

/**
 * Metadata validation
 */
export const METADATA_TITLE_MIN_LENGTH = 1;
export const METADATA_DESCRIPTION_MIN_LENGTH = 1;
export const METADATA_DESCRIPTION_MAX_LENGTH = 160;

/**
 * Content validation
 */
export const TITLE_MIN_LENGTH = 1;
export const CONTENT_MIN_LENGTH = 1;
export const FORM_CONTENT_MIN_LENGTH = 160;

/**
 * Tag validation
 */
export const TAG_NAME_MIN_LENGTH = 1;

/**
 * Image upload validation (imported from R2 constants)
 */
export {
    MAX_FILE_SIZE,
    ALLOWED_IMAGE_MIME_TYPES,
} from "@/adapters/r2/constants";

/**
 * Status transitions
 */
export const STATUS_TRANSITION_ERRORS = {
    DRAFT_TO_UNPUBLISHED:
        "Cannot unpublish a draft article. Article must be published first.",
    UNPUBLISHED_ON_CREATE: "Cannot create article with unpublished status",
    PUBLISHED_REQUIRES_DATE:
        "Publication date is required when status is published",
} as const;

export const CREATION_MODE = {
    FRESH: "fresh",
    MIGRATION: "migration",
};

export const NEWS_STATUS_FILTER_VALUES = {
    ALL: "all",
    ...NEWS_STATUS,
} as const;

export type NewsStatusFilterEnumType =
    (typeof NEWS_STATUS_FILTER_VALUES)[keyof typeof NEWS_STATUS_FILTER_VALUES];
