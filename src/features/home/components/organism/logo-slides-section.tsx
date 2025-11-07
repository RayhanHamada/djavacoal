"use client";

import Image from "next/image";

import { useTranslations } from "next-intl";

export function LogoSlideSection() {
    const t = useTranslations("Home.certificates");
    const base = [
        {
            image: "/images/ministry_of_trade_logo.png",
            width: 240,
            height: 110,
        },
        { image: "/images/100_natural_logo.png", width: 88, height: 94 },
        {
            image: "/images/material_data_safety_sheets_logo.png",
            width: 190,
            height: 104,
        },
        { image: "/images/carsurin_1968_logo.png", width: 108.67, height: 110 },
    ];

    const repeated = Array(8).fill(base).flat();

    const Card = ({ src, w, h }: { src: string; w: number; h: number }) => (
        <div className="flex h-[150px] w-[320px] flex-shrink-0 items-center justify-center border border-[#2A2A2A] bg-[radial-gradient(circle_at_center,#000_0%,#171717_50%,_#ffffff10_100%)] shadow-[0_0_20px_#00000030] transition-all duration-300 hover:border-[#EFA12D] hover:shadow-[#EFA12D]/20">
            <Image
                src={src}
                alt={t("logoAlt")}
                width={w}
                height={h}
                className="object-contain"
            />
        </div>
    );

    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#0D0D0D] to-[#1A1A1A]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_#000_0%,_#0D0D0D_80%,_#1A1A1A_100%)] opacity-30" />

            {/* ✅ Tambahkan wrapper ini agar di mobile bisa di-scroll */}
            <div className="scrollbar-hide relative h-[150px] w-full touch-pan-x overflow-hidden overflow-x-auto md:overflow-hidden">
                {/* Track 1 */}
                <div className="logo-track will-change-transform">
                    {repeated.map((c, i) => (
                        <Card
                            key={`t1-${i}`}
                            src={c.image}
                            w={c.width}
                            h={c.height}
                        />
                    ))}
                </div>

                {/* Track 2 */}
                <div
                    className="logo-track logo-track--alt will-change-transform"
                    aria-hidden
                >
                    {repeated.map((c, i) => (
                        <Card
                            key={`t2-${i}`}
                            src={c.image}
                            w={c.width}
                            h={c.height}
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
                    width: max-content;
                    animation: marquee 150s linear infinite;
                }

                .logo-track--alt {
                    animation: marquee2 150s linear infinite;
                }

                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }

                @keyframes marquee2 {
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
