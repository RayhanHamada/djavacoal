import "server-only";

import { nanoid } from "nanoid";

import {
    getR2Client,
    PRODUCT_CATALOGUE_PREFIX,
    STATIC_MEDIA_CAROUSEL_PREFIX,
    STATIC_MEDIA_FACTORY_GALLERY_PREFIX,
    STATIC_MEDIA_FACTORY_PHOTO_PREFIX,
    STATIC_MEDIA_FACTORY_VISIT_PREFIX,
    STATIC_MEDIA_PRODUCT_GALLERY_PREFIX,
    STATIC_MEDIA_REELS_PREFIX,
} from "@/adapters/r2";

/**
 * Get R2 prefix based on media type
 */
export function getR2Prefix(
    prefix:
        | "carousel"
        | "factory-visit"
        | "factory-photo"
        | "reels"
        | "factory-gallery"
        | "product-gallery"
        | "product-catalogue"
): string {
    switch (prefix) {
        case "carousel":
            return STATIC_MEDIA_CAROUSEL_PREFIX;
        case "factory-visit":
            return STATIC_MEDIA_FACTORY_VISIT_PREFIX;
        case "factory-photo":
            return STATIC_MEDIA_FACTORY_PHOTO_PREFIX;
        case "reels":
            return STATIC_MEDIA_REELS_PREFIX;
        case "factory-gallery":
            return STATIC_MEDIA_FACTORY_GALLERY_PREFIX;
        case "product-gallery":
            return STATIC_MEDIA_PRODUCT_GALLERY_PREFIX;
        case "product-catalogue":
            return PRODUCT_CATALOGUE_PREFIX;
    }
}

/**
 * Generate R2 key for upload
 */
export function generateR2Key(prefix: string): string {
    const id = nanoid();
    return `${prefix}/${id}`;
}

/**
 * Build public URL for photo
 */
export function buildPhotoUrl(key: string, assetUrl: string): string {
    return `${assetUrl}${key}`;
}

/**
 * Extract YouTube video ID from URL
 */
export function extractYouTubeId(url: string): string | null {
    // Support various YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/, // Direct ID
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }

    return null;
}

/**
 * Validate if URL is a YouTube Shorts URL
 */
export function isYouTubeShorts(url: string): boolean {
    return url.includes("youtube.com/shorts/") || url.includes("youtu.be/");
}

/**
 * Create R2 client with environment credentials
 */
export function createR2Client() {
    return getR2Client({
        endpoint: process.env.S3_API,
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    });
}
