"use client";

import { useState, useEffect } from "react";

import Image from "next/image";

import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/* ✅ Reels: simpan Video ID */
const reels = [
    "EouOlxd_DlU",
    "q98uLQT6hh4",
    "4c4w0Bu8a1I",
    "cGAVGlKIOt4",
    "9CiCASBhKPM",
    "EouOlxd_DlU",
    "q98uLQT6hh4",
    "4c4w0Bu8a1I",
    "cGAVGlKIOt4",
    "9CiCASBhKPM",
];

/* ✅ Helper thumbnail yang selalu ada */
const getYTThumb = (id: string) =>
    `https://img.youtube.com/vi/${id}/sddefault.jpg`;

const factoryGallery = [
    "/images/gallery/factory1.png",
    "/images/gallery/factory2.png",
    "/images/gallery/factory3.png",
];

const productGallery = [
    "/images/gallery/product1.png",
    "/images/gallery/product2.png",
    "/images/gallery/product3.png",
];

export default function GallerySection() {
    const [viewer, setViewer] = useState<{
        type: "reel" | "factory" | "product";
        index: number;
    } | null>(null);

    const closeModal = () => setViewer(null);

    const next = () => {
        if (!viewer) return;
        const list =
            viewer.type === "reel"
                ? reels
                : viewer.type === "factory"
                  ? factoryGallery
                  : productGallery;

        setViewer({ ...viewer, index: (viewer.index + 1) % list.length });
    };

    const prev = () => {
        if (!viewer) return;
        const list =
            viewer.type === "reel"
                ? reels
                : viewer.type === "factory"
                  ? factoryGallery
                  : productGallery;

        setViewer({
            ...viewer,
            index: (viewer.index - 1 + list.length) % list.length,
        });
    };

    useEffect(() => {
        if (!viewer) {
            document.body.style.overflow = "auto";
            return;
        }
        document.body.style.overflow = "hidden";

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [viewer]);

    return (
        <section
            id="gallery"
            className="mt-10 max-w-screen-2xl scroll-mt-28 space-y-6 rounded-xl bg-[#222222] pb-10"
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
                        Djavacoal’s Gallery
                    </p>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    className="px-6 text-xl leading-snug font-semibold text-white md:text-2xl"
                >
                    Our Story in Pictures
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="px-6 font-medium text-[#EFA12D]"
                >
                    Experience The Dedication Behind Every Charcoal We Produce
                </motion.p>

                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mt-4 h-[1px] origin-left bg-[#3A3A3A]"
                />
            </header>

            {/* 🎥 HERO VIDEO REELS */}
            <div className="relative max-w-full items-start">
                <div
                    id="reelsContainer"
                    className="scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-transparent mx-6 flex w-full snap-x snap-mandatory gap-5 overflow-x-hidden scroll-smooth py-4 lg:w-[80%]"
                >
                    {reels.map((id, i) => (
                        <button
                            key={id}
                            onClick={() =>
                                setViewer({ type: "reel", index: i })
                            }
                            className="group relative aspect-[9/16] w-[300px] flex-shrink-0 snap-start overflow-hidden bg-black transition hover:scale-[1.03]"
                        >
                            <iframe
                                className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1`}
                            />

                            <Image
                                src={getYTThumb(id)}
                                alt={`Reel ${i + 1}`}
                                fill
                                className="object-cover transition duration-300 group-hover:opacity-0"
                            />

                            <div className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 opacity-70">
                                <Image
                                    src="/svgs/logo.svg"
                                    alt="Logo"
                                    width={70}
                                    height={70}
                                    className="drop-shadow-lg"
                                />
                            </div>

                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#202020]/50 shadow-lg">
                                    <svg
                                        width="20"
                                        height="20"
                                        fill="white"
                                        className="translate-x-[2px]"
                                    >
                                        <path d="M5 4v16l12-8z" />
                                    </svg>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* ✅ DESKTOP ARROWS */}
                <button
                    className="absolute top-1/2 left-2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#202020]/60 text-white transition hover:bg-[#EFA12D] lg:flex"
                    onClick={() => {
                        const el = document.getElementById("reelsContainer");
                        if (el) el.scrollBy({ left: -350, behavior: "smooth" });
                    }}
                >
                    <ChevronLeft size={26} />
                </button>

                <button
                    className="absolute top-1/2 right-2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#202020]/60 text-white transition hover:bg-[#EFA12D] lg:flex"
                    onClick={() => {
                        const el = document.getElementById("reelsContainer");
                        if (el) el.scrollBy({ left: 350, behavior: "smooth" });
                    }}
                >
                    <ChevronRight size={26} />
                </button>
            </div>

            {/* Divider for Desktop */}
            <hr className="hidden border-t border-[#3A3A3A] px-6 lg:block" />

            <div className="grid grid-cols-1 gap-2 px-6 lg:grid-cols-2">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#EFA12D]">
                        Djavacoal’s Factory Gallery
                    </h3>
                    <div className="grid gap-3">
                        {factoryGallery.map((img, i) => (
                            <button
                                key={i}
                                onClick={() =>
                                    setViewer({ type: "factory", index: i })
                                }
                            >
                                <Image
                                    src={img}
                                    alt={`Factory ${i + 1}`}
                                    width={600}
                                    height={400}
                                    className="rounded-md border border-[#333] object-cover transition hover:border-[#EFA12D]"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="px-6 text-lg font-semibold text-[#EFA12D]">
                        Djavacoal’s Products Gallery
                    </h3>
                    <div className="grid gap-3">
                        {productGallery.map((img, i) => (
                            <button
                                key={i}
                                onClick={() =>
                                    setViewer({ type: "product", index: i })
                                }
                            >
                                <Image
                                    src={img}
                                    alt={`Product ${i + 1}`}
                                    width={600}
                                    height={400}
                                    className="rounded-md border border-[#333] object-cover transition hover:border-[#EFA12D]"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {viewer !== null && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <button
                        className="absolute top-4 right-4 text-white opacity-80 hover:opacity-100"
                        onClick={closeModal}
                    >
                        <X size={32} />
                    </button>

                    <div
                        className="relative flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {viewer.type === "reel" ? (
                            <div className="relative aspect-[9/16] w-[90vw] max-w-[450px] overflow-hidden rounded-xl border border-[#EFA12D] shadow-[0_0_35px_rgba(239,161,45,0.35)] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[500px] xl:max-w-[520px]">
                                <iframe
                                    src={`https://www.youtube.com/embed/${reels[viewer.index]}?autoplay=1&controls=1&rel=0&modestbranding=1`}
                                    className="absolute inset-0 h-full w-full"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                            </div>
                        ) : viewer.type === "factory" ? (
                            <Image
                                src={factoryGallery[viewer.index]}
                                alt="Factory Photo"
                                width={1000}
                                height={1000}
                                className="max-h-[85vh] w-auto rounded-md object-contain"
                            />
                        ) : (
                            <Image
                                src={productGallery[viewer.index]}
                                alt="Product Photo"
                                width={1000}
                                height={1000}
                                className="max-h-[85vh] w-auto rounded-md object-contain"
                            />
                        )}

                        <button
                            onClick={prev}
                            className="absolute top-1/2 -left-10 -translate-y-1/2 text-white"
                        >
                            <ChevronLeft
                                size={35}
                                className="opacity-80 hover:opacity-100"
                            />
                        </button>

                        <button
                            onClick={next}
                            className="absolute top-1/2 -right-10 -translate-y-1/2 text-white"
                        >
                            <ChevronRight
                                size={35}
                                className="opacity-80 hover:opacity-100"
                            />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
