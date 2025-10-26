import CertificateSection from "../molecules/certificate-section";
import CompanyIntroSection from "../molecules/company-intro-section";
import FactorySection from "../molecules/factory-section";
import GallerySection from "../molecules/gallery-section";
import GlobalMarketSection from "../molecules/global-market-section";
import TeamSection from "../molecules/team-section";

export default function AboutCompanyContent() {
    return (
        <div className="flex flex-col space-y-12 leading-relaxed text-gray-200 lg:space-y-16">
            <CompanyIntroSection />
            <TeamSection />
            <GlobalMarketSection />
            <CertificateSection />
            <FactorySection />
            <GallerySection />
        </div>
    );
}
