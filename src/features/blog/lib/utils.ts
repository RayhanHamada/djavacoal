/**
 * Blog Feature Utilities
 * Shared helper functions for blog components
 */

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
