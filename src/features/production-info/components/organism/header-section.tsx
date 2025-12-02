import Image from "next/image";

import { useTranslations } from "next-intl";

export default function HeaderSection() {
    const t = useTranslations("ProductionInfo.header");

    return (
        <section className="relative w-full overflow-hidden bg-[#1C1C1C] text-white">
            {/* Background Image */}
            <div className="relative h-48 w-full md:h-72">
                <Image
                    src="/images/bg-banner-ProductionProcess.png"
                    alt={t("bannerAlt")}
                    fill
                    className="object-cover object-center"
                    priority
                />

                {/* Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <h1 className="text-2xl font-semibold italic md:text-4xl">
                        {t("title")}
                    </h1>
                </div>
            </div>
            {/* 🔹 Garis bawah */}
            <div className="absolute bottom-0 left-0 h-[1px] w-full bg-[#474747]" />
        </section>
    );
}
