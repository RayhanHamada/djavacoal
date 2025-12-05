"use client";

import Image from "next/image";

/** Default placeholder image when no cover image is available */
const DEFAULT_COVER_IMAGE = "/images/blog/placeholder.png";

interface NewsCardImageProps {
    /** Cover image URL */
    coverImage: string | null;
    /** Alt text for the image */
    alt: string;
}

/**
 * NewsCardImage - Image component for news card with hover effect
 */
export function NewsCardImage({ coverImage, alt }: NewsCardImageProps) {
    const imageUrl = coverImage ?? DEFAULT_COVER_IMAGE;

    return (
        <div className="relative aspect-square overflow-hidden">
            <Image
                src={imageUrl}
                alt={alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
        </div>
    );
}
