"use client";

import { useRef } from "react";

import Image from "next/image";

import { FEATURES } from "../../lib/constants";

/**
 * WhyChooseUsSection component - Displays key features and benefits
 * Horizontally scrollable feature cards on mobile/tablet, centered on desktop
 */
export function WhyChooseUsSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <section className="relative w-full overflow-hidden bg-[url('/images/bg-packaging-option.png')] bg-cover bg-center bg-no-repeat py-20 md:py-28 lg:py-32">
            {/* ✅ Top Border Line */}
            <div className="absolute top-0 left-0 h-px w-full bg-[#EFA12D]" />

            {/* Title */}
            <div className="mb-10 flex flex-col items-start justify-center px-5 md:px-10 lg:px-60">
                <div className="flex items-center gap-3">
                    <div className="h-0.5 w-[50px] bg-[#EFA12D]" />
                    <h2 className="font-['Josefin_Sans'] text-[26px] font-bold text-white md:text-[34px] lg:text-[40px]">
                        Why <span className="text-[#EFA12D]">Choose</span> Us?
                    </h2>
                </div>
            </div>

            {/* Scrollable Feature Cards */}
            <div className="px-5 md:px-10 lg:px-[100px]">
                <div
                    ref={scrollRef}
                    className="scrollbar-hide flex justify-start gap-6 overflow-x-auto scroll-smooth pb-4 2xl:justify-center"
                >
                    {FEATURES.map((feature, index) => (
                        <div
                            key={index}
                            className="group flex h-[269px] w-[197.5px] shrink-0 flex-col items-center justify-center border border-[#EFA12D40] bg-[radial-gradient(circle_at_center,#000_0%,#171717_50%,#F5980D30_90%)] px-4 py-6 backdrop-blur-sm transition-all duration-300 hover:border-[#EFA12D] hover:shadow-[0_0_10px_#EFA12D50]"
                        >
                            <div className="relative h-[120px] w-full md:h-[140px] lg:h-[150px]">
                                <Image
                                    src={feature.icon}
                                    alt={feature.title}
                                    fill
                                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <h3 className="mt-3 text-center font-['Josefin_Sans'] text-[12px] font-semibold text-[#EFA12D] uppercase transition-colors group-hover:text-white md:text-[13px]">
                                {feature.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
