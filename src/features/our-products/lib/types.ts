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
