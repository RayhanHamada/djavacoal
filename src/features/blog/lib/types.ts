/**
 * Blog Feature Types
 * Centralized type definitions for blog components
 */

/**
 * Core blog post interface used across the application
 */
export interface BlogPost {
    id: number;
    slug: string;
    title: string;
    published_at: Date;
    cover_image_url: string | null;
}

/**
 * Related article interface for sidebar display
 */
export interface RelatedArticle {
    id: number;
    slug: string;
    title: string;
    date: string;
    imageUrl?: string;
}

/**
 * Blog metadata for detail pages
 */
export interface BlogDetail extends BlogPost {
    content: string;
    meta_title?: string;
    meta_description?: string;
}

/**
 * Pagination direction type for arrow buttons
 */
export type PaginationDirection = "prev" | "next";
