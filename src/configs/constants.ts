export const R2_PATHS = {
  ARTICLES_PHOTO: "articles/photo",
} as const;

export const COOKIE_NAME = {
  LOCALE: "locale",
} as const;

export const LOCALES = {
  EN: "en",
  ID: "id",
} as const;
export const LIST_LOCALES = [LOCALES.EN, LOCALES.ID];
export const DEFAULT_LOCALE = LOCALES.EN;

export type Locales = (typeof LOCALES)[keyof typeof LOCALES];
