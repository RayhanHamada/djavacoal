"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function FactorySection() {
    return (
        <section
            id="factory"
            className="mt-10 scroll-mt-28 space-y-6 rounded-xl bg-[#222222] pb-10"
        >
            {/* === Heading === */}
            <header className="mb-2 pt-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-2 flex items-center gap-3 px-6"
                >
                    <div className="h-[1px] w-8 bg-white" />
                    <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                        Our Factory
                    </p>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    className="px-6 text-xl leading-snug font-semibold text-white md:text-2xl"
                >
                    Where Quality Meets Production
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="px-6 font-medium text-[#EFA12D]"
                >
                    Three Factories Across Java, Ready To Serve Global Markets
                </motion.p>

                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mt-4 h-[1px] origin-left bg-[#3A3A3A] px-6"
                />
            </header>

            {/* === Factory Image === */}
            <div className="flex px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative h-56 w-full overflow-hidden rounded-md sm:h-72 md:h-80 lg:h-[520px] lg:w-[850px]"
                >
                    <Image
                        src="/images/factory1.png"
                        alt="Charcoal Production Factory Djavacoal Indonesia"
                        fill
                        className="rounded-md object-cover"
                        priority
                        sizes="(max-width: 1024px) 100vw, 850px"
                    />
                </motion.div>
            </div>

            {/* === Description Content === */}
            <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="space-y-4 px-6 text-justify text-sm leading-relaxed text-gray-300 md:text-base"
            >
                <p>
                    At{" "}
                    <strong className="text-white">Djavacoal Indonesia</strong>,
                    we take pride in operating three factories across Java that
                    combine years of expertise, strict quality control, and
                    modern production standards to deliver world-class charcoal
                    products. Every step of our process from selecting premium
                    raw materials to shaping, testing, and packaging is carried
                    out with professionalism and dedication to ensure
                    consistency, safety, and performance. With our proven
                    experience in serving global markets, we welcome you to
                    visit our factories and witness firsthand how we transform
                    Indonesia&apos;s finest resources into trusted charcoal
                    products for the world.
                </p>
            </motion.article>

            {/* === CTA Button (WhatsApp) === */}
            <div className="mt-4 flex px-6">
                <Link
                    href="https://wa.me/628xxxxxxx"
                    target="_blank"
                    className="bg-button-whatsapp flex h-16 w-full items-center justify-center gap-2 rounded-md px-6 font-semibold text-white transition hover:bg-[#25d366] md:w-[325px] lg:w-[325px]"
                >
                    <span>Schedule a Visit</span>
                    <FaWhatsapp className="text-lg" />
                </Link>
            </div>
        </section>
    );
}
