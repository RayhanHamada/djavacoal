import messages from "@/i18n/messages/en.json";
import { Locales } from "@/configs";

declare module "next-intl" {
  interface AppConfig {
    Locale: Locales;
    Messages: typeof messages;
  }
}
