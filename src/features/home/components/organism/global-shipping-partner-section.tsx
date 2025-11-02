"use client";

import Image from "next/image";

const shippingPartners = [
    {
        id: "pil",
        name: "Pacific International Lines",
        logo: "/images/shipping-pil.png",
    },
    { id: "msc", name: "MSC Cruises", logo: "/images/shipping-msc.png" },
    { id: "cma", name: "CMA CGM", logo: "/images/shipping-cma-7a75cb.png" },
    { id: "esl", name: "ESL Shipping", logo: "/images/shipping-esl.png" },
    { id: "asyad", name: "Asyad Line", logo: "/images/shipping-asyad.png" },
    { id: "ovp", name: "OVP Shipping", logo: "/images/shipping-ovp.png" },
    {
        id: "sitc",
        name: "SITC Container Lines",
        logo: "/images/shipping-sitc.png",
    },
];

export function GlobalShippingPartnerSection() {
    const duplicated = [...shippingPartners, ...shippingPartners]; // ✅ Loop smooth

    return (
        <section className="relative w-full overflow-hidden bg-[#151515] py-10 lg:py-16">
            {/* Header */}
            <div className="mb-8 flex items-center gap-3 px-[20px] md:px-[60px] lg:px-[300px]">
                <div className="h-[2px] w-[60px] bg-[#EFA12D]" />
                <h2 className="px-10 font-['Josefin_Sans'] text-[28px] font-bold text-white md:text-[38px] lg:text-[44px]">
                    Global <span className="text-[#EFA12D]">Shipping</span>{" "}
                    Partner
                </h2>
            </div>

            {/* ✅ INFINITE CAROUSEL */}
            <div className="scroll-wrapper overflow-hidden">
                <div className="scroll-track flex gap-10">
                    {duplicated.map((p, index) => (
                        <div
                            key={index}
                            className="flex shrink-0 flex-col items-center"
                        >
                            <div className="group flex h-[220px] w-[220px] items-center justify-center overflow-hidden rounded-[22px] border border-[#FFFFFF30] bg-[radial-gradient(circle_at_center,_#000_0%,_#171717_50%,_#ffffff40_100%)] p-5 shadow-[0_0_40px_#00000050] transition-all duration-300 hover:border-[#EFA12D] md:h-[220px] md:w-[220px] md:p-6 lg:h-[350px] lg:w-[350px]">
                                <div className="relative h-full w-full">
                                    <Image
                                        src={p.logo}
                                        alt={p.name}
                                        fill
                                        className="object-contain transition duration-300 group-hover:scale-110"
                                    />
                                </div>
                            </div>
                            <p className="mt-3 text-center font-['Josefin_Sans'] text-[13px] whitespace-nowrap text-[#F0F0F0] md:text-[15px]">
                                {p.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
