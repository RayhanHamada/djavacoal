import "server-only";

import { and, eq, ne } from "drizzle-orm";

import { COMMON_COLUMNS, GALLERY_PHOTO_COLUMNS } from "@/adapters/d1/constants";
import { galleryPhotos } from "@/adapters/d1/schema";

/**
 * Check if a photo name already exists in the database
 *
 * @param db - Drizzle database instance
 * @param name - Photo name to check
 * @param excludeId - Optional photo ID to exclude from check (for rename operations)
 * @returns true if name is available, false if taken
 */
export async function isPhotoNameAvailable(
    db: ReturnType<typeof import("@/adapters/d1/db").getDB>,
    name: string,
    excludeId?: string
): Promise<boolean> {
    const whereConditions = excludeId
        ? and(
              eq(galleryPhotos[GALLERY_PHOTO_COLUMNS.NAME], name),
              ne(galleryPhotos[COMMON_COLUMNS.ID], excludeId)
          )
        : eq(galleryPhotos[GALLERY_PHOTO_COLUMNS.NAME], name);

    const existing = await db
        .select()
        .from(galleryPhotos)
        .where(whereConditions)
        .limit(1);

    return existing.length === 0;
}

/**
 * Find a photo by ID
 *
 * @param db - Drizzle database instance
 * @param id - Photo ID
 * @returns Photo record or null if not found
 */
export async function findPhotoById(
    db: ReturnType<typeof import("@/adapters/d1/db").getDB>,
    id: string
): Promise<typeof galleryPhotos.$inferSelect | null> {
    const photos = await db
        .select()
        .from(galleryPhotos)
        .where(eq(galleryPhotos[COMMON_COLUMNS.ID], id))
        .limit(1);

    return photos.length > 0 ? photos[0] : null;
}

/**
 * Find multiple photos by their IDs
 *
 * @param db - Drizzle database instance
 * @param ids - Array of photo IDs
 * @returns Array of photo records
 */
export async function findPhotosByIds(
    db: ReturnType<typeof import("@/adapters/d1/db").getDB>,
    ids: string[]
): Promise<Array<typeof galleryPhotos.$inferSelect>> {
    if (ids.length === 0) {
        return [];
    }

    // Use IN clause for better performance
    const photos = await db
        .select()
        .from(galleryPhotos)
        .where(
            eq(
                galleryPhotos[COMMON_COLUMNS.ID],
                ids[0] as string // Type assertion for initial query
            )
        );

    // Filter to only include matching IDs
    return photos.filter((photo: any) =>
        ids.includes(photo[COMMON_COLUMNS.ID] as string)
    );
}

/**
 * Build a public URL for a photo stored in R2
 *
 * @param key - R2 object key
 * @param assetUrl - Base asset URL from environment
 * @returns Full public URL to the photo
 */
export function buildPhotoUrl(key: string, assetUrl?: string): string {
    if (!assetUrl) {
        throw new Error("Asset URL is required to build photo URL");
    }
    // Ensure assetUrl doesn't end with a slash and key doesn't start with one
    const baseUrl = assetUrl.endsWith("/") ? assetUrl.slice(0, -1) : assetUrl;
    const cleanKey = key.startsWith("/") ? key.slice(1) : key;
    return `${baseUrl}/${cleanKey}`;
}

/**
 * Build the full R2 path for a file
 *
 * Note: This is primarily used for R2 operations where bucket prefix might be needed.
 * For public URLs, use buildPhotoUrl instead.
 *
 * @param key - The object key (e.g., "gallery-photos/abc123")
 * @param bucketName - Optional bucket name prefix for internal R2 operations
 * @returns Full R2 path with optional bucket prefix
 *
 * @example
 * buildR2Path("gallery-photos/abc123") // "gallery-photos/abc123"
 * buildR2Path("gallery-photos/abc123", "my-bucket") // "my-bucket/gallery-photos/abc123"
 */
export function buildR2Path(key: string, bucketName?: string): string {
    return bucketName
        ? `${bucketName}/${key.startsWith("/") ? key.slice(1) : key}`
        : key;
}
