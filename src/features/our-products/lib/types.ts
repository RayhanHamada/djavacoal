/**
 * Media item type definition
 * Used across all media gallery components
 */
export interface MediaItem {
    id: number;
    type: "image" | "youtube";
    image_url?: string;
    youtube_url?: string;
    custom_thumbnail_url?: string;
}

/**
 * Legacy types - kept for backwards compatibility
 * These may be removed in future refactoring
 */
export interface ProductImage {
    src: string;
    alt: string;
}

export interface ProductShape {
    name: string;
    sizes: string[];
}

export interface VideoItem {
    video: string;
    thumbnail: string;
}

export interface ProductSpecification {
    label: string;
    value: string;
    isHighlighted?: boolean;
}

export interface ProductData {
    id: string;
    name: string;
    description: string;
    images: ProductImage[];
    shapes: ProductShape[];
    specifications: ProductSpecification[];
}
