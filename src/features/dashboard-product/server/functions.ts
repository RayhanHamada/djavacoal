import "server-only";

import { headers } from "next/headers";

import { count, desc, eq, like } from "drizzle-orm";
import { nanoid } from "nanoid";

import {
    COMMON_COLUMNS,
    PACKAGING_OPTION_COLUMNS,
} from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { packagingOptions } from "@/adapters/d1/schema";
import {
    DEFAULT_BUCKET_NAME,
    deleteObject,
    generatePresignedUploadUrl,
    getR2Client,
} from "@/adapters/r2";
import { getAuth } from "@/features/admin-auth/lib/better-auth-server";
import {
    CreatePackagingOptionInputSchema,
    CreatePackagingOptionOutputSchema,
    DeletePackagingOptionInputSchema,
    GenerateImageUploadUrlInputSchema,
    GenerateImageUploadUrlOutputSchema,
    GetPackagingOptionByIdInputSchema,
    GetPackagingOptionByIdOutputSchema,
    ListPackagingOptionsInputSchema,
    ListPackagingOptionsOutputSchema,
    UpdatePackagingOptionInputSchema,
} from "@/features/dashboard-product/server/schemas";
import base from "@/lib/orpc/server";

const PACKAGING_OPTIONS_PREFIX = "packaging-options";

/**
 * List packaging options with pagination and search
 */
export const listPackagingOptions = base
    .input(ListPackagingOptionsInputSchema)
    .output(ListPackagingOptionsOutputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        const { search, page, limit } = input;

        // Build where clause for search (search by English name)
        const whereConditions = search
            ? like(
                  packagingOptions[PACKAGING_OPTION_COLUMNS.EN_NAME],
                  `%${search}%`
              )
            : undefined;

        // Fetch packaging options
        const options = await db
            .select()
            .from(packagingOptions)
            .where(whereConditions)
            .orderBy(desc(packagingOptions[COMMON_COLUMNS.UPDATED_AT]))
            .limit(limit)
            .offset((page - 1) * limit);

        // Get total count
        const totalResult = await db
            .select({ count: count() })
            .from(packagingOptions)
            .where(whereConditions);

        const total = totalResult.at(0)?.count ?? 0;

        return {
            packagingOptions: options.map((option) => ({
                id: option[COMMON_COLUMNS.ID],
                en_name: option[PACKAGING_OPTION_COLUMNS.EN_NAME],
                ar_name: option[PACKAGING_OPTION_COLUMNS.AR_NAME],
                en_description: option[PACKAGING_OPTION_COLUMNS.EN_DESCRIPTION],
                ar_description: option[PACKAGING_OPTION_COLUMNS.AR_DESCRIPTION],
                photo_key: option[PACKAGING_OPTION_COLUMNS.PHOTO_KEY],
                created_at: option[COMMON_COLUMNS.CREATED_AT],
                updated_at: option[COMMON_COLUMNS.UPDATED_AT],
            })),
            total,
            page,
            pageSize: limit,
        };
    })
    .callable();

/**
 * Get a single packaging option by ID
 */
export const getPackagingOptionById = base
    .input(GetPackagingOptionByIdInputSchema)
    .output(GetPackagingOptionByIdOutputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        const result = await db
            .select()
            .from(packagingOptions)
            .where(eq(packagingOptions[COMMON_COLUMNS.ID], input.id))
            .limit(1);

        const first = result.at(0);
        if (!first) {
            throw errors.NOT_FOUND({
                message: "Packaging option not found",
            });
        }

        return {
            id: first[COMMON_COLUMNS.ID],
            en_name: first[PACKAGING_OPTION_COLUMNS.EN_NAME],
            ar_name: first[PACKAGING_OPTION_COLUMNS.AR_NAME],
            en_description: first[PACKAGING_OPTION_COLUMNS.EN_DESCRIPTION],
            ar_description: first[PACKAGING_OPTION_COLUMNS.AR_DESCRIPTION],
            photo_key: first[PACKAGING_OPTION_COLUMNS.PHOTO_KEY],
            created_at: first[COMMON_COLUMNS.CREATED_AT],
            updated_at: first[COMMON_COLUMNS.UPDATED_AT],
            created_by: first[COMMON_COLUMNS.CREATED_BY],
            updated_by: first[COMMON_COLUMNS.UPDATED_BY],
        };
    })
    .callable();

/**
 * Create a new packaging option
 */
