/**
 * Dashboard Product Feature Utilities
 */

/**
 * Extract YouTube video ID from various YouTube URL formats
 * @param url - YouTube URL (e.g., youtube.com/watch?v=xxx, youtu.be/xxx)
 * @returns Video ID or undefined if not found
 */
export function extractYoutubeID(url: string): string | undefined {
    const pattern =
        /^(?:.*(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/))?([a-zA-Z0-9_-]{11})$/;

    const match = url.match(pattern);
    return match?.[1];
}

/**
 * Generate a URL-friendly slug from an English product name.
 * Converts to lowercase, replaces spaces with dashes, and removes special characters.
 *
 * @param enName - English product name
 * @returns URL-friendly slug (e.g., "Premium Coal" -> "premium-coal")
 */
export function generateProductSlug(enName: string): string {
    return enName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and dashes
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .replace(/-+/g, "-") // Replace multiple dashes with single dash
        .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
}
