export const KV_KEYS = {
    /**
     * should be array of wide photos for home page carousel
     */
    HOME_CAROUSEL_PHOTO: "home_carousel_photo",

    /**
     * single photo of factory visit section
     */
    VISIT_OUR_FACTORY_PHOTO: "visit_our_factory_photo",

    /**
     * single youtube video url of who we are section
     */
    WHO_WE_ARE_VIDEO: "who_we_are_video",

    /**
     * single photo of factory section
     */
    FACTORY_PHOTO: "factory_photo",

    /**
     * should be array of youtube reel links
     */
    REELS: "reels",

    /**
     * should be array of photos for factory gallery section
     */
    FACTORY_GALLERY_PHOTOS: "factory_gallery_photos",

    /**
     * should be array of photos for product gallery section
     */
    PRODUCT_GALLERY_PHOTOS: "product_gallery_photos",

    /**
     * social media links
     */
    FACEBOOK_LINK: "footer:facebook_link",
    LINKEDIN_LINK: "footer:linkedin_link",
    INSTAGRAM_LINK: "footer:instagram_link",
    TIKTOK_LINK: "footer:tiktok_link",

    /**
     * address informations
     */
    MAPS_LINK: "footer:maps_link",
    ADDRESS_LINE: "footer:address_line",

    /**
     * phone number
     */
    WHATSAPP_NUMBER: "footer:whatsapp_number",

    /**
     * email address
     */
    EMAIL_ADDRESS: "footer:email_address",

    /**
     * caches
     */
    HOME_CONTENT_CACHE: "cache:home_content",
} as const;

type KVKey = typeof KV_KEYS;
export type KVKeys = KVKey[keyof KVKey];
