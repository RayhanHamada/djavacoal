/**
 * Escapes special XML characters to prevent injection and ensure valid XML
 */
export function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

/**
 * Formats a Date object to ISO 8601 format for sitemap lastmod
 */
export function formatLastMod(date: Date | null | undefined): string | null {
    if (!date) return null;
    return new Date(date).toISOString();
}

/**
 * Generates XML sitemap urlset opening tag
 */
export function generateSitemapHeader(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
}

/**
 * Generates XML sitemap urlset closing tag
 */
export function generateSitemapFooter(): string {
    return `
</urlset>`;
}

/**
 * Generates XML sitemap index opening tag
 */
export function generateSitemapIndexHeader(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
}

/**
 * Generates XML sitemap index closing tag
 */
export function generateSitemapIndexFooter(): string {
    return `
</sitemapindex>`;
}
