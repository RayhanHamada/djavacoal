"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

export function AboutUsSection() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section className="w-full bg-[#151515] px-[20px] py-16 md:px-[40px] md:py-20 lg:px-[100px] lg:py-24">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
                {/* ✅ RIGHT: Video / Image (pindah ke atas di mobile & tablet) */}
                <div className="relative order-1 w-full overflow-hidden rounded-[16px] border border-[#FFFFFF20] bg-[#1A1A1A] shadow-lg lg:order-2 lg:w-1/2">
                    {/* 🎬 Thumbnail (belum play) */}
                    {!isPlaying ? (
                        <>
                            <Image
                                src="/images/hero-carousel-1.png"
                                alt="Djavacoal Company Profile"
                                width={1280}
                                height={720}
                                className="h-[240px] w-full object-cover md:h-[380px] lg:h-[420px]"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                            {/* Top-left title */}
                            <div className="absolute top-0 left-0 w-full bg-black/40 px-5 py-3 text-[13px] text-white italic md:text-[15px]">
                                Company Profile -{" "}
                                <span className="text-[#EFA12D]">
                                    Djavacoal Indonesia
                                </span>
                            </div>

                            {/* Center Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button
                                    onClick={() => setIsPlaying(true)}
                                    className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-[#EFA12D] transition-transform hover:scale-110 md:h-[85px] md:w-[85px]"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="white"
                                        className="h-8 w-8 md:h-10 md:w-10"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    ) : (
                        // 🎥 Saat play → tampilkan YouTube video
                        <iframe
                            className="h-[240px] w-full md:h-[380px] lg:h-[420px]"
                            src="https://www.youtube.com/embed/NWO_S1Kh6U0?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1"
                            title="Djavacoal Company Profile"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    )}

                    {/* ✅ Watermark tetap muncul di atas semua */}
                    <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 scale-55 opacity-90">
                        <Image
                            src="/images/logo.png"
                            alt="Djavacoal Watermark"
                            width={180}
                            height={60}
                            className="object-contain drop-shadow-lg"
                        />
                    </div>
                </div>

                {/* ✅ LEFT: Description */}
                <div className="order-2 flex w-full flex-col items-start justify-center gap-6 text-left lg:order-1 lg:w-1/2">
                    <h2 className="font-['Josefin_Sans'] text-3xl font-bold text-white md:text-4xl lg:text-[42px]">
                        CV. DJAVACOAL
                        <span className="text-[#EFA12D]"> INDONESIA</span>{" "}
                    </h2>
                    <div className="space-y-5 text-justify font-['Open_Sans'] text-[15px] leading-[1.8em] text-[#CFCFCF] md:text-[16px]">
                        <p>
                            Djavacoal Indonesia is a trusted supplier and
                            exporter of premium coconut charcoal briquettes, BBQ
                            charcoal briquettes, sawdust charcoal and natural
                            wood charcoal. We are dedicated to fostering
                            innovation within our company and to operating at
                            the international level within the briquette
                            industry. We are committed to meeting the needs of
                            our partners and contributing to the growth of the
                            Indonesian economy.
                        </p>
                        <p>
                            In addition to producing charcoal briquettes, our
                            company is also a supplier of natural hardwood
                            charcoal. This is sourced from tamarind, halaban,
                            rosewood and a variety of other hardwoods, which are
                            in high demand for export to various countries.
                            <br />
                            Given our extensive experience in the charcoal
                            industry, we are confident that we would be able to
                            collaborate and cooperate with your company in the
                            future.
                        </p>
                        <p>
                            Indonesia is renowned for its high-quality coconut
                            charcoal. We are confident that we can guarantee the
                            processing of our products using the finest quality
                            raw materials. As a supplier, we operate three
                            factories in close collaboration on Java Island,
                            Indonesia.
                        </p>
                    </div>

                    {/* ✅ CTA */}
                    <div className="flex w-full justify-center lg:justify-start">
                        <Link
                            href="/about-us"
                            className="group relative mt-2 inline-flex items-center gap-2 pb-1 font-['Open_Sans'] text-lg font-semibold text-[#EFA12D] md:text-xl"
                        >
                            <span className="relative">
                                <span className="italic">Get</span>&nbsp;to Know
                                Us!
                                <span className="absolute bottom-[-3px] left-0 h-[2px] w-[25px] bg-[#EFA12D] transition-all duration-500 ease-out group-hover:w-full group-hover:bg-[#EFA12D]" />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
