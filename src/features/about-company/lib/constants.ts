import type {
    Certificate,
    GalleryImage,
    SidebarItem,
    TeamMember,
} from "./types";

/**
 * About Company Feature - Constants
 */

// Sidebar Navigation Items
export const SIDEBAR_ITEMS: SidebarItem[] = [
    { id: "company-intro", label: "CV. Djavacoal Indonesia" },
    { id: "team", label: "Djavacoal's Team" },
    { id: "global-market", label: "What We Do?" },
    { id: "certificates", label: "Legal & Certificate" },
    { id: "factory", label: "Factory" },
    { id: "gallery", label: "Our Gallery" },
];

// Certificate Data (Static - managed manually)
export const CERTIFICATES: Certificate[] = [
    {
        src: "/images/certificates/cert1.png",
        alt: "NIB / Business Registration Number",
    },
    {
        src: "/images/certificates/cert2.png",
        alt: "Report Of Analysis (ROA)",
    },
    {
        src: "/images/certificates/cert3.png",
        alt: "Self-Heating Test (SHT) - 1",
    },
    {
        src: "/images/certificates/cert4.png",
        alt: "Self-Heating Test (SHT) - 2",
    },
    {
        src: "/images/certificates/cert5.png",
        alt: "Self-Heating Test (SHT) - 3",
    },
    {
        src: "/images/certificates/cert6.png",
        alt: "Material Safety Data Sheet (MSDS) - 1",
    },
    {
        src: "/images/certificates/cert7.png",
        alt: "Material Safety Data Sheet (MSDS) - 2",
    },
    {
        src: "/images/certificates/cert8.png",
        alt: "Material Safety Data Sheet (MSDS)",
    },
];

// Export Country Codes (ISO 3166-1 alpha-2)
export const EXPORT_COUNTRIES = [
    "SA", // Saudi Arabia
    "LB", // Lebanon
    "IR", // Iran
    "IQ", // Iraq
    "BH", // Bahrain
    "JO", // Jordan
    "KW", // Kuwait
    "OM", // Oman
    "YE", // Yemen
    "TR", // Turkey
    "JP", // Japan
    "KR", // South Korea
    "AU", // Australia
    "DE", // Germany
    "BE", // Belgium
    "ES", // Spain
    "US", // United States
    "BR", // Brazil
    "RU", // Russia
    "GN", // Guinea
    "SL", // Sierra Leone
    "IN", // India
    "PK", // Pakistan
];

// Company Legal Data
export const COMPANY_LEGAL_DATA = {
    companyName: "CV Djavacoal Indonesia",
    ownerName: "Yoga Indra Pradipta N",
    address: "Jl. P. Ilir Sari V No. 15, Jawa Barat, Indonesia",
    established: "2018",
    products: "Charcoal Products",
    productionCapacity: "250 Tons / Month",
    certification: "Charcoal Products",
    registeredNumber: "NIB – 0220001680488",
};

// Social Media Links
export const SOCIAL_LINKS = {
    facebook: "https://www.facebook.com/djavacoal/",
    instagram: "https://www.instagram.com/djavacharcoal",
    linkedin: "https://www.linkedin.com/company/djavacoal-indonesia/",
    whatsapp: "https://wa.me/6282126572600",
};

// YouTube Video IDs
export const COMPANY_VIDEO_ID = "NWO_S1Kh6U0";

export const GALLERY_REELS = [
    "EouOlxd_DlU",
    "q98uLQT6hh4",
    "4c4w0Bu8a1I",
    "cGAVGlKIOt4",
    "9CiCASBhKPM",
    "EouOlxd_DlU",
    "q98uLQT6hh4",
    "4c4w0Bu8a1I",
    "cGAVGlKIOt4",
    "9CiCASBhKPM",
];

// Gallery Images (Static for now - can be made dynamic later)
export const FACTORY_GALLERY: GalleryImage[] = [
    { src: "/images/factory-gallery1.png", alt: "Factory view 1" },
    { src: "/images/factory-gallery-large1.png", alt: "Factory interior 1" },
    { src: "/images/factory-gallery-large2.png", alt: "Factory interior 2" },
    { src: "/images/factory-gallery-large3.png", alt: "Factory interior 3" },
    { src: "/images/factory-gallery-large1.png", alt: "Factory workspace 1" },
    { src: "/images/factory-gallery-large2.png", alt: "Factory workspace 2" },
    { src: "/images/factory-gallery-large3.png", alt: "Factory workspace 3" },
];

export const PRODUCT_GALLERY: GalleryImage[] = [
    { src: "/images/product-gallery1.png", alt: "Product display 1" },
    { src: "/images/product-gallery-large1.png", alt: "Product showcase 1" },
    { src: "/images/product-gallery-large2.png", alt: "Product showcase 2" },
    { src: "/images/product-gallery-large3.png", alt: "Product showcase 3" },
    { src: "/images/product-gallery-large1.png", alt: "Product detail 1" },
    { src: "/images/product-gallery-large2.png", alt: "Product detail 2" },
    { src: "/images/product-gallery-large3.png", alt: "Product detail 3" },
];

// Animation Settings
export const SCROLL_SPY_CONFIG = {
    threshold: 0.3,
    rootMargin: "0px 0px -40% 0px",
    scrollOffset: -20,
};

// Team Members (simplified for static display - pending real data integration)
export const TEAM_MEMBERS: Omit<TeamMember, "id" | "orderIndex">[] = [
    {
        name: "Yoga Indraprana",
        role: "President Directors",
        image: "/images/owner-djavacoal.png",
    },
    {
        name: "Yoga Indraprana",
        role: "President Directors",
        image: "/images/owner-djavacoal.png",
    },
    {
        name: "Yoga Indraprana",
        role: "President Directors",
        image: "/images/owner-djavacoal.png",
    },
    {
        name: "Yoga Indraprana",
        role: "President Directors",
        image: "/images/owner-djavacoal.png",
    },
    {
        name: "Yoga Indraprana",
        role: "President Directors",
        image: "/images/owner-djavacoal.png",
    },
    {
        name: "Yoga Indraprana",
        role: "President Directors",
        image: "/images/owner-djavacoal.png",
    },
    {
        name: "Yoga Indraprana",
        role: "President Directors",
        image: "/images/owner-djavacoal.png",
    },
    {
        name: "Yoga Indraprana",
        role: "President Directors",
        image: "/images/owner-djavacoal.png",
    },
];

// UI Constants
export const WATERMARK_IMAGE = "/images/watermark-legal.png";
export const LOGO_IMAGE = "/svgs/logo.svg";
export const THUMBNAIL_IMAGE = "/images/thumbnail-yt.png";
export const FACTORY_IMAGE = "/images/factory1.png";
export const BANNER_IMAGE = "/images/bg-banner-OurProduct.png";
