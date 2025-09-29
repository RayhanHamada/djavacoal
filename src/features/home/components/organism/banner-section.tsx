import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export async function BannerSection() {
  const t = await getTranslations();

  return (
    <div className="w-full h-20">
      <p className="hidden md:block lg:hidden">Banner Section</p>
      <div
        className={cn(
          "!flex !bg-amber-300", // untuk class yang terlepas screen size nya apa, dia tetap muncul
          "underline", // untuk class terkecil
          "md:font-bold md:bg-blue-400 md:no-underline", // untuk class medium,
          "lg:font-extrabold" // untuk class large
        )}
      >
        <div>Kotak 1</div>
        <div>Kotak 2</div>
        <div>Kotak 3</div>
        <div>Kotak 4</div>
      </div>
      <p>{t("HomePage.title")}</p>
    </div>
  );
}
