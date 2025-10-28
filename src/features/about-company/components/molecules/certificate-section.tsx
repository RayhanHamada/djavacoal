"use client";

import { useState } from "react";

import Image from "next/image";

import { motion } from "framer-motion";

import CertificateCard from "../atoms/CertificateCard";

export default function CertificateSection() {
    const certificates = [
        {
            src: "/images/certificates/cert1.png",
            alt: "NIB / Business Registration Number",
        },
        {
            src: "/images/certificates/cert2.png",
            alt: "Report Of Analysis (ROA)",
        },
        {
            src: "/images/certificates/cert3.png",
            alt: "Self-Heating Test (SHT) - 1",
        },
        {
            src: "/images/certificates/cert4.png",
            alt: "Self-Heating Test (SHT) - 2",
        },
        {
            src: "/images/certificates/cert5.png",
            alt: "Self-Heating Test (SHT) - 3",
        },
        {
            src: "/images/certificates/cert6.png",
            alt: "Material Safety Data Sheet (MSDS) - 1",
        },
        {
            src: "/images/certificates/cert7.png",
            alt: "Material Safety Data Sheet (MSDS) - 2",
        },
        {
            src: "/images/certificates/cert8.png",
            alt: "Material Safety Data Sheet (MSDS)",
        },
    ];

    const [open, setOpen] = useState(false);
    const [activeCert, setActiveCert] = useState<{
        src: string;
        alt: string;
    } | null>(null);

    const handleOpen = (cert: { src: string; alt: string }) => {
        setActiveCert(cert);
        setOpen(true);
        document.body.style.overflow = "hidden";
    };

    const handleClose = () => {
        setOpen(false);
        setActiveCert(null);
        document.body.style.overflow = "auto";
    };

    return (
        <section
            id="certificates"
            className="mt-10 scroll-mt-28 space-y-6 rounded-xl bg-[#222222] p-[20px] lg:p-[40px]"
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
                        Legal & Certificates
                    </p>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    className="text-xl leading-snug font-semibold text-white md:text-2xl"
                >
                    Trusted Legality, Proven Quality
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="font-medium text-[#EFA12D]"
                >
                    Comprehensive Legal Documents and Verified Lab Certificates
                </motion.p>

                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mt-4 h-[1px] origin-left bg-[#3A3A3A]"
                />
            </header>

            {/* ===== Mobile Horizontal Scroll ===== */}
            <div className="scrollbar-hide overflow-x-auto pr-12 pb-3 lg:hidden">
                <div className="flex snap-x snap-mandatory gap-6">
                    {certificates.map((c, i) => (
                        <motion.button
                            key={i}
                            onClick={() => handleOpen(c)}
                            className="flex w-[250px] shrink-0 snap-start flex-col items-center"
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.25 }}
                        >
                            <CertificateCard {...c} />
                            <p className="mt-2 text-xs text-gray-300 italic">
                                {c.alt}
                            </p>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* ===== Desktop Grid ===== */}
            <motion.div
                className="hidden gap-6 lg:grid lg:grid-cols-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
            >
                {certificates.map((c, i) => (
                    <motion.button
                        key={i}
                        onClick={() => handleOpen(c)}
                        whileHover={{ scale: 1.04 }}
                        className="flex flex-col items-center"
                    >
                        <CertificateCard {...c} />
                        <p className="mt-2 text-center text-sm text-gray-300 italic">
                            {c.alt}
                        </p>
                    </motion.button>
                ))}
            </motion.div>

            {/* ===== Modal / Lightbox Overlay ===== */}
            {open && activeCert && (
                <motion.div
                    className="fixed inset-0 z-[999] flex items-start justify-center overflow-y-auto bg-black/80 p-8 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.25 }}
                        className="relative mx-auto mt-10 max-w-[90vw] rounded-lg bg-white shadow-xl sm:max-w-[70vw] lg:max-w-[30vw]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* ✅ Sertifikat */}
                        <div className="relative w-full">
                            <Image
                                src={activeCert.src}
                                alt={activeCert.alt}
                                width={1400}
                                height={2000}
                                className="h-auto w-full object-contain"
                                priority
                            />

                            {/* ✅ Watermark */}
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <Image
                                    src="/images/watermark-legal.png"
                                    alt="Watermark Djavacoal"
                                    width={280}
                                    height={280}
                                    className="object-contain opacity-40"
                                />
                            </div>
                        </div>

                        {/* ✅ Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute -top-5 -right-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#EFA12D] text-xl font-bold text-black shadow-lg transition hover:scale-105"
                        >
                            ✕
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </section>
    );
}
