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
