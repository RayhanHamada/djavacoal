import { LOCALES } from "@/configs";
import messages from "@/i18n/messages/en.json";

type L = (typeof LOCALES)[keyof typeof LOCALES];

declare module "next-intl" {
    interface AppConfig {
        Locale: L;
        Messages: typeof messages;
    }
}
