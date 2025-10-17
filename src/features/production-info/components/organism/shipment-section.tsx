"use client";
import Image from "next/image";

import { motion } from "framer-motion";

export default function ShipmentSection() {
    return (
        <section id="shipment" className="scroll-mt-28 rounded-xl bg-[#222222]">
            {/* Header */}
            <header className="mb-4 px-4 pt-4 md:px-6">
                <div className="mb-2 flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-white" />
                    <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                        Shipment Terms
                    </p>
                </div>
                <h2 className="text-xl leading-snug font-semibold text-white md:text-2xl">
                    Reliable Shipping with FOB Terms
                </h2>
                <div className="mt-4 h-[1px] bg-[#3A3A3A]" />
            </header>

            {/* Content: image + text side by side on md */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-start gap-6 px-4 pb-6 md:flex-row md:px-6 lg:items-start"
            >
                {/* Left: Image with watermark */}
                <div className="relative w-full overflow-hidden rounded-lg md:w-1/2">
                    <Image
                        src="/images/shipment.png"
                        alt="Shipment"
                        width={1000}
                        height={600}
                        className="h-72 w-full rounded-lg object-cover lg:h-[36rem]"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute top-0 left-0 z-10 h-1/3 w-full rounded-t-lg bg-gradient-to-b from-black/80 to-transparent" />
                    {/* Watermark logo (center top) */}
                    <div className="absolute top-3 left-1/2 z-20 -translate-x-1/2">
                        <Image
                            src="/svgs/logo.svg"
                            alt="Djavacoal Watermark"
                            width={140}
                            height={60}
                            className="object-contain opacity-80"
                        />
                    </div>
                </div>

                {/* Right: Text content */}
                <div className="w-full text-sm leading-relaxed text-[#CCCCCC] md:w-1/2 md:text-base">
                    <h3 className="mb-2 font-semibold text-[#EFA12D]">
                        FOB (Freight On Board)
                    </h3>
                    <p>
                        At Djavacoal Indonesia, all international shipments are
                        provided under{" "}
                        <strong className="font-medium text-white">
                            FOB (Free On Board)
                        </strong>{" "}
                        terms. This means we take full responsibility for{" "}
                        <strong className="font-medium text-white">
                            preparing, packaging
                        </strong>
                        , and delivering your order safely to the{" "}
                        <strong className="font-medium text-white">
                            designated port in Indonesia
                        </strong>
                        , covering all local costs until the goods are loaded on
                        board the vessel. From that point, our buyers have the
                        freedom to arrange their preferred shipping line,
                        insurance, and logistics. With access to major
                        international ports in Jakarta, Semarang, and Surabaya,
                        we ensure smooth, efficient, and cost-effective export
                        handling for our global partners.
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
