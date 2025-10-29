"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";

const shippingPartners = [
    {
        id: "pil",
        name: "Pacific International Lines",
        logo: "/images/shipping-pil.png",
        width: 1381,
        height: 576,
    },
    {
        id: "msc",
        name: "MSC Cruises",
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
        name: "Asyad Line",
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
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const interval = setInterval(() => {
            container.scrollBy({
                left: 250,
                behavior: "smooth",
            });

            if (
                container.scrollLeft + container.clientWidth >=
                container.scrollWidth
            ) {
                setTimeout(() => {
                    container.scrollTo({ left: 0, behavior: "smooth" });
                }, 1500);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative w-full overflow-hidden bg-[#151515] py-16 lg:py-24">
            {/* Header */}
            <div className="mb-8 flex items-center gap-3 px-[20px] md:px-[60px] lg:px-[300px]">
                <div className="h-[2px] w-[60px] bg-[#EFA12D]" />
                <h2 className="px-10 font-['Josefin_Sans'] text-[28px] font-bold text-white md:text-[38px] lg:text-[44px]">
                    Global <span className="text-[#EFA12D]">Shipping</span>{" "}
                    Partner
                </h2>
            </div>

            {/* SCROLL CONTAINER */}
            <div
                ref={scrollRef}
                className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pt-4 pb-10 select-none md:gap-8 lg:gap-12"
            >
                {shippingPartners.map((p) => (
                    <div
                        key={p.id}
                        className="flex shrink-0 snap-start flex-col items-center"
                    >
                        {/* CARD LOGO */}
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

                        {/* NAME BELOW CARD */}
                        <p className="mt-3 text-center font-['Josefin_Sans'] text-[13px] whitespace-nowrap text-[#F0F0F0] md:text-[15px]">
                            {p.name}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
