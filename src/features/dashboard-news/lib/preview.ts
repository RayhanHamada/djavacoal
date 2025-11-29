/**
 * News Preview Utilities
 *
 * Handles local storage persistence for news article preview.
 * Supports temporary blob URLs for images that haven't been uploaded yet.
 */

/** Local storage key for preview data */
export const NEWS_PREVIEW_STORAGE_KEY = "news-preview-data";

/**
 * Preview data structure stored in local storage
 */
export interface NewsPreviewData {
    /** English title */
    enTitle: string;
    /** Arabic title */
    arTitle: string;
    /** English content (HTML) */
    enContent: string;
    /** Arabic content (HTML) */
    arContent: string;
    /** Cover image URL (can be blob URL or R2 URL) */
    coverImageUrl: string | null;
    /** Publication date ISO string */
    publishedAt: string;
    /** Timestamp when preview was created */
    createdAt: number;
}

/**
 * Save preview data to local storage
 */
export function saveNewsPreviewData(data: NewsPreviewData): void {
    if (typeof window === "undefined") return;

    try {
        localStorage.setItem(NEWS_PREVIEW_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Failed to save preview data:", error);
    }
}

/**
 * Get preview data from local storage
 */
export function getNewsPreviewData(): NewsPreviewData | null {
    if (typeof window === "undefined") return null;

    try {
        const stored = localStorage.getItem(NEWS_PREVIEW_STORAGE_KEY);
        if (!stored) return null;

        const data = JSON.parse(stored) as NewsPreviewData;

        // Check if preview data is stale (older than 1 hour)
        const oneHour = 60 * 60 * 1000;
        if (Date.now() - data.createdAt > oneHour) {
            clearNewsPreviewData();
            return null;
        }

        return data;
    } catch (error) {
        console.error("Failed to get preview data:", error);
        return null;
    }
}

/**
 * Clear preview data from local storage
 */
export function clearNewsPreviewData(): void {
    if (typeof window === "undefined") return;

    try {
        localStorage.removeItem(NEWS_PREVIEW_STORAGE_KEY);
    } catch (error) {
        console.error("Failed to clear preview data:", error);
    }
}

/**
 * Check if preview data exists
 */
export function hasNewsPreviewData(): boolean {
    return getNewsPreviewData() !== null;
}
