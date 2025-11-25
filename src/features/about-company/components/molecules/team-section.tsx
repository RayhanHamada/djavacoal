"use client";

import { useMemo, useRef, useEffect } from "react";

import { useTranslations } from "next-intl";

import { FadeInView, ScaleOnHover, TeamCard } from "../atoms";
import { useAboutCompanyContentAPI } from "@/features/public-api/hooks";

export default function TeamSection() {
    const t = useTranslations("AboutCompany.team");
    const { data } = useAboutCompanyContentAPI();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const teamMembers = useMemo(
        () =>
            data?.data.team_members.map((e) => ({
                name: e.name,
                role: e.position,
                image: e.photo_url,
            })) ?? [],
        [data]
    );

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || teamMembers.length === 0) return;

        const interval = setInterval(() => {
            const cardWidth = 260 + 32; // card width + space-x-4 (16px * 2)
            const maxScroll = container.scrollWidth - container.clientWidth;
            const currentScroll = container.scrollLeft;

            if (currentScroll >= maxScroll) {
                // Reset to start
                container.scrollTo({ left: 0 });
            } else {
                // Scroll to next card
                container.scrollBy({ left: cardWidth, behavior: "smooth" });
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [teamMembers.length]);

    return (
        <section
            id="djavacoals-team"
            className="relative scroll-mt-24 overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#222222] p-6 md:p-10"
            aria-label="Djavacoal Team Section"
        >
            <header className="mb-[30px] pt-4">
                <div className="mb-2 flex items-center gap-3">
                    <div className="h-px w-8 bg-white" />
                    <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                        {t("subtitle")}
                    </p>
                </div>
                <h2 className="text-xl leading-snug font-semibold text-white md:text-2xl">
                    {t("title")}
                </h2>
                <p className="font-medium text-[#EFA12D]">{t("tagline")}</p>
                <div className="mt-4 h-px bg-[#3A3A3A] px-6" />
            </header>

            <div className="relative">
                {/* Mobile & Tablet: scroll horizontally */}
                <div
                    ref={scrollContainerRef}
                    className="scrollbar-hide flex snap-x snap-mandatory space-x-0 overflow-x-auto pb-6 lg:hidden"
                >
                    {teamMembers.map((member, i) => (
                        <FadeInView key={i} delay={i * 0.05}>
                            <div className="w-[260px] shrink-0 snap-start">
                                <ScaleOnHover scale={1.02}>
                                    <TeamCard member={member} />
                                </ScaleOnHover>
                            </div>
                        </FadeInView>
                    ))}
                </div>

                {/* Desktop: grid layout */}
                <div className="hidden lg:flex lg:flex-wrap lg:gap-x-0 lg:gap-y-4">
                    {teamMembers.map((member, i) => (
                        <FadeInView key={i} delay={i * 0.05} className="w-fit">
                            <ScaleOnHover scale={1.02}>
                                <TeamCard member={member} />
                            </ScaleOnHover>
                        </FadeInView>
                    ))}
                </div>
            </div>
        </section>
    );
}
