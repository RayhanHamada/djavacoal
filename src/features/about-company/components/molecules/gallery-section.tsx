"use client";

import { useState, useEffect, useCallback } from "react";

import Image from "next/image";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    "/images/factory-gallery1.png",
    "/images/factory-gallery-large1.png",
    "/images/factory-gallery-large2.png",
    "/images/factory-gallery-large3.png",
    "/images/factory-gallery-large1.png",
    "/images/factory-gallery-large2.png",
    "/images/factory-gallery-large3.png",
];

const productGallery = [
    "/images/product-gallery1.png",
    "/images/product-gallery-large1.png",
    "/images/product-gallery-large2.png",
    "/images/product-gallery-large3.png",
    "/images/product-gallery-large1.png",
    "/images/product-gallery-large2.png",
    "/images/product-gallery-large3.png",
];

export default function GallerySection() {
    const [viewer, setViewer] = useState<{
        type: "reel" | "factory" | "product";
        index: number;
    } | null>(null);

    const closeModal = () => setViewer(null);

    const next = useCallback(() => {
        if (!viewer) return;
        const list =
            viewer.type === "reel"
                ? reels
                : viewer.type === "factory"
                  ? factoryGallery
                  : productGallery;

        setViewer({ ...viewer, index: (viewer.index + 1) % list.length });
    }, [viewer]);

    const prev = useCallback(() => {
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
    }, [viewer]);

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
    }, [next, prev, viewer]);

    return (
        <section
            id="gallery"
            className="mt-10 scroll-mt-28 space-y-6 rounded-xl bg-[#222222] p-[40px]"
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
                    <div className="h-px w-8 bg-white" />
                    <p className="text-sm font-medium tracking-wide text-[#60A5FF] italic">
                        Djavacoal’s Gallery
                    </p>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    className="text-xl leading-snug font-semibold text-white md:text-2xl"
                >
                    Our Story in Pictures
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="font-medium text-[#EFA12D]"
                >
                    Experience The Dedication Behind Every Charcoal We Produce
                </motion.p>

                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mt-4 h-px origin-left bg-[#3A3A3A]"
                />
            </header>
            {/* 🎥 HERO VIDEO REELS */}
            <div className="-mx-[40px]">
                <div className="relative w-full">
                    <div
                        id="reelsContainer"
                        className="scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-transparent scrollbar-hide -pr-[40px] -pl-[40px] flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth py-4 lg:mx-auto"
                    >
                        {reels.map((id, i) => (
                            <button
                                key={id + crypto.randomUUID()}
                                onClick={() =>
                                    setViewer({ type: "reel", index: i })
                                }
                                className="group relative aspect-9/16 w-[300px] shrink-0 snap-start overflow-hidden bg-black transition hover:scale-[1.03]"
                            >
                                <iframe
                                    className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
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
                                            className="translate-x-0.5"
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
                            const el =
                                document.getElementById("reelsContainer");
                            if (el)
                                el.scrollBy({ left: -350, behavior: "smooth" });
                        }}
                    >
                        <ChevronLeft size={26} />
                    </button>

                    <button
                        className="absolute top-1/2 right-2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#202020]/60 text-white transition hover:bg-[#EFA12D] lg:flex"
                        onClick={() => {
                            const el =
                                document.getElementById("reelsContainer");
                            if (el)
                                el.scrollBy({ left: 350, behavior: "smooth" });
                        }}
                    >
                        <ChevronRight size={26} />
                    </button>
                </div>
            </div>

            {/* Divider for Desktop */}
            <hr className="hidden border-t border-[#3A3A3A] lg:block" />
            {/* 📸 FACTORY & PRODUCT GALLERIES */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* ✅ Factory Gallery */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                        Djavacoal’s{" "}
                        <span className="text-[#EFA12D]">Factory</span> Gallery
                    </h3>

                    {/* ✅ Main Large Image (Factory) */}
                    <button
                        onClick={() => setViewer({ type: "factory", index: 0 })}
                        className="col-span-full block w-full overflow-hidden"
                    >
                        <Image
                            src={factoryGallery[0]}
                            alt="Factory Main"
                            width={1600}
                            height={900}
                            className="h-[300px] w-full rounded-none object-cover md:h-[400px] lg:h-[685px]"
                        />
                    </button>

                    <div className="relative">
                        {/* ✅ Thumbnails scrollable */}
                        <div
                            id="factoryThumbs"
                            className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
                        >
                            {factoryGallery.slice(1).map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() =>
                                        setViewer({
                                            type: "factory",
                                            index: i + 1,
                                        })
                                    }
                                    className="group h-[180px] min-w-[180px] snap-start overflow-hidden transition lg:h-[220px] lg:min-w-[220px]"
                                >
                                    <Image
                                        src={img}
                                        alt={`Factory ${i + 2}`}
                                        width={220}
                                        height={220}
                                        className="h-full w-full object-cover duration-300 group-hover:scale-[1.05]"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* ✅ Left Arrow */}
                        <button
                            onClick={() => {
                                const el =
                                    document.getElementById("factoryThumbs");
                                if (el)
                                    el.scrollBy({
                                        left: -240,
                                        behavior: "smooth",
                                    });
                            }}
                            className="absolute top-1/2 left-0 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-[#EFA12D] lg:flex"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        {/* ✅ Right Arrow */}
                        <button
                            onClick={() => {
                                const el =
                                    document.getElementById("factoryThumbs");
                                if (el)
                                    el.scrollBy({
                                        left: 240,
                                        behavior: "smooth",
                                    });
                            }}
                            className="absolute top-1/2 right-0 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-[#EFA12D] lg:flex"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* ✅ Products Gallery */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                        Djavacoal’s{" "}
                        <span className="text-[#EFA12D]">Products</span> Gallery
                    </h3>

                    {/* ✅ Main Large Image (Product) */}
                    <button
                        onClick={() => setViewer({ type: "product", index: 0 })}
                        className="col-span-full block w-full overflow-hidden"
                    >
                        <Image
                            src={productGallery[0]}
                            alt="Product Main"
                            width={1600}
                            height={900}
                            className="h-[300px] w-full rounded-none object-cover md:h-[400px] lg:h-[685px]"
                        />
                    </button>

                    <div className="relative">
                        {/* ✅ Thumbnails scrollable */}
                        <div
                            id="productThumbs"
                            className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
                        >
                            {productGallery.slice(1).map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() =>
                                        setViewer({
                                            type: "product",
                                            index: i + 1,
                                        })
                                    }
                                    className="group h-[180px] min-w-[180px] snap-start overflow-hidden transition lg:h-[220px] lg:min-w-[220px]"
                                >
                                    <Image
                                        src={img}
                                        alt={`Product ${i + 2}`}
                                        width={220}
                                        height={220}
                                        className="h-full w-full object-cover duration-300 group-hover:scale-[1.05]"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* ✅ Left Arrow */}
                        <button
                            onClick={() => {
                                const el =
                                    document.getElementById("productThumbs");
                                if (el)
                                    el.scrollBy({
                                        left: -240,
                                        behavior: "smooth",
                                    });
                            }}
                            className="absolute top-1/2 left-0 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-[#EFA12D] lg:flex"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        {/* ✅ Right Arrow */}
                        <button
                            onClick={() => {
                                const el =
                                    document.getElementById("productThumbs");
                                if (el)
                                    el.scrollBy({
                                        left: 240,
                                        behavior: "smooth",
                                    });
                            }}
                            className="absolute top-1/2 right-0 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-[#EFA12D] lg:flex"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
            {/* ✅ Single Unified Modal */}
            {viewer !== null && (
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    {/* Close */}
                    <button
                        className="absolute top-6 right-6 rounded-full bg-black/40 p-2 text-white hover:bg-black/70"
                        onClick={closeModal}
                    >
                        ✕
                    </button>

                    {/* Modal Content Wrapper (agar klik luar nutup) */}
                    <div
                        className="relative flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {viewer.type === "reel" && (
                            <div className="relative aspect-[9/16] w-[85vw] max-w-[400px] overflow-hidden rounded-xl">
                                <iframe
                                    src={`https://www.youtube-nocookie.com/embed/${reels[viewer.index]}?autoplay=1&controls=1&playsinline=1`}
                                    className="absolute inset-0 h-full w-full"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                            </div>
                        )}

                        {viewer.type === "factory" && (
                            <Image
                                src={factoryGallery[viewer.index]}
                                alt="Factory Photo"
                                width={1200}
                                height={1200}
                                className="max-h-[85vh] w-auto object-contain"
                            />
                        )}

                        {viewer.type === "product" && (
                            <Image
                                src={productGallery[viewer.index]}
                                alt="Product Photo"
                                width={1200}
                                height={1200}
                                className="max-h-[85vh] w-auto object-contain"
                            />
                        )}

                        {/* Prev Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                prev();
                            }}
                            className="/* Mobile/tablet inside | Desktop outside */ absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-[#EFA12D] lg:left-[-85px]"
                        >
                            <ChevronLeft size={30} />
                        </button>

                        {/* Next Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                next();
                            }}
                            className="/* Mobile/tablet inside | Desktop outside */ absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-[#EFA12D] lg:right-[-85px]"
                        >
                            <ChevronRight size={30} />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
