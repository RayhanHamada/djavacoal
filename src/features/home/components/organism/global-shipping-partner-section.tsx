"use client";

import Image from "next/image";

const shippingPartners = [
    {
        id: "pil",
        name: "PIL (Pacific International Lines)",
        logo: "/images/shipping-pil.png",
        width: 1381,
        height: 576,
    },
    {
        id: "msc",
        name: "MSC (Mediterranean Shipping Company)",
        logo: "/images/shipping-msc.png",
        width: 560,
        height: 560,
    },
    {
        id: "cma",
        name: "CMA CGM",
        logo: "/images/shipping-cma-7a75cb.png",
        width: 847,
        height: 576,
    },
    {
        id: "esl",
        name: "ESL Shipping",
        logo: "/images/shipping-esl.png",
        width: 578,
        height: 576,
    },
    {
        id: "asyad",
        name: "Asyad Shipping",
        logo: "/images/shipping-asyad.png",
        width: 1200,
        height: 448,
    },
    {
        id: "ovp",
        name: "OVP Shipping",
        logo: "/images/shipping-ovp.png",
        width: 875,
        height: 577,
    },
    {
        id: "sitc",
        name: "SITC Container Lines",
        logo: "/images/shipping-sitc.png",
        width: 1057,
        height: 576,
    },
];

export function GlobalShippingPartnerSection() {
    return (
        <section className="relative w-full overflow-hidden bg-[#151515] px-5 py-16 md:px-10 md:py-20 lg:px-20 lg:py-24">
            {/* Section Header */}
            <div className="mb-12 flex flex-col items-center justify-center md:mb-16">
                <div className="mb-2 flex items-center gap-3">
                    <div className="h-0.5 w-[50px] bg-[#EFA12D]" />
                    <h2 className="font-['Josefin_Sans'] text-[28px] font-bold text-white uppercase md:text-[36px] lg:text-[42px]">
                        Global Shipping Partners
                    </h2>
                </div>
                <p className="mt-3 max-w-2xl text-center font-['Open_Sans'] text-[14px] text-[#C6C6C6] md:text-[16px]">
                    We collaborate with the world&apos;s leading shipping
                    companies to ensure safe and timely delivery worldwide
                </p>
            </div>

            {/* Shipping Partners Grid */}
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
                {shippingPartners.map((partner) => (
                    <div
                        key={partner.id}
                        className="group bg-gradient-radial relative flex items-center justify-center overflow-hidden rounded-[20px] border border-[#4F4F4F] from-[#151515] to-white/5 p-8 backdrop-blur-md transition-all duration-300 hover:border-[#EFA12D] md:p-10"
                    >
                        <div className="relative h-[80px] w-full md:h-[100px]">
                            <Image
                                src={partner.logo}
                                alt={partner.name}
                                fill
                                className="object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Additional Info */}
            <div className="mx-auto mt-12 max-w-3xl text-center md:mt-16">
                <p className="font-['Open_Sans'] text-[14px] leading-relaxed text-[#C6C6C6] md:text-[15px]">
                    Our partnerships with these industry-leading shipping
                    companies enable us to provide reliable, efficient, and
                    cost-effective logistics solutions for our customers across
                    the globe. We handle all documentation, customs clearance,
                    and ensure your products arrive safely and on time.
                </p>
            </div>
        </section>
    );
}
