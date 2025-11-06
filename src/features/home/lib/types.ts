/**
 * Shared types for home feature components
 */

export interface Product {
    id: string;
    highlight: string;
    title: string;
    description: string;
    image: string;
    href: string;
}

export interface Feature {
    icon: string;
    title: string;
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
