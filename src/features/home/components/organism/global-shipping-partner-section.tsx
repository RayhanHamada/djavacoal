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
    const repeated = Array(6).fill(shippingPartners).flat();

    const PartnerCard = ({ logo, name }: { logo: string; name: string }) => (
        <div className="flex shrink-0 flex-col items-center">
            <div className="group flex h-[220px] w-[220px] items-center justify-center overflow-hidden rounded-[22px] border border-[#FFFFFF30] bg-[radial-gradient(circle_at_center,_#000_0%,_#171717_50%,_#ffffff40_100%)] p-5 shadow-[0_0_40px_#00000050] transition-all duration-300 hover:border-[#EFA12D] md:h-[220px] md:w-[220px] md:p-6 lg:h-[350px] lg:w-[350px]">
                <div className="relative h-full w-full">
                    <Image
                        src={logo}
                        alt={name}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                </div>
            </div>
            <p className="mt-3 text-center font-['Josefin_Sans'] text-[13px] whitespace-nowrap text-[#F0F0F0] md:text-[15px]">
                {name}
            </p>
        </div>
    );

    return (
        <section className="relative w-full overflow-hidden bg-[#151515] py-10 lg:py-16">
            {/* Header */}
            <div className="mb-8 flex items-center gap-3 px-[20px] md:px-[40px] lg:px-[240px]">
                <div className="h-[2px] w-[60px] bg-[#EFA12D]" />
                <h2 className="font-['Josefin_Sans'] text-[28px] font-bold text-white md:text-[38px] lg:text-[44px]">
                    Global <span className="text-[#EFA12D]">Shipping</span>{" "}
                    Partner
                </h2>
            </div>

            <div className="relative h-[420px] w-full overflow-hidden">
                {/* Track 1 */}
                <div className="logo-track flex gap-10">
                    {repeated.map((p, i) => (
                        <PartnerCard
                            key={`track1-${i}`}
                            logo={p.logo}
                            name={p.name}
                        />
                    ))}
                </div>

                <div
                    className="logo-track logo-track--alt flex gap-10"
                    aria-hidden
                >
                    {repeated.map((p, i) => (
                        <PartnerCard
                            key={`track2-${i}`}
                            logo={p.logo}
                            name={p.name}
                        />
                    ))}
                </div>
            </div>

            <style jsx>{`
                .logo-track {
                    position: absolute;
                    top: 0;
                    left: 0;
                    display: flex;
                    white-space: nowrap;
                    animation: scrollLoop 150s linear infinite;
                }

                .logo-track--alt {
                    animation: scrollLoop2 150s linear infinite;
                }

                @keyframes scrollLoop {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }

                @keyframes scrollLoop2 {
                    0% {
                        transform: translateX(100%);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
            `}</style>
        </section>
    );
}
