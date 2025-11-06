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
        highlight: "Coconut Shell",
        title: "Charcoal Briquette",
        description:
            "For Shisha - This charcoal is perfect for high heat and long burn times, offering a clean and sustainable option for shisha lovers. Its natural properties ensure minimal ash production and even heat distribution.",
        image: "/images/prod-coconut.png",
        href: "/our-products/coconut-shell-charcoal",
    },
    {
        id: "barbeque-charcoal",
        highlight: "Barbeque",
        title: "Charcoal",
        description:
            "For Grilling & Industrial Use - Ideal for grilling and industrial purposes, this charcoal is known for its dense structure, providing high heat retention and long-lasting burn, making it a reliable choice for both home and commercial use.",
        image: "/images/prod-bbq.png",
        href: "/our-products/barbeque-charcoal",
    },
    {
        id: "sawdust-charcoal",
        highlight: "Sawdust",
        title: "Charcoal",
        description:
            "For Grilling & Cooking - Best suited for grilling and slow-cooked meals, this charcoal is made from sawdust, ensuring a consistent and controlled burn, imparting a rich, smoky flavor to food while minimizing harmful emissions.",
        image: "/images/prod-sawdust.png",
        href: "/our-products/sawdust-charcoal",
    },
    {
        id: "natural-wood-charcoal",
        highlight: "Natural Wood",
        title: "Charcoal",
        description:
            "Made from natural hardwoods, this charcoal is designed for open flame grilling, providing intense heat quickly with minimal ash. It's perfect for achieving that classic char-grilled flavor in a short cooking time.",
        image: "/images/prod-wood.png",
        href: "/our-products/natural-wood-charcoal",
    },
];

/**
 * Features for why choose us section
 */
export const FEATURES: Feature[] = [
    { icon: "/images/icon-low-ash.png", title: "Low Ash Content" },
    { icon: "/images/icon-eco-friendly.png", title: "Eco Friendly" },
    { icon: "/images/icon-long-lasting.png", title: "Long Lasting" },
    { icon: "/images/icon-odorless.png", title: "Odorless" },
    { icon: "/images/icon-no-chemical.png", title: "No Chemical" },
    { icon: "/images/icon-premium-quality.png", title: "Premium Quality" },
    { icon: "/images/icon-low-water.png", title: "Low Water Content" },
    { icon: "/images/icon-glowing-heat.png", title: "Glowing Heat" },
];

/**
 * Carousel auto-slide interval in milliseconds
 */
export const CAROUSEL_INTERVAL = 8000;

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
