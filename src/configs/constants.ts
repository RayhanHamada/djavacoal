export const R2_PATHS = {
  ARTICLES_PHOTO: "/articles",
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

export const TIME_STRING_FORMAT = {
  DD_MMMM_YYYY: "dd MMMM yyyy",
};

export type MenuItems = {
  label: string;
  href?: string;
  submenus?: MenuItems[];
};

export const NAVIGATION_MENUS: MenuItems[] = [
  {
    label: "Home",
    href: "/",
  },
];

export type Locales = (typeof LOCALES)[keyof typeof LOCALES];
