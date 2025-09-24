import { LOCALES } from "@/configs";
import { getUserLocale, onChangeLocale, setUserLocale } from "@/utils/locale";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations();

  return (
    <div className="">
      {t("HomePage.title")}
      <button onClick={onChangeLocale}>Change Locale</button>
    </div>
  );
}
