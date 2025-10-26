import type { Metadata } from "next";

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

export const metadata: Metadata = {
    title: "About Company | CV Djavacoal Indonesia",
    description:
        "Get to know CV Djavacoal Indonesia — a trusted exporter of premium coconut shell charcoal briquettes. Learn about our history, team, global reach, and production excellence.",
    openGraph: {
        title: "About Company | CV Djavacoal Indonesia",
        description:
            "Discover CV Djavacoal Indonesia, a leading supplier of eco-friendly coconut shell charcoal briquettes, trusted worldwide for quality and sustainability.",
        url: "https://www.djavacoal.com/about-company",
        siteName: "CV Djavacoal Indonesia",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "About Company | CV Djavacoal Indonesia",
        description:
            "Learn about CV Djavacoal Indonesia — our story, team, certifications, and dedication to sustainable charcoal production.",
    },
};

export default function AboutCompanyPage() {
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

    return (
        <main className="bg-primary text-white">
            {/* JSON-LD SEO Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Header */}
            <HeaderSection />

            {/* ===== MAIN LAYOUT WRAPPER ===== */}
            <section className="mx-auto max-w-7xl overflow-x-hidden px-6 py-10 md:px-10 md:py-16 lg:mx-0 lg:mr-10 lg:max-w-none lg:px-0 lg:py-0">
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
        </main>
    );
}
