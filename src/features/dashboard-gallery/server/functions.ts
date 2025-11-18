import "server-only";

import { asc, count, desc, eq, like, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

import { COMMON_COLUMNS, GALLERY_PHOTO_COLUMNS } from "@/adapters/d1/constants";
import { getDB } from "@/adapters/d1/db";
import { galleryPhotos } from "@/adapters/d1/schema";
import {
    DEFAULT_BUCKET_NAME,
    GALLERY_PHOTOS_PREFIX,
    generatePresignedUploadUrl,
    getR2Client,
} from "@/adapters/r2";
import {
    buildPhotoUrl,
    buildR2Path,
    findPhotoById,
    isPhotoNameAvailable,
} from "@/features/dashboard-gallery/server/helpers";
import {
    BulkDeletePhotosInputSchema,
    CheckNameAvailabilityInputSchema,
    CheckNameAvailabilityOutputSchema,
    ConfirmUploadInputSchema,
    CreatePresignedUrlInputSchema,
    CreatePresignedUrlOutputSchema,
    DeletePhotoInputSchema,
    ListPhotosInputSchema,
    ListPhotosOutputSchema,
    RenamePhotoInputSchema,
} from "@/features/dashboard-gallery/server/schema";
import base from "@/lib/orpc/server";

/**
 * List photos with pagination, search, and sorting
 */
export const listPhotos = base
    .input(ListPhotosInputSchema)
    .output(ListPhotosOutputSchema)
    .handler(async function ({ context: { env }, input }) {
        const db = getDB(env.DJAVACOAL_DB);
        const { search, page, limit, sortBy, sortOrder } = input;

        // Build where clause for search
        const whereConditions = search
            ? like(galleryPhotos[GALLERY_PHOTO_COLUMNS.NAME], `%${search}%`)
            : undefined;

        // // Build order by clause
        const orderByColumn =
            sortBy === "name"
                ? galleryPhotos[GALLERY_PHOTO_COLUMNS.NAME]
                : galleryPhotos[COMMON_COLUMNS.UPDATED_AT];
        const orderByDirection = sortOrder === "asc" ? asc : desc;

        // Fetch photos
        const photos = await db
            .select({
                id: galleryPhotos[COMMON_COLUMNS.ID],
                name: galleryPhotos[GALLERY_PHOTO_COLUMNS.NAME],
                key: galleryPhotos[GALLERY_PHOTO_COLUMNS.KEY],
                size: galleryPhotos[GALLERY_PHOTO_COLUMNS.SIZE],
                mime_type: galleryPhotos[GALLERY_PHOTO_COLUMNS.MIME_TYPE],
                created_at: galleryPhotos[COMMON_COLUMNS.CREATED_AT],
                updated_at: galleryPhotos[COMMON_COLUMNS.UPDATED_AT],
            })
            .from(galleryPhotos)
            .where(whereConditions)
            .orderBy(orderByDirection(orderByColumn))
            .limit(limit)
            .offset((page - 1) * limit)
            .catch((err) => {
                console.log(err);

                return [];
            });

        // Get total count
        const totalResult = await db
            .select({ count: count() })
            .from(galleryPhotos)
            .where(whereConditions)
            .catch((err) => {
                console.log(err);

                return [];
            });

        const total = totalResult[0]?.count ?? 0;

        // Generate public URLs for each photo using R2 public URL
        const photosWithUrls = photos.map((photo) => ({
            ...photo,
            url: buildPhotoUrl(
                photo.key as string,
                process.env.NEXT_PUBLIC_ASSET_URL
            ),
            created_at: new Date(photo.created_at ?? 0),
            updated_at: new Date(photo.updated_at ?? 0),
        }));

        return {
            photos: photosWithUrls,
            total,
            page,
            pageSize: limit,
        };
    })
    .callable();

/**
 * Create presigned URL for uploading a photo
 * This allows browser-based upload without sending the file through the server
 */
export const createPresignedUrl = base
    .input(CreatePresignedUrlInputSchema)
    .output(CreatePresignedUrlOutputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const { name, mimeType } = input;

        // Check if name already exists
        const available = await isPhotoNameAvailable(db, name);
        if (!available) {
            throw errors.BAD_REQUEST({
                message: `Photo name "${name}" is already taken`,
            });
        }

        // Generate unique ID and key
        const photoId = nanoid();
        const key = `${GALLERY_PHOTOS_PREFIX}/${photoId}`;

        // Create S3 client for R2
        const r2Client = getR2Client({
            endpoint: process.env.S3_API,
            accessKeyId: process.env.R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        });

        // Generate presigned URL for PUT operation
        const uploadUrl = await generatePresignedUploadUrl(r2Client, {
            key,
            contentType: mimeType,
            bucketName: DEFAULT_BUCKET_NAME,
        });

        return {
            uploadUrl,
            key,
            photoId,
        };
    })
    .callable();

