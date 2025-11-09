"use client";

import { useVideoPlayer } from "../../hooks";
import {
    CompanyLegalTable,
    ExportCountriesGrid,
    SocialMediaLinks,
    VideoPlayer,
} from "../atoms";
import { useAboutCompanyContentAPI } from "@/features/public-api/hooks";

export default function CompanyIntroSection() {
    const { isPlaying, play } = useVideoPlayer();
    const { data } = useAboutCompanyContentAPI();

    return (
        <section
            id="company-intro"
            className="mt-2 scroll-mt-28 space-y-4 rounded-xl bg-[#222222] p-5 lg:p-10"
        >
            <header className="mb-2">
                <div className="mb-2 flex items-center gap-3">
                    <div className="h-px w-8 bg-white" />
                    <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                        Production Process
                    </p>
                </div>
                <h2 className="text-xl leading-snug font-semibold text-white md:text-2xl">
                    How We Craft Quality Charcoal for Global Markets
                </h2>
                <p className="font-medium text-[#EFA12D]">
                    Leading Indonesian Charcoal Manufacturer
                </p>
                <div className="mt-4 h-px bg-[#3A3A3A]" />
            </header>

            <div className="flex w-full">
                <VideoPlayer
                    src={data?.data.about_us_video_url ?? ""}
                    title="Production Process Coconut Charcoal Briquette From Djavacoal Indonesia"
                    isPlaying={isPlaying}
                    onPlay={play}
                />
            </div>

            <SocialMediaLinks />

            <div className="space-y-4 text-justify leading-relaxed text-gray-200">
                <p>
                    <strong>CV Djavacoal Indonesia</strong> is a trusted
                    supplier and exporter of premium charcoal products,
                    specializing in coconut shell charcoal briquettes, BBQ
                    briquettes, sawdust charcoal briquettes, and natural
                    hardwood charcoal. With years of expertise in the charcoal
                    industry, we are committed to delivering excellence through
                    innovation, strict quality standards, and reliable service.
                </p>
                <p>
                    We operate with three partner factories across Java Island,
                    Indonesia, strategically located with direct access to major
                    international ports in Jakarta, Semarang, and Surabaya. This
                    ensures smooth logistics, competitive shipping costs, and
                    timely delivery for our global partners.
                </p>
                <p>
                    At Djavacoal, quality is our priority. We carefully select
                    only the best raw materials, ensuring every product meets
                    international standards for performance, long-lasting
                    burning time, and eco-friendly characteristics. Through
                    advanced production methods and rigorous quality control, we
                    guarantee consistency and reliability in every shipment.
                </p>
                <p>
                    Beyond supplying charcoal, we proudly serve the
                    international market with OEM and private label services,
                    offering customized briquette shapes, packaging, and
                    branding to fit our clients&apos; unique needs. Our vision
                    is not only to deliver high-quality products, but also to
                    establish long-term partnerships built on trust,
                    professionalism, and mutual growth.
                </p>
            </div>

            <CompanyLegalTable />

            <ExportCountriesGrid />
        </section>
    );
}
