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
            <div className="bg-primary mx-auto mt-10 mb-20 max-w-2xl px-4 text-center sm:mt-32 sm:mb-32 sm:px-6 lg:px-8">
                <h1 className="text-h1 font-bold sm:text-4xl" dir="rtl">
                    شحذ طاقتك مع الحل الأمثل للطاقة النظيفة
                </h1>
                <h1 className="text-h1-size text-secondary font-bold sm:text-4xl">
                    Djavacoal Indonesia:
                </h1>
                <h1 className="text-h1 font-bold sm:text-4xl" dir="rtl">
                    شحذ طاقتك مع
                </h1>
            </div>
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
