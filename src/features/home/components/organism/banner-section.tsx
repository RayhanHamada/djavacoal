import { getTranslations } from "next-intl/server";

import { cn } from "@/lib/utils";

export async function BannerSection() {
    const t = await getTranslations();

    return (
        <div className="h-20 w-full">
            <p className="hidden md:block lg:hidden">Banner Section</p>
            <div
                className={cn(
                    "!flex !bg-amber-300", // untuk class yang terlepas screen size nya apa, dia tetap muncul
                    "underline", // untuk class terkecil
                    "md:bg-blue-400 md:font-bold md:no-underline", // untuk class medium,
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
