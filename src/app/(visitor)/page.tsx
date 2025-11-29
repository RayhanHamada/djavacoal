import { Fragment } from "react";

import {
    AboutUsSection,
    BannerSection,
    DiscoverOurProductSection,
    MajorityExportDestinationSection,
    GlobalShippingPartnerSection,
    LogoSlideSection,
    NewsListSection,
    PackagingOptionsSection,
    ProductionInfoSection,
    VisitOurFactorySection,
    WhyChooseUsSection,
} from "@/features/home/components";
import { getPinnedNewsForHome } from "@/features/home/server";

export default async function Home() {
    const pinnedNews = await getPinnedNewsForHome();

    return (
        <Fragment>
            <div>
                <BannerSection />
                <LogoSlideSection />
                <AboutUsSection />
                <WhyChooseUsSection />
                <DiscoverOurProductSection />
                <PackagingOptionsSection />
                <ProductionInfoSection />
                <VisitOurFactorySection />
                <NewsListSection newsItems={pinnedNews} />
                <MajorityExportDestinationSection />
                <GlobalShippingPartnerSection />
            </div>
        </Fragment>
    );
}
