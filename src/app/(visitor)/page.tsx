import { Fragment } from "react";

import {
    AboutUsSection,
    BannerSection,
    DiscoverOurProductSection,
    MajorityExportDestinationSection,
    GlobalShippingPartnerSection,
    LogoSlideSection,
    PackagingOptionsSection,
    ProductionInfoSection,
    VisitOurFactorySection,
    WhyChooseUsSection,
} from "@/features/home/components";

export default async function Home() {
    return (
        <Fragment>
            <BannerSection />
            <LogoSlideSection />
            <AboutUsSection />
            <WhyChooseUsSection />
            <DiscoverOurProductSection />
            <PackagingOptionsSection />
            <ProductionInfoSection />
            <VisitOurFactorySection />
            <MajorityExportDestinationSection />
            <GlobalShippingPartnerSection />
        </Fragment>
    );
}
