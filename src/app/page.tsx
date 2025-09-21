import { LOCALES } from "@/configs";
import { getUserLocale, setUserLocale } from "@/utils/locale";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations();

  async function onChangeLocale() {
    "use server";
    const locale = await getUserLocale();

    setUserLocale(locale === LOCALES.EN ? LOCALES.ID : LOCALES.EN);
  }

  return (
    <div className="">
      <div>{t("HomePage.title")}</div>
      <button onClick={onChangeLocale}>Change Locale</button>
    </div>
  );
}
