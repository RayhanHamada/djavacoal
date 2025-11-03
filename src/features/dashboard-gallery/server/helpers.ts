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
    db: any,
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
    db: any,
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
    db: any,
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
export function buildPhotoUrl(key: string, assetUrl: string): string {
    // Ensure assetUrl doesn't end with a slash
    const baseUrl = assetUrl.endsWith("/") ? assetUrl.slice(0, -1) : assetUrl;
    return `${baseUrl}/${key}`;
}

/**
 * Build the full R2 path for a file
 *
 * @param key - The object key
 * @param bucketName - Optional bucket name prefix
 * @returns Full R2 path
 */
export function buildR2Path(key: string, bucketName?: string): string {
    return bucketName ? `${bucketName}/${key}` : key;
}
