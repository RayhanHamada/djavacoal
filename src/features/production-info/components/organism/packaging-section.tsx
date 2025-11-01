"use client";
import Image from "next/image";

import { motion } from "framer-motion";

function PackagingCard({
    image,
    desc,
    type,
}: {
    image: string;
    desc: string;
    type: string;
}) {
    return (
        <article className="rounded-xl bg-[#222222] text-left">
            {/* Title */}
            <h3 className="mb-2 px-1 text-base font-semibold text-[#EFA12D] md:px-0 md:text-lg lg:px-0">
                <span className="font-bold text-[#EFA12D]">{type}</span>{" "}
                <span className="font-bold text-[#FFFFFF]">Packaging:</span>
            </h3>

            {/* Image */}
            <div className="group relative mb-4 flex w-full justify-center overflow-hidden rounded-xl">
                <div className="relative aspect-square max-h-none w-full max-w-none overflow-hidden rounded-xl transition-all duration-300">
                    <Image
                        src={image}
                        alt={`${type} Packaging`}
                        fill
                        className="scale-85 rounded-xl object-contain transition-transform duration-300 group-hover:scale-110 lg:scale-90"
                    />

                    {/* Overlay radial gradient */}
                    <div className="absolute inset-0 z-10 rounded-xl bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.45)_0%,rgba(90,90,90,0.3)_30%,rgba(210,210,210,0.65)_70%,rgba(255,255,255,0.98)_100%)] mix-blend-overlay" />

                    {/* Watermark */}
                    <div className="absolute top-4 left-1/2 z-20 -translate-x-1/2">
                        <Image
                            src="/svgs/logo.svg"
                            alt="Djavacoal Watermark"
                            width={120}
                            height={60}
                            className="object-contain opacity-90"
                        />
                    </div>
                </div>
            </div>

            {/* Description (align sejajar batas gambar) */}
            <p className="/* biar di desktop sejajar dengan gambar */ px-1 text-sm leading-relaxed text-[#CCCCCC] md:px-2 md:text-base lg:px-0">
                {desc}
            </p>
        </article>
    );
}

const PACKAGING_OPTIONS = [
    {
        type: "Full",
        image: "/images/packaging-full.png",
        description:
            "Designed for retail and private label brands, this option includes inner plastic, inner box, and master box. It ensures your brand stands out on the market while keeping products safe and ready for direct distribution to customers.",
        features: ["Retail Ready", "Brand Protection", "Complete Packaging"],
    },
    {
        type: "Bulk",
        image: "/images/packaging-bulk.png",
        description:
            "Best suited for wholesale buyers and large distributors, this packaging includes inner plastic and master box only. It reduces costs while still maintaining protection and efficient handling during export.",
        features: ["Wholesale Focused", "Cost Effective", "Efficient Handling"],
    },
    {
        type: "Loose",
        image: "/images/packaging-bulk-loose.png",
        description:
            "Ideal for high-volume and cost-sensitive shipments, this option uses only inner plastic (10 kg) packed directly into the master box without inner boxes. It maximizes container space and efficiency, making it the most economical choice.",
        features: ["High Volume", "Space Efficient", "Most Economical"],
    },
];

export default function PackagingSection() {
    return (
        <section
            id="packaging"
            className="scroll-mt-28 rounded-xl bg-[#222222]"
        >
            {/* Header */}
            <header className="mb-8 px-4 pt-4 md:px-6">
                <div className="mb-2 flex items-center gap-3">
                    <div className="h-px w-8 bg-white" />
                    <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                        Packaging Option
                    </p>
                </div>
                <h2 className="text-xl leading-snug font-semibold text-white md:text-2xl">
                    Flexible Packaging to Suit Your Business Needs
                </h2>
                <div className="mt-4 h-px bg-[#3A3A3A]" />
            </header>

            {/* Cards */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
                className="group grid grid-cols-1 gap-6 px-4 pb-8 md:grid-cols-3 md:px-6"
            >
                {PACKAGING_OPTIONS.map((option) => (
                    <PackagingCard
                        key={option.type}
                        type={option.type}
                        image={option.image}
                        desc={option.description}
                    />
                ))}
            </motion.div>
        </section>
    );
}
