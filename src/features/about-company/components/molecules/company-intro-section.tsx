"use client";

import { useTranslations } from "next-intl";

import { useVideoPlayer } from "../../hooks";
import {
    CompanyLegalTable,
    ExportCountriesGrid,
    SocialMediaLinks,
    VideoPlayer,
} from "../atoms";
import { useAboutCompanyContentAPI } from "@/features/public-api/hooks";

export default function CompanyIntroSection() {
    const t = useTranslations("AboutCompany.companyIntro");
    const { isPlaying, play } = useVideoPlayer();
    const { data: aboutCompanyContentData } = useAboutCompanyContentAPI();

    return (
        <section
            id="cv-djavacoal-indonesia"
            className="mt-2 scroll-mt-28 space-y-4 rounded-xl bg-[#222222] p-5 lg:p-10"
        >
            <header className="mb-[30px]">
                <div className="mb-2 flex items-center gap-3">
                    <div className="h-px w-8 bg-white" />
                    <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                        {t("subtitle")}
                    </p>
                </div>
                <h2 className="text-xl leading-snug font-semibold text-white md:text-2xl">
                    {t("title")}
                </h2>
                <p className="font-medium text-[#EFA12D]">{t("tagline")}</p>
                <div className="mt-4 h-px bg-[#3A3A3A]" />
            </header>

            <div className="flex w-full">
                <VideoPlayer
                    src={aboutCompanyContentData?.data.about_us_video_url ?? ""}
                    title={t("videoTitle")}
                    isPlaying={isPlaying}
                    onPlay={play}
                />
            </div>

            {aboutCompanyContentData && (
                <SocialMediaLinks
                    facebookLink={aboutCompanyContentData.data.facebook_link}
                    instagramLink={aboutCompanyContentData.data.instagram_link}
                    linkedinLink={aboutCompanyContentData.data.linkedin_link}
                />
            )}

            <div className="space-y-4 text-justify leading-relaxed text-gray-200">
                <p>{t("paragraph1")}</p>
                <p>{t("paragraph2")}</p>
                <p>{t("paragraph3")}</p>
                <p>{t("paragraph4")}</p>
            </div>

            <CompanyLegalTable />

            <ExportCountriesGrid />
        </section>
    );
}
