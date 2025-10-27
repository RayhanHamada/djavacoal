import z from "zod/v4";

import {
    DEFAULT_PAGE_SIZE,
    MAX_BULK_DELETE,
    MAX_PAGE_SIZE,
    PHOTO_NAME_MAX_LENGTH,
    PHOTO_NAME_MIN_LENGTH,
} from "./constants";
import {
    ALLOWED_IMAGE_MIME_TYPES,
    MAX_FILE_SIZE,
} from "@/adapters/r2/constants";

/**
 * Input schema for listing photos with pagination, search, and sorting
 */
export const ListPhotosInputSchema = z.object({
    /** Search query for photo names */
    search: z.string().trim().max(100).optional(),
    /** Page number (1-indexed) */
    page: z.number().int().min(1).default(1),
    /** Number of photos per page */
    limit: z
        .number()
        .int()
        .min(1)
        .max(MAX_PAGE_SIZE)
        .default(DEFAULT_PAGE_SIZE),
    /** Sort field: name or updated_at */
    sortBy: z.enum(["name", "updated_at"]).default("updated_at"),
    /** Sort direction: asc or desc */
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

/**
 * Output schema for list photos response
 */
export const ListPhotosOutputSchema = z.object({
    photos: z.array(
        // z.object({
        //     id: z.string(),
        //     name: z.string(),
        //     key: z.string(),
        //     size: z.number(),
        //     mime_type: z.string(),
        //     url: z.string(), // Public URL for viewing
        //     created_at: z.date(),
        //     updated_at: z.date(),
        // })
        z.record(z.string(), z.any())
    ),
    total: z.number().int(),
    page: z.number().int(),
    pageSize: z.number().int(),
});

/**
 * Input schema for creating presigned URL for upload
 */
export const CreatePresignedUrlInputSchema = z.object({
    /** Photo name (8-100 characters, unique) */
    name: z.string().min(PHOTO_NAME_MIN_LENGTH).max(PHOTO_NAME_MAX_LENGTH),
    /** MIME type of the photo */
    mimeType: z.string().regex(/^image\/(jpeg|png|gif|webp|svg\+xml)$/),
    /** File size in bytes */
    size: z.number().int().min(1).max(MAX_FILE_SIZE),
});

/**
 * Output schema for presigned URL response
 */
export const CreatePresignedUrlOutputSchema = z.object({
    /** Presigned URL for uploading */
    uploadUrl: z.string().url(),
    /** Object key in R2 */
    key: z.string(),
    /** Photo ID to use when confirming upload */
    photoId: z.string(),
});

/**
 * Input schema for confirming upload after successful upload to R2
 */
export const ConfirmUploadInputSchema = z.object({
    /** Photo ID from presigned URL response */
    photoId: z.string(),
    /** Photo name */
    name: z.string().min(PHOTO_NAME_MIN_LENGTH).max(PHOTO_NAME_MAX_LENGTH),
    /** R2 object key */
    key: z.string(),
    /** File size in bytes */
    size: z.number().int().min(1),
    /** MIME type */
    mimeType: z.enum(ALLOWED_IMAGE_MIME_TYPES),
});

/**
 * Input schema for renaming a photo
 */
export const RenamePhotoInputSchema = z.object({
    /** Photo ID to rename */
    id: z.string(),
    /** New name (8-100 characters, must be unique) */
    newName: z.string().min(PHOTO_NAME_MIN_LENGTH).max(PHOTO_NAME_MAX_LENGTH),
});

/**
 * Input schema for deleting a single photo
 */
export const DeletePhotoInputSchema = z.object({
    /** Photo ID to delete */
    id: z.string(),
});

/**
 * Input schema for bulk deleting photos
 */
export const BulkDeletePhotosInputSchema = z.object({
    /** Array of photo IDs to delete */
    ids: z.array(z.string()).min(1).max(MAX_BULK_DELETE),
});

/**
 * Input schema for checking if a photo name is available
 */
export const CheckNameAvailabilityInputSchema = z.object({
    /** Photo name to check */
    name: z.string().min(PHOTO_NAME_MIN_LENGTH).max(PHOTO_NAME_MAX_LENGTH),
    /** Optional: exclude this photo ID from the check (for rename) */
    excludeId: z.string().optional(),
});

/**
 * Output schema for name availability check
 */
export const CheckNameAvailabilityOutputSchema = z.object({
    /** Whether the name is available */
    available: z.boolean(),
});