/**
 * Confirm upload and save photo metadata to database
 * Called after successful upload to R2
 */
export const confirmUpload = base
    .input(ConfirmUploadInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const { photoId, name, key, size, mimeType } = input;

        // Check if name is still available (edge case: concurrent upload)
        const available = await isPhotoNameAvailable(db, name);
        if (!available) {
            // Delete the uploaded file from R2
            await env.DJAVACOAL_BUCKET.delete(key);
            throw errors.BAD_REQUEST({
                message: `Photo name "${name}" is already taken`,
            });
        }

        // Insert photo metadata into database
        await db.insert(galleryPhotos).values({
            [COMMON_COLUMNS.ID]: photoId,
            [GALLERY_PHOTO_COLUMNS.NAME]: name,
            [GALLERY_PHOTO_COLUMNS.KEY]: key,
            [GALLERY_PHOTO_COLUMNS.SIZE]: size,
            [GALLERY_PHOTO_COLUMNS.MIME_TYPE]: mimeType,
        });

        return {
            success: true,
            photoId,
        };
    })
    .callable();

/**
 * Rename a photo
 */
export const renamePhoto = base
    .input(RenamePhotoInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const { id, newName } = input;

        // Check if photo exists
        const photo = await findPhotoById(db, id);
        if (!photo) {
            throw errors.NOT_FOUND({
                message: "Photo not found",
            });
        }

        // Check if new name is already taken (excluding current photo)
        const available = await isPhotoNameAvailable(db, newName, id);
        if (!available) {
            throw errors.BAD_REQUEST({
                message: `Photo name "${newName}" is already taken`,
            });
        }

        // Update photo name
        await db
            .update(galleryPhotos)
            .set({
                [GALLERY_PHOTO_COLUMNS.NAME]: newName,
                [COMMON_COLUMNS.UPDATED_AT]: sql`CURRENT_TIMESTAMP`,
            })
            .where(eq(galleryPhotos[COMMON_COLUMNS.ID], id));

        return {
            success: true,
        };
    })
    .callable();

/**
 * Delete a single photo
 */
export const deletePhoto = base
    .input(DeletePhotoInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const { id } = input;

        // Get photo to retrieve the key
        const photo = await findPhotoById(db, id);
        if (!photo) {
            throw errors.NOT_FOUND({
                message: "Photo not found",
            });
        }

        // Delete from R2
        const r2Path = buildR2Path(
            photo[GALLERY_PHOTO_COLUMNS.KEY] as string,
            DEFAULT_BUCKET_NAME
        );
        await env.DJAVACOAL_BUCKET.delete(r2Path);

        // Delete from database
        await db
            .delete(galleryPhotos)
            .where(eq(galleryPhotos[COMMON_COLUMNS.ID], id));

        return {
            success: true,
        };
    })
    .callable();

/**
 * Bulk delete photos
 */
export const bulkDeletePhotos = base
    .input(BulkDeletePhotosInputSchema)
    .handler(async function ({ context: { env }, input, errors }) {
        const db = getDB(env.DJAVACOAL_DB);
        const { ids } = input;

        // Get all photos to retrieve their keys
        const photos = await db
            .select()
            .from(galleryPhotos)
            .where(
                sql`${galleryPhotos[COMMON_COLUMNS.ID]} IN (${sql.join(
                    ids.map((id) => sql`${id}`),
                    sql`, `
                )})`
            );

        if (photos.length === 0) {
            throw errors.NOT_FOUND({
                message: "No photos found to delete",
            });
        }

        // Delete from R2 in parallel
        await Promise.all(
            photos.map((photo) => {
                const r2Path = buildR2Path(
                    photo[GALLERY_PHOTO_COLUMNS.KEY] as string,
                    DEFAULT_BUCKET_NAME
                );
                return env.DJAVACOAL_BUCKET.delete(r2Path);
            })
        );

        // Delete from database
        await db.delete(galleryPhotos).where(
            sql`${galleryPhotos[COMMON_COLUMNS.ID]} IN (${sql.join(
                ids.map((id) => sql`${id}`),
                sql`, `
            )})`
        );

        return {
            success: true,
            deletedCount: photos.length,
        };
    })
    .callable();

/**
 * Check if a photo name is available
 */
export const checkNameAvailability = base
    .input(CheckNameAvailabilityInputSchema)
    .output(CheckNameAvailabilityOutputSchema)
    .handler(async function ({ context: { env }, input }) {
        const db = getDB(env.DJAVACOAL_DB);
        const { name, excludeId } = input;

        const available = await isPhotoNameAvailable(db, name, excludeId);

        return {
            available,
        };
    })
    .callable();
