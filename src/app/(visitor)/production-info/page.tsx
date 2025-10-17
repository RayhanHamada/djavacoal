import type { Metadata } from "next";
import HeaderSection from "@/features/production-info/components/organism/header-section";
import ProductionSidebar from "@/features/production-info/components/molecules/production-sidebar";
import {
  ProcessSection,
  MOQSection,
  ShipmentSection,
  PackagingSection,
  FAQSection,
} from "@/features/production-info/components/organism";

export const metadata: Metadata = {
  title: "Production Info | CV Djavacoal Indonesia",
  description:
    "Learn how CV Djavacoal Indonesia crafts premium charcoal briquettes—from raw material selection to packaging, shipment terms, and FAQs.",
  openGraph: {
    title: "Production Info | CV Djavacoal Indonesia",
    description:
      "Premium coconut shell charcoal briquettes — production process, MOQ & payment terms, shipment terms, and packaging options.",
    url: "https://www.djavacoal.com/production-info",
    siteName: "CV Djavacoal Indonesia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Production Info | CV Djavacoal Indonesia",
    description:
      "Premium coconut shell charcoal briquettes — production process, MOQ & terms, shipment, packaging, FAQ.",
  },
};

export default function ProductionInfoPage() {
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

  return (
    <main className="bg-[#161616] text-white">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <HeaderSection />

      {/* ===== MAIN LAYOUT WRAPPER ===== */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-16 lg:max-w-none lg:mx-0 lg:px-0 lg:mr-10 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 ">
          {/* === LEFT SIDEBAR === */}
          <div className="lg:py-16 bg-[#222222] ">
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
