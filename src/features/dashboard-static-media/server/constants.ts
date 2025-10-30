import { KV_KEYS } from "@/adapters/kv/constants";

export const STATIC_MEDIA_KV_NAMESPACES = [
    KV_KEYS.HOME_CAROUSEL_PHOTO,
    KV_KEYS.VISIT_OUR_FACTORY_PHOTO,
    KV_KEYS.FACTORY_PHOTO,
    KV_KEYS.REELS,
    KV_KEYS.FACTORY_GALLERY_PHOTOS,
    KV_KEYS.PRODUCT_GALLERY_PHOTOS,
] as const;

const PREFIXES = {
    CAROUSEL: "carousel",
    FACTORY_VISIT: "factory-visit",
    FACTORY_PHOTO: "factory-photo",
    REELS: "reels",
    FACTORY_GALLERY: "factory-gallery",
    PRODUCT_GALLERY: "product-gallery",
} as const;

export const STATIC_MEDIA_PREFIXES = [
    PREFIXES.CAROUSEL,
    PREFIXES.FACTORY_VISIT,
    PREFIXES.FACTORY_PHOTO,
    PREFIXES.REELS,
    PREFIXES.FACTORY_GALLERY,
    PREFIXES.PRODUCT_GALLERY,
] as const;
