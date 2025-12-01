export const R2_PATHS = {
    ARTICLES_PHOTO: "/articles",
} as const;

export const COOKIE_NAME = {
    LOCALE: "locale",
} as const;

export const LOCALES = {
    EN: "en",
    AR: "ar",
} as const;
export const LIST_LOCALES = [LOCALES.EN, LOCALES.AR];
export const DEFAULT_LOCALE = LOCALES.EN;

export const TIME_STRING_FORMAT = {
    DD_MMMM_YYYY: "dd MMMM yyyy",
} as const;

export const SECTIONS_ELEMENTS_ID = {
    ABOUT_COMPANY: {
        CV_DJAVACOAL_INDONESIA: "cv-djavacoal-indonesia",
        DJAVACOALS_TEAM: "djavacoals-team",
        WHAT_WE_DO: "what-we-do",
        LEGAL_CERTIFICATE: "legal-certificate",
        FACTORY: "factory",
        OUR_GALLERY: "our-gallery",
    },
    OUR_PRODUCTS: {
        PRODUCTS_LIST: "products-list",
    },
    PRODUCTION_INFO: {
        PRODUCTION_PROCESS: "production-process",
        MOQ_PAYMENT_TERMS: "moq-payment-terms",
        SHIPMENT_TERMS: "shipment-terms",
        PACKAGING_INFO: "packaging-info",
        FAQS: "faqs",
    },
} as const;
