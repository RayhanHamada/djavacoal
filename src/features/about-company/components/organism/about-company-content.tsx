import {
    CertificateSection,
    CompanyIntroSection,
    FactorySection,
    GallerySection,
    GlobalMarketSection,
    TeamSection,
} from "../molecules";

export default function AboutCompanyContent() {
    return (
        <div className="space-y-12 overflow-x-hidden lg:py-16">
            <CompanyIntroSection />
            <TeamSection />
            <GlobalMarketSection />
            <CertificateSection />
            <FactorySection />
            <GallerySection />
        </div>
    );
}
