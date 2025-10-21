import type {
    ProductData,
    ProductShape,
    ProductSpecification,
    VideoItem,
} from "./types";

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
}

// Product Data Constants
export const PRODUCT_SHAPES: ProductShape[] = [
    {
        name: "CUBE",
        sizes: [
            "22x22x22 - (96 pcs/kg)",
            "25x25x25 - (72 pcs/kg)",
            "26x26x26 - (64 pcs/kg)",
            "27x27x27 - (54 pcs/kg)",
            "28x28x28 - (50 pcs/kg)",
        ],
    },
    {
        name: "FLAT",
        sizes: [
            "25x25x17 - (108 pcs/kg)",
            "25x25x15 - (120 pcs/kg)",
            "20x20x20 - (130 pcs/kg)",
        ],
    },
    {
        name: "HEXA",
        sizes: [
            "18x50 - (72 pcs/kg)",
            "25x35 - (96 pcs/kg)",
            "20x42 - (88 pcs/kg)",
        ],
    },
    {
        name: "STICK",
        sizes: [
            "18x50 - (72 pcs/kg)",
            "25x35 - (96 pcs/kg)",
            "25x40 - (66 pcs/kg)",
        ],
    },
];

export const PRODUCT_SPECIFICATIONS: ProductSpecification[] = [
    { label: "MOQ:", value: "20' Container (18 Tons)", isHighlighted: false },
    {
        label: "Packaging:",
        value: "pail / Bulk / Bulk Load",
        isHighlighted: true,
    },
    { label: "Payment Terms:", value: "L/C, T/T, (DP)", isHighlighted: true },
    {
        label: "Shipment Terms:",
        value: "Freight On Board (FOB)",
        isHighlighted: true,
    },
    {
        label: "Production Capacity:",
        value: "250 Tons/Month",
        isHighlighted: false,
    },
];

export const COCONUT_SHELL_PRODUCT: ProductData = {
    id: "coconut-shell-charcoal",
    name: "Coconut Shell Charcoal Briquette",
    description:
        "Coconut Shell Charcoal Briquette Is An Eco-Friendly, Sustainable Fuel Made From The Natural Byproduct Of Coconut Shells, Known For Its High Calorific Value, Long Burn Time, And Low Ash Content. It Is Ideal For Grilling, Smoking, And Industrial Applications. Our Coconut Shell Charcoal Is Made From Pure Natural Byproduct Without Any Harmful Chemicals, Making It A Preferred Alternative To Traditional Wood Charcoal. Additionally, It's Produced Using A Renewable Resource, Contributing To Environmental Conservation While Delivering Efficient And Consistent Heat Output, Making It A Popular Choice For Both Domestic And Commercial Use Globally, Especially In The Shisha Market.",
    images: [
        {
            src: "/api/placeholder/400/400",
            alt: "Coconut Shell Charcoal Main View",
        },
        {
            src: "/api/placeholder/400/300",
            alt: "Coconut Shell Charcoal View 2",
        },
        {
            src: "/api/placeholder/400/300",
            alt: "Coconut Shell Charcoal View 3",
        },
        {
            src: "/api/placeholder/400/300",
            alt: "Coconut Shell Charcoal View 4",
        },
        {
            src: "/api/placeholder/400/300",
            alt: "Coconut Shell Charcoal View 5",
        },
    ],
    shapes: PRODUCT_SHAPES,
    specifications: PRODUCT_SPECIFICATIONS,
};

// Video Gallery Data
export const VIDEO_GALLERY_DATA = {
    main: {
        video: "/videos/main-product.mp4",
        thumbnail: "/images/logo.png",
    },
    carousel: [
        {
            video: "/videos/product-1.mp4",
            thumbnail: "/images/logo.png",
        },
        {
            video: "/videos/product-2.mp4",
            thumbnail: "/images/logo.png",
        },
        {
            video: "/videos/product-3.mp4",
            thumbnail: "/images/logo.png",
        },
        {
            video: "/videos/product-4.mp4",
            thumbnail: "/images/logo.png",
        },
        {
            video: "/videos/product-5.mp4",
            thumbnail: "/images/logo.png",
        },
        {
            video: "/videos/product-6.mp4",
            thumbnail: "/images/logo.png",
        },
    ],
} satisfies { main: VideoItem; carousel: VideoItem[] };
