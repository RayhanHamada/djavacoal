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
