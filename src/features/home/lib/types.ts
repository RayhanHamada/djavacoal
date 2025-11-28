/**
 * Shared types for home feature components
 */

export interface Product {
    id: string;
    productKey: string;
    image: string;
    href: string;
}

export interface Feature {
    icon: string;
    titleKey: string;
}

export interface HeroSlide {
    src: string;
    alt: string;
}

export interface Certificate {
    image: string;
    title: string;
    subtitle?: string;
    width: number;
    height: number;
}

export type ButtonVariant = "primary" | "secondary" | "outline";

export type IconSize = "sm" | "md" | "lg";

export type SectionVariant = "left" | "center";

/**
 * News item interface for the news list section
 */
export interface NewsItem {
    id: number;
    slug: string;
    title: string;
    titleHighlight: string;
    publishedAt: string;
    coverImage: string;
}
