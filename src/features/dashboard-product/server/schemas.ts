import z from "zod/v4";

import {
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    PACKAGING_DESCRIPTION_MAX_LENGTH,
    PACKAGING_DESCRIPTION_MIN_LENGTH,
    PACKAGING_NAME_MAX_LENGTH,
    PACKAGING_NAME_MIN_LENGTH,
} from "./constants";
import { MAX_FILE_SIZE } from "@/adapters/r2/constants";

/**
 * Input schema for listing packaging options with pagination and search
 */
export const ListPackagingOptionsInputSchema = z.object({
    /** Search query for packaging option names (searches English name) */
    search: z.string().trim().max(100).optional(),
    /** Page number (1-indexed) */
    page: z.number().int().min(1).default(1),
    /** Number of items per page */
    limit: z
        .number()
        .int()
        .min(1)
        .max(MAX_PAGE_SIZE)
        .default(DEFAULT_PAGE_SIZE),
});

/**
 * Output schema for list packaging options response
 */
export const ListPackagingOptionsOutputSchema = z.object({
    packagingOptions: z.array(
        z.object({
            id: z.number(),
            en_name: z.string(),
            ar_name: z.string(),
            en_description: z.string(),
            ar_description: z.string(),
            photo_key: z.string(),
            created_at: z.date(),
            updated_at: z.date(),
        })
    ),
    total: z.number().int(),
    page: z.number().int(),
    pageSize: z.number().int(),
});

/**
 * Input schema for getting a single packaging option by ID
 */
export const GetPackagingOptionByIdInputSchema = z.object({
    id: z.number().int().positive(),
});

/**
 * Output schema for get packaging option by ID
 */
export const GetPackagingOptionByIdOutputSchema = z.object({
    id: z.number(),
    en_name: z.string(),
    ar_name: z.string(),
    en_description: z.string(),
    ar_description: z.string(),
    photo_key: z.string(),
    created_at: z.date(),
    updated_at: z.date(),
    created_by: z.string(),
    updated_by: z.string(),
});

/**
 * Input schema for creating a packaging option
 */
export const CreatePackagingOptionInputSchema = z.object({
    en_name: z
        .string()
        .trim()
        .min(PACKAGING_NAME_MIN_LENGTH)
        .max(PACKAGING_NAME_MAX_LENGTH),
    ar_name: z
        .string()
        .trim()
        .min(PACKAGING_NAME_MIN_LENGTH)
        .max(PACKAGING_NAME_MAX_LENGTH),
    en_description: z
        .string()
        .trim()
        .min(PACKAGING_DESCRIPTION_MIN_LENGTH)
        .max(PACKAGING_DESCRIPTION_MAX_LENGTH),
    ar_description: z
        .string()
        .trim()
        .min(PACKAGING_DESCRIPTION_MIN_LENGTH)
        .max(PACKAGING_DESCRIPTION_MAX_LENGTH),
    photo_key: z.string(),
});

/**
 * Output schema for create packaging option
 */
export const CreatePackagingOptionOutputSchema = z.object({
    id: z.number(),
});

/**
 * Input schema for updating a packaging option
 */
export const UpdatePackagingOptionInputSchema = z.object({
    id: z.number().int().positive(),
    en_name: z
        .string()
        .trim()
        .min(PACKAGING_NAME_MIN_LENGTH)
        .max(PACKAGING_NAME_MAX_LENGTH),
    ar_name: z
        .string()
        .trim()
        .min(PACKAGING_NAME_MIN_LENGTH)
        .max(PACKAGING_NAME_MAX_LENGTH),
    en_description: z
        .string()
        .trim()
        .min(PACKAGING_DESCRIPTION_MIN_LENGTH)
        .max(PACKAGING_DESCRIPTION_MAX_LENGTH),
    ar_description: z
        .string()
        .trim()
        .min(PACKAGING_DESCRIPTION_MIN_LENGTH)
        .max(PACKAGING_DESCRIPTION_MAX_LENGTH),
    photo_key: z.string(),
});

/**
 * Input schema for deleting a packaging option
 */
export const DeletePackagingOptionInputSchema = z.object({
    id: z.number().int().positive(),
});

/**
 * Input schema for generating presigned URL for image upload
 */
export const GenerateImageUploadUrlInputSchema = z.object({
    /** MIME type of the image */
    mimeType: z.string().regex(/^image\/(jpeg|png|gif|webp|svg\+xml)$/),
    /** File size in bytes */
    size: z.number().int().min(1).max(MAX_FILE_SIZE),
});

/**
 * Output schema for presigned URL response
 */
export const GenerateImageUploadUrlOutputSchema = z.object({
    /** Presigned URL for uploading */
    uploadUrl: z.url(),
    /** Object key in R2 */
    key: z.string(),
});
