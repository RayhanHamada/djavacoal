import type { Feature, HeroSlide, Product } from "./types";

/**
 * Hero carousel slides for banner section
 */
export const HERO_SLIDES: HeroSlide[] = [
    {
        src: "/images/hero-carousel-1.png",
        alt: "Hero slide 1",
    },
    {
        src: "/images/hero-carousel-2.png",
        alt: "Hero slide 2",
    },
    {
        src: "/images/hero-carousel-3.png",
        alt: "Hero slide 3",
    },
    {
        src: "/images/hero-carousel-4.png",
        alt: "Hero slide 4",
    },
    {
        src: "/images/hero-carousel-5.png",
        alt: "Hero slide 5",
    },
];

/**
 * Products list for discover products section
 */
export const PRODUCTS: Product[] = [
    {
        id: "coconut-shell-charcoal",
        productKey: "coconutShell",
        image: "/images/prod-coconut.png",
        href: "/our-products/coconut-shell-charcoal",
    },
    {
        id: "barbeque-charcoal",
        productKey: "barbeque",
        image: "/images/prod-bbq.png",
        href: "/our-products/barbeque-charcoal",
    },
    {
        id: "sawdust-charcoal",
        productKey: "sawdust",
        image: "/images/prod-sawdust.png",
        href: "/our-products/sawdust-charcoal",
    },
    {
        id: "natural-wood-charcoal",
        productKey: "naturalWood",
        image: "/images/prod-wood.png",
        href: "/our-products/natural-wood-charcoal",
    },
];

/**
 * Features for why choose us section
 */
export const FEATURES: Feature[] = [
    { icon: "/images/icon-low-ash.png", titleKey: "lowAsh" },
    { icon: "/images/icon-eco-friendly.png", titleKey: "ecoFriendly" },
    { icon: "/images/icon-long-lasting.png", titleKey: "longLasting" },
    { icon: "/images/icon-odorless.png", titleKey: "odorless" },
    { icon: "/images/icon-no-chemical.png", titleKey: "noChemical" },
    { icon: "/images/icon-premium-quality.png", titleKey: "premiumQuality" },
    { icon: "/images/icon-low-water.png", titleKey: "lowWater" },
    { icon: "/images/icon-glowing-heat.png", titleKey: "glowingHeat" },
];

/**
 * Carousel auto-slide interval in milliseconds
 */
export const CAROUSEL_INTERVAL = 8000;

/**
 * News carousel auto-slide interval in milliseconds
 */
export const NEWS_CAROUSEL_INTERVAL = 6000;

/**
 * Brand colors
 */
export const COLORS = {
    primary: "#EFA12D",
    background: {
        dark: "#0D0D0D",
        darker: "#151515",
        darkest: "#161616",
    },
    text: {
        primary: "#FFFFFF",
        secondary: "#C6C6C6",
        muted: "#CFCFCF",
    },
    border: {
        default: "#4F4F4F",
        muted: "#9C9C9C",
    },
} as const;
