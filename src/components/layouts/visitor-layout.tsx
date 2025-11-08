import { PropsWithChildren } from "react";

import { VisitorFooter, VisitorNavbar } from "@/components/organism";
import { LOCALES } from "@/configs";
import { getUserLocale } from "@/lib/locale";

type Props = PropsWithChildren;

export default async function VisitorLayout({ children }: Props) {
    const locale = await getUserLocale();

    return (
        <div className="flex min-h-screen flex-col bg-[#151515]">
            <VisitorNavbar />

            {/* main contents */}
            <main
                className="flex w-full flex-col pt-24"
                dir={locale === LOCALES.AR ? "rtl" : "ltr"}
            >
                {children}
            </main>

            {/* spacer */}
            <div className="flex-1" />

            {/* footer */}
            <VisitorFooter />
        </div>
    );
}
