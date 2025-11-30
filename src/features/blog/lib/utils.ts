/**
 * Blog Feature Utilities
 * Shared helper functions for blog components
 */

/** Default base URL for blog pagination */
export const DEFAULT_BLOG_BASE_URL = "/blog";

/**
 * Format date for blog display
 * @param date - Date object or string to format
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date string
 */
export function formatBlogDate(
    date: Date | string,
    locale: string = "en-US"
): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    return dateObj.toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/**
 * Generate placeholder image path
 * @returns Path to blog placeholder image
 */
export function getBlogPlaceholderImage(): string {
    return "/images/blog/blog-placeholder.png";
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
}

/**
 * Generate pagination URL for a given page number
 * @param baseUrl - Base URL for pagination links
 * @param page - Page number
 * @returns URL string with page parameter
 */
export function getPaginationUrl(baseUrl: string, page: number): string {
    if (page === 1) {
        return baseUrl;
    }
    return `${baseUrl}?page=${page}`;
}

/**
 * Generate array of page numbers for pagination
 * @param totalPages - Total number of pages
 * @returns Array of page numbers [1, 2, 3, ...]
 */
export function generatePageNumbers(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
}

/**
 * Get aria label for pagination arrow
 * @param direction - Direction of the arrow
 * @returns Accessibility label string
 */
export function getPaginationArrowLabel(direction: "prev" | "next"): string {
    return direction === "prev" ? "Previous page" : "Next page";
}
