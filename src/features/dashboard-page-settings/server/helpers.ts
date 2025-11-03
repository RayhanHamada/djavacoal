import "server-only";

import { eq } from "drizzle-orm";

import { COMMON_COLUMNS, PAGE_METADATA_COLUMNS } from "@/adapters/d1/constants";
import { pageMetadatas } from "@/adapters/d1/schema";

/**
 * Find a page metadata entry by ID
 */
export async function findPageMetadataById(db: any, id: number) {
    const result = await db
        .select()
        .from(pageMetadatas)
        .where(eq(pageMetadatas[COMMON_COLUMNS.ID], id))
        .limit(1);

    return result[0] ?? null;
}

/**
 * Check if a path is already taken
 * @param db Database instance
 * @param path Path to check
 * @param excludeId Optional ID to exclude from check (for updates)
 * @returns true if path is available, false if taken
 */
export async function isPathAvailable(
    db: any,
    path: string,
    excludeId?: number
): Promise<boolean> {
    const result = await db
        .select()
        .from(pageMetadatas)
        .where(eq(pageMetadatas[PAGE_METADATA_COLUMNS.PATH], path))
        .limit(1);

    if (!result[0]) {
        return true;
    }

    // If we're excluding an ID (for updates), check if the found record is the one we're excluding
    if (excludeId !== undefined) {
        return result[0][COMMON_COLUMNS.ID] === excludeId;
    }

    return false;
}
