import Image from "next/image";

export default function TeamSection() {
    const team = [
        {
            name: "Yoga Indraprana",
            role: "President Directors",
            image: "/images/owner-djavacoal.png",
        },
        {
            name: "Yoga Indraprana",
            role: "President Directors",
            image: "/images/owner-djavacoal.png",
        },
        {
            name: "Yoga Indraprana",
            role: "President Directors",
            image: "/images/owner-djavacoal.png",
        },
        {
            name: "Yoga Indraprana",
            role: "President Directors",
            image: "/images/owner-djavacoal.png",
        },
        {
            name: "Yoga Indraprana",
            role: "President Directors",
            image: "/images/owner-djavacoal.png",
        },
        {
            name: "Yoga Indraprana",
            role: "President Directors",
            image: "/images/owner-djavacoal.png",
        },
        {
            name: "Yoga Indraprana",
            role: "President Directors",
            image: "/images/owner-djavacoal.png",
        },
        {
            name: "Yoga Indraprana",
            role: "President Directors",
            image: "/images/owner-djavacoal.png",
        },
    ];

    return (
        <section
            id="team"
            className="relative scroll-mt-24 overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#222222] p-6 md:p-10"
            aria-label="Djavacoal Team Section"
        >
            {/* === Heading === */}
            <header className="mb-2 pt-4">
                <div className="mb-2 flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-white" />
                    <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                        Djavacoal’s Team
                    </p>
                </div>
                <h2 className="text-xl leading-snug font-semibold text-white md:text-2xl">
                    The People Behind Our Success
                </h2>
                <p className="font-medium text-[#EFA12D]">
                    From Indonesia to the World, With Dedication and Care
                </p>
                <div className="mt-4 h-[1px] bg-[#3A3A3A] px-6" />
            </header>

            {/* === TEAM GRID === */}
            <div className="relative">
                {/* Mobile & Tablet: scroll horizontally */}
                <div className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto pb-6 lg:hidden">
                    {team.map((member, i) => (
                        <article
                            key={i}
                            className="w-[260px] flex-shrink-0 snap-start overflow-hidden bg-[#1E1E1E]"
                        >
                            <div className="relative">
                                {/* === Radial background: subtle white corners === */}
                                <div className="pointer-events-none absolute inset-0 z-0 border border-[#414141] bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_40%,_rgba(255,255,255,0.2)_100%)]" />

                                {/* === Image on top === */}
                                <Image
                                    src={member.image}
                                    alt={`${member.name} - ${member.role}`}
                                    width={400}
                                    height={500}
                                    className="relative z-10 h-[340px] w-full object-cover"
                                />
                            </div>

                            <div className="bg-[#222222] p-3 text-center">
                                <p className="text-sm text-[#BBBBBB] italic">
                                    {member.role}
                                </p>
                                <p className="font-semibold text-white">
                                    {member.name}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Desktop: grid layout */}
                <div className="hidden lg:grid lg:grid-cols-4">
                    {team.map((member, i) => (
                        <article
                            key={i}
                            className="overflow-hidden" // sedikit background biar blending halus
                        >
                            <div className="relative h-[420px]">
                                {/* === Subtle radial background for desktop === */}
                                <div className="z-0x absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_45%,_rgba(255,255,255,0.22)_100%)]" />

                                {/* === Image layer === */}
                                <Image
                                    src={member.image}
                                    alt={`${member.name} - ${member.role}`}
                                    width={400}
                                    height={500}
                                    className="relative z-10 h-full w-full border border-[#414141] object-contain object-bottom"
                                />
                            </div>

                            <div className="bg-[#222222] p-4 text-center">
                                <p className="text-sm text-[#BBBBBB] italic">
                                    {member.role}
                                </p>
                                <p className="font-semibold text-white">
                                    {member.name}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
