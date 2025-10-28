"use client";

import Image from "next/image";
import Link from "next/link";

const packagingOptions = [
    {
        id: "full-packaging",
        name: "Full Packaging",
        description:
            "Complete packaging solution with branded boxes, ensuring maximum protection and premium presentation for retail distribution.",
        image: "/images/pack-full.png",
        features: ["Branded Boxes", "Retail Ready", "Maximum Protection"],
    },
    {
        id: "bulk-packaging",
        name: "Bulk Packaging",
        description:
            "Efficient bulk packaging in large containers, ideal for wholesale distribution and commercial use with cost-effective solutions.",
        image: "/images/pack-bulk.png",
        features: ["Large Containers", "Cost Effective", "Wholesale Ready"],
    },
    {
        id: "bulk-loose-packaging",
        name: "Bulk Loose Packaging",
        description:
            "Flexible loose bulk packaging for industrial applications, offering the most economical option for large-volume orders.",
        image: "/images/pack-loose.png",
        features: ["Industrial Use", "Most Economical", "Large Volume"],
    },
];

export function PackagingOptionsSection() {
    return (
        <section className="relative w-full overflow-hidden bg-[#1D1D1D] px-5 py-16 md:px-10 md:py-20 lg:px-20 lg:py-24">
            {/* Section Header */}
            <div className="mb-12 flex flex-col items-center justify-center md:mb-16">
                <div className="mb-2 flex items-center gap-3">
                    <div className="h-0.5 w-[50px] bg-[#EFA12D]" />
                    <h2 className="font-['Josefin_Sans'] text-[28px] font-bold text-white uppercase md:text-[36px] lg:text-[42px]">
                        Packaging Options
                    </h2>
                </div>
                <p className="mt-3 max-w-2xl text-center font-['Open_Sans'] text-[14px] text-[#C6C6C6] md:text-[16px]">
                    Choose from our flexible packaging solutions tailored to
                    your business needs
                </p>
            </div>

            {/* Packaging Grid */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
                {packagingOptions.map((option) => (
                    <div
                        key={option.id}
                        className="group bg-gradient-radial relative overflow-hidden rounded-[20px] border border-[#4F4F4F] from-[#151515] to-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#EFA12D]"
                    >
                        {/* Package Image */}
                        <div className="relative mb-6 flex h-[250px] items-center justify-center overflow-hidden rounded-[15px] bg-[#151515] md:h-[280px]">
                            <Image
                                src={option.image}
                                alt={option.name}
                                width={400}
                                height={400}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        {/* Package Info */}
                        <div className="space-y-4">
                            <h3 className="font-['Josefin_Sans'] text-[22px] font-bold text-white uppercase md:text-[24px]">
                                {option.name}
                            </h3>
                            <p className="font-['Open_Sans'] text-[14px] leading-relaxed text-[#C6C6C6]">
                                {option.description}
                            </p>

                            {/* Features List */}
                            <ul className="space-y-2">
                                {option.features.map((feature, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2 font-['Open_Sans'] text-[13px] text-[#EFA12D]"
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M13.3334 4L6.00002 11.3333L2.66669 8"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {/* View Details Button */}
            <div className="mt-12 flex justify-center md:mt-16">
                <Link
                    href="/production-info#packaging"
                    className="rounded-[40px] border-2 border-[#EFA12D] bg-transparent px-8 py-3 font-['Open_Sans'] text-[14px] font-semibold text-[#EFA12D] uppercase transition-all hover:bg-[#EFA12D] hover:text-[#151515] md:px-10 md:py-4 md:text-[16px]"
                >
                    View Packaging Details
                </Link>
            </div>
        </section>
    );
}