export const createPackagingOption = base
    .input(CreatePackagingOptionInputSchema)
    .output(CreatePackagingOptionOutputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        // Get current user from session
        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        const userId = session.user.id;

        // Insert new packaging option using raw SQL to avoid type issues
        const result = await db
            .insert(packagingOptions)
            .values({
                en_name: input[PACKAGING_OPTION_COLUMNS.EN_NAME],
                ar_name: input[PACKAGING_OPTION_COLUMNS.AR_NAME],
                en_description: input[PACKAGING_OPTION_COLUMNS.EN_DESCRIPTION],
                ar_description: input[PACKAGING_OPTION_COLUMNS.AR_DESCRIPTION],
                photo_key: input[PACKAGING_OPTION_COLUMNS.PHOTO_KEY],
                created_by: userId,
                updated_by: userId,
            })
            .returning({
                id: packagingOptions[COMMON_COLUMNS.ID],
            });

        const first = result.at(0);
        if (!first) {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Failed to create packaging option",
            });
        }

        return {
            id: first.id,
        };
    })
    .callable();

/**
 * Update an existing packaging option
 */
export const updatePackagingOption = base
    .input(UpdatePackagingOptionInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        // Get current user from session
        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED({
                message: "You must be logged in to update a packaging option",
            });
        }

        const userId = session.user.id;

        // Check if packaging option exists
        const existing = await db
            .select()
            .from(packagingOptions)
            .where(eq(packagingOptions[COMMON_COLUMNS.ID], input.id))
            .limit(1);

        const first = existing.at(0);
        if (!first) {
            throw errors.NOT_FOUND();
        }

        // Update packaging option using raw any to avoid type issues
        await db
            .update(packagingOptions)
            .set({
                en_name: input[PACKAGING_OPTION_COLUMNS.EN_NAME],
                ar_name: input[PACKAGING_OPTION_COLUMNS.AR_NAME],
                en_description: input[PACKAGING_OPTION_COLUMNS.EN_DESCRIPTION],
                ar_description: input[PACKAGING_OPTION_COLUMNS.AR_DESCRIPTION],
                photo_key: input[PACKAGING_OPTION_COLUMNS.PHOTO_KEY],
                updated_by: userId,
            } as any)
            .where(eq(packagingOptions[COMMON_COLUMNS.ID], input.id));

        return {
            success: true,
        };
    })
    .callable();

/**
 * Delete a packaging option
 */
export const deletePackagingOption = base
    .input(DeletePackagingOptionInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const auth = getAuth(env);
        const header = await headers();

        // Get current user from session
        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        // Check if packaging option exists
        const existing = await db
            .select()
            .from(packagingOptions)
            .where(eq(packagingOptions[COMMON_COLUMNS.ID], input.id))
            .limit(1);

        if (!existing) {
            throw errors.NOT_FOUND();
        }

        const option = existing.at(0);
        if (!option) {
            throw errors.NOT_FOUND();
        }

        // Delete from R2
        const r2Client = getR2Client({
            endpoint: env.S3_API,
            accessKeyId: env.R2_ACCESS_KEY_ID!,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
        });

        await deleteObject(r2Client, option.photo_key, DEFAULT_BUCKET_NAME);

        // Delete from database
        await db
            .delete(packagingOptions)
            .where(eq(packagingOptions[COMMON_COLUMNS.ID], input.id));

        return {
            success: true,
        };
    })
    .callable();

/**
 * Generate presigned URL for uploading packaging option image
 */
export const generateImageUploadUrl = base
    .input(GenerateImageUploadUrlInputSchema)
    .output(GenerateImageUploadUrlOutputSchema)
    .handler(async function ({ context: { env }, errors, input }) {
        const auth = getAuth(env);
        const header = await headers();

        // Get current user from session
        const session = await auth.api.getSession({
            headers: header,
        });

        if (!session) {
            throw errors.UNAUTHORIZED();
        }

        const { mimeType } = input;

        // Generate unique key for the image
        const key = `${PACKAGING_OPTIONS_PREFIX}/${nanoid()}`;

        // Create R2 client
        const r2Client = getR2Client({
            endpoint: env.S3_API,
            accessKeyId: env.R2_ACCESS_KEY_ID!,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
        });

        // Generate presigned URL
        const uploadUrl = await generatePresignedUploadUrl(r2Client, {
            key,
            contentType: mimeType,
            bucketName: DEFAULT_BUCKET_NAME,
        });

        return {
            uploadUrl,
            key,
        };
    })
    .callable();
