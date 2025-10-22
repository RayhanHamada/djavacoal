"use client";

import { Globe, MapPin, TrendingUp } from "lucide-react";

import { CountryTag, ProgressBar, SectionHeading, StatCard } from "../atoms";

const exportDestinations = [
    {
        region: "Middle East",
        countries: ["Saudi Arabia", "Lebanon", "Iraq", "Turkey"],
        percentage: 45,
        colorFrom: "from-[#EFA12D]",
        colorTo: "to-[#D68F1F]",
    },
    {
        region: "Asia Pacific",
        countries: ["Japan", "Korea", "Australia"],
        percentage: 30,
        colorFrom: "from-[#4CAF50]",
        colorTo: "to-[#388E3C]",
    },
    {
        region: "Americas",
        countries: ["USA", "Brazil"],
        percentage: 15,
        colorFrom: "from-[#2196F3]",
        colorTo: "to-[#1976D2]",
    },
    {
        region: "Europe",
        countries: ["Germany", "Others"],
        percentage: 10,
        colorFrom: "from-[#9C27B0]",
        colorTo: "to-[#7B1FA2]",
    },
];

const stats = [
    {
        icon: Globe,
        value: "20+",
        label: "Countries Worldwide",
    },
    {
        icon: MapPin,
        value: "4",
        label: "Major Regions",
    },
    {
        icon: TrendingUp,
        value: "100%",
        label: "Export Oriented",
    },
];

export function MajorityExportDestinationSection() {
    return (
        <section className="relative w-full overflow-hidden bg-[#1D1D1D] px-5 py-16 md:px-10 md:py-20 lg:px-20 lg:py-24">
            {/* Section Header */}
            <div className="mb-12 md:mb-16">
                <SectionHeading
                    title="Export Destinations"
                    subtitle="Delivering premium charcoal products to over 20 countries across four major regions worldwide"
                    variant="center"
                />
            </div>

            {/* Stats Cards */}
            <div className="mx-auto mb-12 grid max-w-5xl grid-cols-1 gap-6 md:mb-16 md:grid-cols-3">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Regional Breakdown */}
            <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
                    {exportDestinations.map((destination, index) => (
                        <div
                            key={index}
                            className="bg-gradient-radial group relative overflow-hidden rounded-[20px] border border-[#4F4F4F] from-[#151515] to-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#EFA12D] md:p-8"
                        >
                            {/* Region Header */}
                            <div className="mb-6 flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="mb-2 font-['Josefin_Sans'] text-[22px] font-bold text-white uppercase md:text-[24px]">
                                        {destination.region}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {destination.countries.map(
                                            (country, idx) => (
                                                <CountryTag
                                                    key={idx}
                                                    name={country}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                                <div className="ml-4 text-right">
                                    <p className="font-['Josefin_Sans'] text-[32px] font-bold text-[#EFA12D] md:text-[36px]">
                                        {destination.percentage}%
                                    </p>
                                    <p className="font-['Open_Sans'] text-[11px] text-[#C6C6C6] uppercase">
                                        of Exports
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <ProgressBar
                                percentage={destination.percentage}
                                colorFrom={destination.colorFrom}
                                colorTo={destination.colorTo}
                            />
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 flex flex-col items-center gap-4 text-center md:mt-16">
                    <p className="max-w-2xl font-['Open_Sans'] text-[15px] leading-relaxed text-[#C6C6C6] md:text-[16px]">
                        Our commitment to quality and customer satisfaction has
                        enabled us to build strong partnerships across the
                        globe. We continue to expand our reach to serve more
                        markets worldwide.
                    </p>
                </div>
            </div>
        </section>
    );
}
