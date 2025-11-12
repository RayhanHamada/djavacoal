import type { Metadata } from "next";

import { getLocale, getTranslations } from "next-intl/server";

import { JSONLDScript } from "@/components/molecules/json-ld-script";
import { LOCALES } from "@/configs";
import ProductionSidebar from "@/features/production-info/components/molecules/production-sidebar";
import {
    ProcessSection,
    MOQSection,
    ShipmentSection,
    PackagingSection,
    FAQSection,
} from "@/features/production-info/components/organism";
import HeaderSection from "@/features/production-info/components/organism/header-section";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("ProductionInfo.metadata");

    return {
        title: t("title"),
        description: t("description"),
        openGraph: {
            title: t("title"),
            description: t("description"),
            url: "https://www.djavacoal.com/production-info",
            siteName: "CV Djavacoal Indonesia",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: t("title"),
            description: t("description"),
        },
    };
}

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Production Info - CV Djavacoal Indonesia",
    description:
        "Learn how we craft premium coconut shell charcoal briquettes for global markets, including MOQ, shipment terms, and packaging.",
    url: "https://www.djavacoal.com/production-info",
    publisher: {
        "@type": "Organization",
        name: "CV Djavacoal Indonesia",
        url: "https://www.djavacoal.com",
    },
};

export default async function ProductionInfoPage() {
    const locale = await getLocale();

    return (
        <main className="bg-primary text-white">
            {/* JSON-LD */}
            <JSONLDScript data={jsonLd} />

            {/* Hero Header */}
            <HeaderSection />

            {/* ===== MAIN LAYOUT WRAPPER ===== */}
            <section
                className={cn(
                    `mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-16 lg:mx-0 lg:max-w-none lg:px-0 lg:py-0`,
                    locale === LOCALES.AR ? "lg:ml-10" : "lg:mr-10"
                )}
            >
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
                    {/* === LEFT SIDEBAR === */}
                    <div className="bg-[#222222] lg:py-16">
                        <ProductionSidebar />
                    </div>

                    {/* === RIGHT CONTENT === */}
                    <div className="space-y-12 lg:py-16">
                        <ProcessSection />
                        <MOQSection />
                        <ShipmentSection />
                        <PackagingSection />
                        <FAQSection />
                    </div>
                </div>
            </section>
        </main>
    );
}
