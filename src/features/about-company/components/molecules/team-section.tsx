"use client";

import { useMemo } from "react";

import { FadeInView, ScaleOnHover, TeamCard } from "../atoms";
import { useAboutCompanyContentAPI } from "@/features/public-api/hooks";

export default function TeamSection() {
    const { data } = useAboutCompanyContentAPI();

    const teamMembers = useMemo(
        () =>
            data?.data.team_members.map((e) => ({
                name: e.name,
                role: e.position,
                image: e.photo_url,
            })) ?? [],
        [data]
    );

    return (
        <section
            id="team"
            className="relative scroll-mt-24 overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#222222] p-6 md:p-10"
            aria-label="Djavacoal Team Section"
        >
            <header className="mb-2 pt-4">
                <div className="mb-2 flex items-center gap-3">
                    <div className="h-px w-8 bg-white" />
                    <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                        Djavacoal&apos;s Team
                    </p>
                </div>
                <h2 className="text-xl leading-snug font-semibold text-white md:text-2xl">
                    The People Behind Our Success
                </h2>
                <p className="font-medium text-[#EFA12D]">
                    From Indonesia to the World, With Dedication and Care
                </p>
                <div className="mt-4 h-px bg-[#3A3A3A] px-6" />
            </header>

            <div className="relative">
                {/* Mobile & Tablet: scroll horizontally */}
                <div className="scrollbar-hide flex snap-x snap-mandatory space-x-8 overflow-x-auto pb-6 lg:hidden">
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
                <div className="hidden lg:grid lg:grid-cols-4">
                    {teamMembers.map((member, i) => (
                        <FadeInView key={i} delay={i * 0.05}>
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
