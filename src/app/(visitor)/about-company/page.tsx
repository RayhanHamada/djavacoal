import { getLocale } from "next-intl/server";

import { JSONLDScript } from "@/components/molecules/json-ld-script";
import { LOCALES } from "@/configs";
import {
    CompanyIntroSection,
    TeamSection,
    GlobalMarketSection,
    CertificateSection,
    FactorySection,
    GallerySection,
} from "@/features/about-company/components/molecules";
import AboutSidebar from "@/features/about-company/components/molecules/about-sidebar";
import HeaderSection from "@/features/about-company/components/organism/header-section";
import { cn } from "@/lib/utils";

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "About Company - CV Djavacoal Indonesia",
    description:
        "Get to know CV Djavacoal Indonesia — our story, leadership team, certifications, and production excellence in coconut charcoal briquettes.",
    url: "https://www.djavacoal.com/about-company",
    publisher: {
        "@type": "Organization",
        name: "CV Djavacoal Indonesia",
        url: "https://www.djavacoal.com",
    },
};

export default async function AboutCompanyPage() {
    const locale = await getLocale();
    return (
        <div className="bg-primary text-white">
            {/* JSON-LD SEO Structured Data */}
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
                        <AboutSidebar />
                    </div>

                    {/* === RIGHT CONTENT === */}
                    <div className="space-y-12 overflow-x-hidden lg:py-16">
                        <CompanyIntroSection />
                        <TeamSection />
                        <GlobalMarketSection />
                        <CertificateSection />
                        <FactorySection />
                        <GallerySection />
                    </div>
                </div>
            </section>
        </div>
    );
}
