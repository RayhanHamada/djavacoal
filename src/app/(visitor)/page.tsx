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
import { Fragment } from "react";

export default async function Home() {
  return (
    <Fragment>
      <div className="mx-auto mb-20 mt-10 max-w-2xl bg-primary px-4 text-center sm:mb-32 sm:mt-32 sm:px-6 lg:px-8">
        <h1 className="font-bold text-h1 sm:text-4xl" dir="rtl">
          شحذ طاقتك مع الحل الأمثل للطاقة النظيفة
        </h1>
        <h1 className="font-bold text-h1-size text-secondary sm:text-4xl">
          Djavacoal Indonesia:
        </h1>
        <h1 className="font-bold text-h1 sm:text-4xl" dir="rtl">
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
