"use client";

import { motion } from "framer-motion";

export default function GlobalMarketSection() {
    return (
        <section
            id="global-market"
            className="mt-2 scroll-mt-28 space-y-4 rounded-xl bg-[#222222] p-[20px] lg:p-[40px]"
        >
            {/* === Heading === */}
            <header className="mb-2">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-2 flex items-center gap-3"
                >
                    <div className="h-[1px] w-8 bg-white" />
                    <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                        What We Do?
                    </p>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    className="text-xl leading-snug font-semibold text-white md:text-2xl"
                >
                    Bringing Indonesia’s Finest Charcoal to the Global Market
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="font-medium text-[#EFA12D]"
                >
                    Delivering Premium Products With Integrity, Innovation, And
                    Care
                </motion.p>

                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mt-4 h-[1px] origin-left bg-[#3A3A3A]"
                />
            </header>

            {/* === Body Content Animated === */}
            <motion.article
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8 }}
                className="space-y-5 text-justify leading-relaxed text-gray-300 lg:text-lg"
            >
                <p>
                    At{" "}
                    <strong className="text-white">Djavacoal Indonesia</strong>,
                    we are dedicated to producing and exporting premium charcoal
                    products that are tailored to meet the demands of
                    international markets. Our product line covers a wide range
                    of charcoal briquettes, including coconut shell, BBQ,
                    sawdust, white charcoal (Binchotan), and natural hardwood
                    charcoal. Each product is manufactured with precision and
                    strict quality control, combining traditional expertise with
                    modern technology to ensure consistent heat, long burning
                    duration, minimal ash, and eco-friendly performance.
                </p>

                <p>
                    What sets us apart is the quality of our products and the
                    flexibility we offer to our clients. We provide OEM and
                    private label services, along with customised briquette
                    sizes, shapes, and packaging to support different branding
                    strategies. With three strategically located factories in
                    Java and direct access to major international ports, we
                    guarantee efficient production, smooth logistics, and timely
                    delivery to clients worldwide.
                </p>

                <p>
                    At <strong className="text-white">Djavacoal</strong>, we are
                    not just a supplier but a trusted partner. Our mission is to
                    deliver premium charcoal while building long-term
                    relationships based on professionalism, trust, and mutual
                    growth. By focusing on quality, sustainability, and
                    reliability, we proudly represent Indonesia’s finest natural
                    resources in the global charcoal industry.
                </p>
            </motion.article>
        </section>
    );
}
