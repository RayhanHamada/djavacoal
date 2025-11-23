"use client";

import "./global-shipping-partner-section.css";

import Image from "next/image";

import { useTranslations } from "next-intl";

const shippingPartners = [
    {
        id: "pil",
        nameKey: "pil",
        logo: "/images/shipping-pil.png",
    },
    {
        id: "msc",
        nameKey: "msc",
        logo: "/images/shipping-msc.png",
    },
    {
        id: "cma",
        nameKey: "cma",
        logo: "/images/shipping-cma-7a75cb.png",
    },
    {
        id: "esl",
        nameKey: "esl",
        logo: "/images/shipping-esl.png",
    },
    {
        id: "asyad",
        nameKey: "asyad",
        logo: "/images/shipping-asyad.png",
    },
    {
        id: "ovp",
        nameKey: "ovp",
        logo: "/images/shipping-ovp.png",
    },
    {
        id: "sitc",
        nameKey: "sitc",
        logo: "/images/shipping-sitc.png",
    },
];

export function GlobalShippingPartnerSection() {
    const t = useTranslations("Home.shippingPartners");
    const repeated = Array(6).fill(shippingPartners).flat();

    const PartnerCard = ({ logo, name }: { logo: string; name: string }) => (
        <div className="flex shrink-0 flex-col items-center">
            <div className="group flex h-[220px] w-[220px] items-center justify-center overflow-hidden rounded-[22px] border border-[#FFFFFF30] bg-[radial-gradient(circle_at_center,#000_0%,#171717_50%,#ffffff40_100%)] p-5 shadow-[0_0_40px_#00000050] transition-all duration-300 hover:border-[#EFA12D] md:h-[220px] md:w-[220px] md:p-6 lg:h-[350px] lg:w-[350px]">
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
            <div className="mb-8 flex items-center gap-3 px-5 md:px-10 lg:px-60">
                <div className="h-0.5 w-[60px] bg-[#EFA12D]" />
                <h2 className="font-['Josefin_Sans'] text-[28px] font-bold text-white md:text-[38px] lg:text-[44px]">
                    {t("title")}{" "}
                    <span className="text-[#EFA12D]">{t("highlight")}</span>{" "}
                    {t("suffix")}
                </h2>
            </div>

            <div className="relative h-[420px] w-full overflow-hidden">
                {/* Track 1 */}
                <div className="logo-track flex space-x-10">
                    {repeated.map((p, i) => (
                        <PartnerCard
                            key={`track1-${i}`}
                            logo={p.logo}
                            name={t(`partners.${p.nameKey}` as any)}
                        />
                    ))}
                </div>

                <div
                    className="logo-track logo-track--alt flex space-x-10"
                    aria-hidden
                >
                    {repeated.map((p, i) => (
                        <PartnerCard
                            key={`track2-${i}`}
                            logo={p.logo}
                            name={t(`partners.${p.nameKey}` as any)}
                        />
                    ))}
                </div>
            </div>

            <style jsx>{``}</style>
        </section>
    );
}
