/**
 * About Company Feature - Type Definitions
 */

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
    orderIndex: number;
}

export interface Certificate {
    src: string;
    alt: string;
}

export interface GalleryImage {
    src: string;
    alt: string;
}

export interface VideoReel {
    id: string;
    title?: string;
}

export interface SidebarItem {
    id: string;
    label: string;
}

export interface CompanyLegalData {
    companyName: string;
    ownerName: string;
    address: string;
    established: string;
    products: string;
    productionCapacity: string;
    certification: string;
    registeredNumber: string;
}

export interface SocialLink {
    platform: "facebook" | "instagram" | "linkedin" | "whatsapp";
    url: string;
    icon: React.ComponentType<{ size?: number }>;
}

export type GalleryType = "reel" | "factory" | "product";

export interface GalleryViewerState {
    type: GalleryType;
    index: number;
}
